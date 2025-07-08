import type { GetMainPlanDetailsResponse, ApiErrorResponse } from "@/types";

import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/service/db";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<GetMainPlanDetailsResponse | ApiErrorResponse>> {
  try {
    // Get parameters from URL search parameters
    const { searchParams } = new URL(request.url);
    const stateCode = searchParams.get("state_code");
    const countyName = searchParams.get("county_name");
    const familyMakeup = searchParams.get("family_makeup");

    // Validate required parameters
    if (!stateCode) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "state_code parameter is required" },
        { status: 400 },
      );
    }

    if (!countyName) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "county_name parameter is required" },
        { status: 400 },
      );
    }

    // Define base columns
    const baseColumns = [
      "id",
      "metal_level",
      "issuer_name",
      "plan_id_standard_component",
      "plan_marketing_name",
      "plan_type",
    ];

    // Define premium columns based on family makeup
    const getPremiumColumns = (familyType: string | null): string[] => {
      if (!familyType) return [];

      const ageRanges = ["21", "30", "40", "50"];

      switch (familyType) {
        case "adult_individual":
          return ageRanges.map((age) => `premium_adult_individual_age_${age}`);
        case "couple":
          return ageRanges.map((age) => `premium_couple_${age}`);
        case "couple_one_child":
          return ageRanges.map((age) => `couple_plus_1_child_age_${age}`);
        case "couple_two_children":
          return ageRanges.map((age) => `couple_plus_2_children_age_${age}`);
        case "couple_three_children":
          return ageRanges.map(
            (age) => `couple_plus_3_or_more_children_age_${age}`,
          );
        case "individual_one_children":
          return ageRanges.map((age) => `individual_plus_1_child_age_${age}`);
        case "individual_two_children":
          return ageRanges.map(
            (age) => `individual_plus_2_children_age_${age}`,
          );
        case "individual_three_children":
          return ageRanges.map(
            (age) => `individual_plus_3_or_more_children_age_${age}`,
          );
        default:
          return [];
      }
    };

    const premiumColumns = getPremiumColumns(familyMakeup);
    const allColumns = [...baseColumns, ...premiumColumns].join(", ");

    // Query Supabase for plan details
    const { data, error } = await supabase
      .from("marketplace_plans")
      .select(allColumns)
      .eq("state_code", stateCode.toUpperCase())
      .eq("county_name", countyName)
      .not("metal_level", "is", null)
      .order("issuer_name, plan_marketing_name");

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Supabase error:", error);

      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to fetch plan details from database" },
        { status: 500 },
      );
    }

    // Calculate average premium for each plan if premium columns are requested
    const calculateAveragePremium = (
      planData: any,
      premiumCols: string[],
    ): number | null => {
      if (premiumCols.length === 0) return null;

      const premiumValues = premiumCols
        .map((col) => planData[col])
        .filter(
          (val) => val !== null && val !== undefined && !isNaN(Number(val)),
        )
        .map((val) => Number(val));

      if (premiumValues.length === 0) return null;

      return (
        premiumValues.reduce((sum, val) => sum + val, 0) / premiumValues.length
      );
    };

    // Process and filter plans
    const plans = data
      .filter(
        (plan: any) =>
          plan.id &&
          plan.metal_level &&
          plan.issuer_name &&
          plan.plan_id_standard_component &&
          plan.plan_marketing_name &&
          plan.plan_type,
      )
      .map((plan: any) => {
        const basePlan = {
          id: plan.id,
          metal_level: plan.metal_level,
          issuer_name: plan.issuer_name,
          plan_id_standard_component: plan.plan_id_standard_component,
          plan_marketing_name: plan.plan_marketing_name,
          plan_type: plan.plan_type,
        };

        // Add average premium if premium columns were requested
        if (premiumColumns.length > 0) {
          const averagePremium = calculateAveragePremium(plan, premiumColumns);

          return {
            ...basePlan,
            average_premium: averagePremium,
          };
        }

        return basePlan;
      });

    return NextResponse.json<GetMainPlanDetailsResponse>({
      plans: plans,
      count: plans.length,
      state_code: stateCode.toUpperCase(),
      county_name: countyName,
      family_makeup: familyMakeup,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("API error:", error);

    return NextResponse.json<ApiErrorResponse>(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
