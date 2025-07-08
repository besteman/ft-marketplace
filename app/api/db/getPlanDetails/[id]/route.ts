import type { DetailedPlanDetails } from "@/types";

import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/service/db";

// Type for the plan details response
export interface GetPlanDetailsResponse {
  plan: DetailedPlanDetails | null;
}

export interface ApiErrorResponse {
  error: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<GetPlanDetailsResponse | ApiErrorResponse>> {
  try {
    const { id } = await params;

    // Validate required parameter
    if (!id) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Plan ID is required" },
        { status: 400 },
      );
    }

    // Define all the columns to select
    const columns = [
      "id",
      "state_code",
      "fips_county_code",
      "county_name",
      "metal_level",
      "issuer_name",
      "hios_issuer_id",
      "plan_id_standard_component",
      "plan_marketing_name",
      "standardized_plan_option",
      "plan_type",
      "rating_area",
      "child_only_offering",
      "source",
      "customer_service_phone_number_local",
      "customer_service_phone_number_toll_free",
      "customer_service_phone_number_tty",
      "network_url",
      "plan_brochure_url",
      "summary_of_benefits_url",
      "drug_formulary_url",
      "adult_dental",
      "child_dental",
      "ehb_percent_of_total_premium",
      "premium_child_age_0_14",
      "premium_child_age_18",
      "premium_adult_individual_age_21",
      "premium_adult_individual_age_27",
      "premium_adult_individual_age_30",
      "premium_adult_individual_age_40",
      "premium_adult_individual_age_50",
      "premium_adult_individual_age_60",
      "premium_couple_21",
      "premium_couple_30",
      "premium_couple_40",
      "premium_couple_50",
      "premium_couple_60",
      "couple_plus_1_child_age_21",
      "couple_plus_1_child_age_30",
      "couple_plus_1_child_age_40",
      "couple_plus_1_child_age_50",
      "couple_plus_2_children_age_21",
      "couple_plus_2_children_age_30",
      "couple_plus_2_children_age_40",
      "couple_plus_2_children_age_50",
      "couple_plus_3_or_more_children_age_21",
      "couple_plus_3_or_more_children_age_30",
      "couple_plus_3_or_more_children_age_40",
      "couple_plus_3_or_more_children_age_50",
      "individual_plus_1_child_age_21",
      "individual_plus_1_child_age_30",
      "individual_plus_1_child_age_40",
      "individual_plus_1_child_age_50",
      "individual_plus_2_children_age_21",
      "individual_plus_2_children_age_30",
      "individual_plus_2_children_age_40",
      "individual_plus_2_children_age_50",
      "individual_plus_3_or_more_children_age_21",
      "individual_plus_3_or_more_children_age_30",
      "individual_plus_3_or_more_children_age_40",
      "individual_plus_3_or_more_children_age_50",
      "medical_deductible_individual_standard",
      "drug_deductible_individual_standard",
      "medical_deductible_family_standard",
      "drug_deductible_family_standard",
      "medical_deductible_family_per_person_standard",
      "drug_deductible_family_per_person_standard",
      "medical_maximum_out_of_pocket_individual_standard",
      "drug_maximum_out_of_pocket_individual_standard",
      "medical_maximum_out_of_pocket_family_standard",
      "drug_maximum_out_of_pocket_family_standard",
      "medical_maximum_out_of_pocket_family_per_person_standard",
      "drug_maximum_out_of_pocket_family_per_person_standard",
      "primary_care_physician_standard",
      "specialist_standard",
      "emergency_room_standard",
      "inpatient_facility_standard",
      "inpatient_physician_standard",
      "generic_drugs_standard",
      "preferred_brand_drugs_standard",
      "non_preferred_brand_drugs_standard",
      "specialty_drugs_standard",
    ].join(", ");

    // Query Supabase for plan details by ID
    const { data, error } = await supabase
      .from("marketplace_plans")
      .select(columns)
      .eq("id", id)
      .single();

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Supabase error:", error);

      if (error.code === "PGRST116") {
        // No rows returned
        return NextResponse.json<GetPlanDetailsResponse>(
          { plan: null },
          { status: 404 },
        );
      }

      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to fetch plan details from database" },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json<GetPlanDetailsResponse>(
        { plan: null },
        { status: 404 },
      );
    }

    return NextResponse.json<GetPlanDetailsResponse>({
      plan: data as unknown as DetailedPlanDetails,
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
