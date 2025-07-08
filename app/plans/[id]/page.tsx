"use client";

import type { DetailedPlanDetails } from "@/types";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@heroui/button";

export default function PlanDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [planDetails, setPlanDetails] = useState<DetailedPlanDetails | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get URL parameters
  const planId = params?.id as string;
  const familyMakeup = searchParams?.get("family_makeup");
  const averageMonthlySalary = searchParams?.get("average_monthly_salary");
  const ichraAmount = searchParams?.get("ichra_amount");

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (!planId) return;

      try {
        setLoading(true);
        setError(null);

        // TODO: Create API endpoint to fetch individual plan details by ID
        // For now, this is a placeholder - you'll need to implement the API endpoint
        const response = await fetch(`/api/db/getPlanDetails/${planId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch plan details");
        }

        const data = await response.json();

        setPlanDetails(data.plan);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [planId]);

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "N/A";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const calculateAveragePremium = (
    plan: DetailedPlanDetails,
    familyType: string | null,
  ): number | null => {
    if (!familyType) return null;

    const ageRanges = ["21", "30", "40", "50"];
    let premiumColumns: string[] = [];

    switch (familyType) {
      case "adult_individual":
        premiumColumns = ageRanges.map(
          (age) => `premium_adult_individual_age_${age}`,
        );
        break;
      case "couple":
        premiumColumns = ageRanges.map((age) => `premium_couple_${age}`);
        break;
      case "couple_one_child":
        premiumColumns = ageRanges.map(
          (age) => `couple_plus_1_child_age_${age}`,
        );
        break;
      case "couple_two_children":
        premiumColumns = ageRanges.map(
          (age) => `couple_plus_2_children_age_${age}`,
        );
        break;
      case "couple_three_children":
        premiumColumns = ageRanges.map(
          (age) => `couple_plus_3_or_more_children_age_${age}`,
        );
        break;
      case "individual_one_children":
        premiumColumns = ageRanges.map(
          (age) => `individual_plus_1_child_age_${age}`,
        );
        break;
      case "individual_two_children":
        premiumColumns = ageRanges.map(
          (age) => `individual_plus_2_children_age_${age}`,
        );
        break;
      case "individual_three_children":
        premiumColumns = ageRanges.map(
          (age) => `individual_plus_3_or_more_children_age_${age}`,
        );
        break;
      default:
        return null;
    }

    const premiumValues = premiumColumns
      .map((col) => (plan as any)[col])
      .filter((val) => val !== null && val !== undefined && !isNaN(Number(val)))
      .map((val) => Number(val));

    if (premiumValues.length === 0) return null;

    return (
      premiumValues.reduce((sum, val) => sum + val, 0) / premiumValues.length
    );
  };

  const calculateNetCost = (
    averagePremium: number | null | undefined,
  ): number | null => {
    if (!averagePremium || !averageMonthlySalary || !ichraAmount) {
      return null;
    }

    const monthlySalary = parseFloat(averageMonthlySalary);
    const ichra = parseFloat(ichraAmount);

    // Formula: Average Monthly Salary + ICHRA amount - Avg Premium
    return monthlySalary + ichra - averagePremium;
  };

  const calculateOutOfPocketPremium = (
    averagePremium: number | null | undefined,
  ): number | null => {
    if (!averagePremium || !ichraAmount) {
      return null;
    }

    const ichra = parseFloat(ichraAmount);

    // Formula: Avg Premium - ICHRA amount
    return Math.max(0, averagePremium - ichra);
  };

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full max-w-4xl rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-700">
          Loading plan details...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full max-w-4xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Error: {error}
        </div>
        <Link href="/plans?restore=true">
          <Button color="primary">Back to Plans</Button>
        </Link>
      </section>
    );
  }

  if (!planDetails) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full max-w-4xl rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
          Plan not found
        </div>
        <Link href="/plans?restore=true">
          <Button color="primary">Back to Plans</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
      {/* Back Button */}
      <div className="w-full max-w-4xl">
        <Link href="/plans?restore=true">
          <Button color="secondary" variant="bordered">
            ← Back to Plans
          </Button>
        </Link>
      </div>

      {/* Plan Details Card */}
      <div className="w-full max-w-4xl rounded-lg border border-gray-200 bg-white shadow-md">
        <div className="border-b border-gray-200 p-6 pb-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-gray-800">
              {planDetails.plan_marketing_name}
            </h1>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {planDetails.metal_level}
              </span>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                {planDetails.plan_type}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Basic Plan Information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-700">
                Plan Information
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Issuer:</span>{" "}
                  {planDetails.issuer_name}
                </div>
                <div>
                  <span className="font-medium">Plan ID:</span>{" "}
                  {planDetails.plan_id_standard_component}
                </div>
                <div>
                  <span className="font-medium">Metal Level:</span>{" "}
                  {planDetails.metal_level}
                </div>
                <div>
                  <span className="font-medium">Plan Type:</span>{" "}
                  {planDetails.plan_type}
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-700">
                Financial Details
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Average Premium:</span>{" "}
                  {formatCurrency(
                    calculateAveragePremium(planDetails, familyMakeup),
                  )}
                </div>
                {ichraAmount && (
                  <div>
                    <span className="font-medium">Out-of-Pocket Premium:</span>{" "}
                    {formatCurrency(
                      calculateOutOfPocketPremium(
                        calculateAveragePremium(planDetails, familyMakeup),
                      ),
                    )}
                  </div>
                )}
                {averageMonthlySalary && ichraAmount && (
                  <div>
                    <span className="font-medium">Remaining Budget:</span>{" "}
                    {formatCurrency(
                      calculateNetCost(
                        calculateAveragePremium(planDetails, familyMakeup),
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Context Information */}
          {(familyMakeup || averageMonthlySalary || ichraAmount) && (
            <div className="border-t pt-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-700">
                Your Information
              </h3>
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                {familyMakeup && (
                  <div>
                    <span className="font-medium">Family Makeup:</span>{" "}
                    {familyMakeup
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>
                )}
                {averageMonthlySalary && (
                  <div>
                    <span className="font-medium">Monthly Salary:</span>{" "}
                    {formatCurrency(parseFloat(averageMonthlySalary))}
                  </div>
                )}
                {ichraAmount && (
                  <div>
                    <span className="font-medium">ICHRA Amount:</span>{" "}
                    {formatCurrency(parseFloat(ichraAmount))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t pt-4">
            <div className="flex gap-4">
              <Button color="primary" size="lg">
                Select This Plan
              </Button>
              <Button color="secondary" size="lg" variant="bordered">
                Compare Plans
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
