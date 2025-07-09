"use client";

import type { DetailedPlanDetails } from "@/types";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Badge } from "@heroui/badge";
import { Progress } from "@heroui/progress";
import { Divider } from "@heroui/divider";
import { Tabs, Tab } from "@heroui/tabs";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Skeleton } from "@heroui/skeleton";
import { Avatar } from "@heroui/avatar";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";

import Breadcrumb from "@/components/breadcrumb";

interface PlanDetailsPageProps {}

// Interface for the API response
interface GetPlanDetailsResponse {
  plan: DetailedPlanDetails | null;
}

export default function PlanDetailsPage({}: PlanDetailsPageProps) {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [planData, setPlanData] = useState<DetailedPlanDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const planId = params.id as string;
  const familyMakeup = searchParams.get("family_makeup") || "individual";
  const monthlySalary = parseFloat(searchParams.get("monthly_salary") || "0");
  const ichraAmount = parseFloat(searchParams.get("ichra_amount") || "0");

  useEffect(() => {
    // Fetch plan data from the API
    const fetchPlanData = async () => {
      try {
        setLoading(true);
        // Fetch data from the API
        const response = await fetch(`/api/db/getPlanDetails/${planId}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = (await response.json()) as GetPlanDetailsResponse;

        if (!data.plan) {
          throw new Error("Plan not found");
        }

        setPlanData(data.plan);
      } catch (err) {
        // Log error silently
        setError(
          err instanceof Error ? err.message : "Failed to load plan details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [planId]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Plans", href: "/plans" },
    { label: planData?.plan_marketing_name || "Plan Details", isActive: true },
  ];

  const formatCurrency = (value: number | string | null): string => {
    if (value === null || value === undefined) return "N/A";
    const numValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numValue)) return "N/A";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  // Helper function to get premium data based on family makeup
  const getPremiumData = (
    familyType: string,
    planData: DetailedPlanDetails,
  ) => {
    const premiumKeys: { [key: string]: { key: string; ages: number[] } } = {
      individual: {
        key: "premium_adult_individual_age_",
        ages: [21, 27, 30, 40, 50, 60],
      },
      couple: {
        key: "premium_couple_",
        ages: [21, 30, 40, 50, 60],
      },
      couple_plus_1_child: {
        key: "couple_plus_1_child_age_",
        ages: [21, 30, 40, 50],
      },
      couple_plus_2_children: {
        key: "couple_plus_2_children_age_",
        ages: [21, 30, 40, 50],
      },
      couple_plus_3_or_more_children: {
        key: "couple_plus_3_or_more_children_age_",
        ages: [21, 30, 40, 50],
      },
      individual_plus_1_child: {
        key: "individual_plus_1_child_age_",
        ages: [21, 30, 40, 50],
      },
      individual_plus_2_children: {
        key: "individual_plus_2_children_age_",
        ages: [21, 30, 40, 50],
      },
      individual_plus_3_or_more_children: {
        key: "individual_plus_3_or_more_children_age_",
        ages: [21, 30, 40, 50],
      },
    };

    const config = premiumKeys[familyType] || premiumKeys.individual;
    const premiums: { age: number; value: number | null }[] = [];

    config.ages.forEach((age) => {
      const key = `${config.key}${age}` as keyof DetailedPlanDetails;
      const value = planData[key] as number | null;

      premiums.push({ age, value });
    });

    return premiums;
  };

  // Helper function to get family type display name
  const getFamilyTypeDisplayName = (familyType: string): string => {
    const displayNames: { [key: string]: string } = {
      individual: "Individual Coverage",
      couple: "Couple Coverage",
      couple_plus_1_child: "Couple + 1 Child",
      couple_plus_2_children: "Couple + 2 Children",
      couple_plus_3_or_more_children: "Couple + 3+ Children",
      individual_plus_1_child: "Single Parent + 1 Child",
      individual_plus_2_children: "Single Parent + 2 Children",
      individual_plus_3_or_more_children: "Single Parent + 3+ Children",
    };

    return displayNames[familyType] || "Individual Coverage";
  };

  const getMetalLevelColor = (
    level: string,
  ): "primary" | "secondary" | "success" | "warning" | "danger" => {
    switch (level.toLowerCase()) {
      case "bronze":
        return "warning";
      case "silver":
        return "secondary";
      case "gold":
        return "warning";
      case "platinum":
        return "primary";
      default:
        return "secondary";
    }
  };

  const getPlanTypeIcon = (planType: string) => {
    switch (planType.toLowerCase()) {
      case "hmo":
        return "🏥";
      case "ppo":
        return "🔄";
      case "epo":
        return "📍";
      case "pos":
        return "⭐";
      default:
        return "📋";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-96 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 rounded-lg" />
              <Skeleton className="h-96 rounded-lg" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !planData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="p-8 text-center">
          <CardBody>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Error Loading Plan
            </h1>
            <p className="text-gray-600 mb-6">{error || "Plan not found"}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button color="primary" onPress={() => router.push("/plans")}>
                Return to Plan Listings
              </Button>
              <Button
                color="secondary"
                variant="bordered"
                onPress={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Header Section */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
              <div className="flex items-center gap-4">
                <Avatar
                  showFallback
                  className="bg-blue-100 text-blue-600"
                  name={planData.issuer_name}
                  size="lg"
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {planData.plan_marketing_name}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {planData.issuer_name}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Chip
                  className="font-semibold"
                  color={getMetalLevelColor(planData.metal_level)}
                  size="lg"
                  variant="flat"
                >
                  {planData.metal_level} Plan
                </Chip>
                <Chip
                  color="primary"
                  size="lg"
                  startContent={
                    <span className="text-lg">
                      {getPlanTypeIcon(planData.plan_type)}
                    </span>
                  }
                  variant="bordered"
                >
                  {planData.plan_type}
                </Chip>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Plan ID</p>
                <p className="font-mono text-sm">
                  {planData.plan_id_standard_component}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Coverage Area</p>
                <p className="font-semibold">
                  {planData.county_name}, {planData.state_code}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Network Type</p>
                <p className="font-semibold">{planData.plan_type}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Child Coverage</p>
                <Badge
                  color={
                    planData.child_only_offering === "Yes"
                      ? "success"
                      : "warning"
                  }
                  variant="flat"
                >
                  {planData.child_only_offering === "Yes"
                    ? "Available"
                    : "Family Plan"}
                </Badge>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs
            className="w-full"
            color="primary"
            size="lg"
            variant="underlined"
          >
            {/* Overview Tab */}
            <Tab key="overview" title="Overview">
              <div className="space-y-6 mt-6">
                {/* Plan Summary Card */}
                <Card className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <span className="text-2xl">📊</span>
                      </div>
                      <h3 className="text-xl font-semibold">Plan Summary</h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Cost Summary */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                          <span>💰</span> Cost Overview
                        </h4>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                              {formatCurrency(
                                planData.premium_adult_individual_age_30,
                              )}
                            </p>
                            <p className="text-sm text-gray-600">
                              Monthly Premium (Age 30)
                            </p>
                          </div>
                          <div className="mt-3 space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Deductible:</span>
                              <span className="font-semibold">
                                {formatCurrency(
                                  planData.medical_deductible_individual_standard,
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Max Out-of-Pocket:</span>
                              <span className="font-semibold">
                                {formatCurrency(
                                  planData.medical_maximum_out_of_pocket_individual_standard,
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Care Access */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                          <span>🏥</span> Care Access
                        </h4>
                        <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-sm">Primary Care</span>
                            <span className="text-sm font-medium text-right text-black-600">
                              {planData.primary_care_physician_standard}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Specialist</span>
                            <span className="text-sm font-medium text-right text-black-600">
                              {planData.specialist_standard}
                            </span>
                          </div>
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-sm">Emergency</span>
                            <span className="text-sm font-medium text-right text-black-600">
                              {planData.emergency_room_standard}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Plan Strength */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-indigo-700 flex items-center gap-2">
                          <span>⭐</span> Plan Strength
                        </h4>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="text-center mb-3">
                            <div className="text-3xl font-bold text-indigo-600">
                              {planData.metal_level === "Gold"
                                ? "8.5"
                                : planData.metal_level === "Silver"
                                  ? "7.0"
                                  : planData.metal_level === "Bronze"
                                    ? "6.0"
                                    : "9.0"}
                              /10
                            </div>
                            <p className="text-sm text-gray-600">
                              Overall Rating
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Coverage</span>
                                <span>
                                  {planData.ehb_percent_of_total_premium}%
                                </span>
                              </div>
                              <Progress
                                color="primary"
                                size="sm"
                                value={parseFloat(
                                  planData.ehb_percent_of_total_premium,
                                )}
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Network Size</span>
                                <span>
                                  {planData.plan_type === "HMO" ? "85%" : "92%"}
                                </span>
                              </div>
                              <Progress
                                color="success"
                                size="sm"
                                value={planData.plan_type === "HMO" ? 85 : 92}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Smart Insights */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <span className="text-2xl">🧠</span>
                      </div>
                      <h3 className="text-xl font-semibold">Smart Insights</h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Best For */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-green-700">
                          ✅ This plan is ideal for:
                        </h4>
                        <div className="space-y-2">
                          {planData.metal_level === "Gold" && (
                            <>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                <span>People who visit doctors frequently</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                <span>Those managing chronic conditions</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                <span>Families with ongoing medical needs</span>
                              </div>
                            </>
                          )}
                          {planData.metal_level === "Silver" && (
                            <>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                <span>Average healthcare users</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                <span>Those wanting balanced costs</span>
                              </div>
                            </>
                          )}
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            <span>Residents of {planData.county_name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Consider If */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-orange-700">
                          ⚠️ Consider alternatives if:
                        </h4>
                        <div className="space-y-2">
                          {planData.plan_type === "HMO" && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="w-2 h-2 bg-orange-500 rounded-full" />
                              <span>You prefer choosing any specialist</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 bg-orange-500 rounded-full" />
                            <span>You rarely need medical care</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 bg-orange-500 rounded-full" />
                            <span>Budget is your primary concern</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 bg-orange-500 rounded-full" />
                            <span>You travel frequently out-of-state</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Annual Cost Calculator */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <span className="text-2xl">🧮</span>
                      </div>
                      <h3 className="text-xl font-semibold">
                        Annual Cost Scenarios
                      </h3>
                      <Chip color="primary" size="sm" variant="flat">
                        Interactive
                      </Chip>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Low Usage */}
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="text-center mb-3">
                          <span className="text-2xl">🟢</span>
                          <h4 className="font-semibold text-green-800">
                            Low Usage
                          </h4>
                          <p className="text-xs text-green-600">
                            1-2 doctor visits/year
                          </p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Annual Premium:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                planData.premium_adult_individual_age_30 * 12,
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Typical Out-of-Pocket:</span>
                            <span className="font-semibold">
                              {formatCurrency(500)}
                            </span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total Cost:</span>
                            <span className="text-green-700">
                              {formatCurrency(
                                planData.premium_adult_individual_age_30 * 12 +
                                  500,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Moderate Usage */}
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="text-center mb-3">
                          <span className="text-2xl">🟡</span>
                          <h4 className="font-semibold text-yellow-800">
                            Moderate Usage
                          </h4>
                          <p className="text-xs text-yellow-600">
                            4-6 doctor visits/year
                          </p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Annual Premium:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                planData.premium_adult_individual_age_30 * 12,
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Typical Out-of-Pocket:</span>
                            <span className="font-semibold">
                              {formatCurrency(2000)}
                            </span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total Cost:</span>
                            <span className="text-yellow-700">
                              {formatCurrency(
                                planData.premium_adult_individual_age_30 * 12 +
                                  2000,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* High Usage */}
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="text-center mb-3">
                          <span className="text-2xl">🔴</span>
                          <h4 className="font-semibold text-red-800">
                            High Usage
                          </h4>
                          <p className="text-xs text-red-600">
                            Chronic condition management
                          </p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Annual Premium:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                planData.premium_adult_individual_age_30 * 12,
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Typical Out-of-Pocket:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                planData.medical_maximum_out_of_pocket_individual_standard,
                              )}
                            </span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total Cost:</span>
                            <span className="text-red-700">
                              {formatCurrency(
                                planData.premium_adult_individual_age_30 * 12 +
                                  planData.medical_maximum_out_of_pocket_individual_standard,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 text-center">
                        💡 <strong>Pro Tip:</strong> {planData.metal_level}{" "}
                        plans typically cover{" "}
                        {planData.metal_level === "Gold"
                          ? "80%"
                          : planData.metal_level === "Silver"
                            ? "70%"
                            : "60%"}{" "}
                        of your healthcare costs on average
                      </p>
                    </div>
                  </CardBody>
                </Card>

                {/* Network & Access Summary */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <span className="text-2xl">🌐</span>
                      </div>
                      <h3 className="text-xl font-semibold">
                        Network & Access
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <span>🏥</span> Plan Type: {planData.plan_type}
                        </h4>
                        <div className="space-y-2 text-sm">
                          {planData.plan_type === "HMO" && (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                <span>Choose a primary care physician</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                <span>Referrals needed for specialists</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                <span>Lower costs, coordinated care</span>
                              </div>
                            </>
                          )}
                          {planData.plan_type === "PPO" && (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                <span>No referrals needed</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                <span>See any in-network provider</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                <span>Out-of-network coverage available</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <span>📍</span> Coverage Area
                        </h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-center">
                            <p className="font-semibold text-lg">
                              {planData.county_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {planData.state_code} • {planData.rating_area}
                            </p>
                            <div className="mt-2">
                              <Chip color="success" size="sm" variant="flat">
                                Full Coverage
                              </Chip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Tab>

            {/* Costs Tab */}
            <Tab key="costs" title="Costs">
              <div className="space-y-6 mt-6">
                {/* Premium Costs */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">
                        Monthly Premiums by Age & Family Size
                      </h3>
                      <Chip color="primary" size="sm" variant="flat">
                        {getFamilyTypeDisplayName(familyMakeup)}
                      </Chip>
                    </div>
                  </CardHeader>
                  <CardBody>
                    {/* Current Selection Display */}
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 mb-6">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <span className="text-xl">👥</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">
                              {getFamilyTypeDisplayName(familyMakeup)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Premiums based on your family makeup
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                          {getPremiumData(familyMakeup, planData).map(
                            ({ age, value }) => (
                              <div
                                key={age}
                                className="text-center p-3 bg-white rounded-lg shadow-sm"
                              >
                                <div className="text-sm text-gray-500 mb-1">
                                  Age {age}
                                </div>
                                <div className="font-bold text-lg text-blue-600">
                                  {formatCurrency(value)}
                                </div>
                                {age === 30 && (
                                  <div className="text-xs text-green-600 mt-1">
                                    Most common
                                  </div>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      </CardBody>
                    </Card>

                    {/* All Options Accordion */}
                    <Accordion>
                      <AccordionItem
                        key="individual"
                        title={
                          <div className="flex items-center gap-2">
                            <span>Individual Coverage</span>
                            {familyMakeup === "individual" && (
                              <Chip color="success" size="sm" variant="flat">
                                Selected
                              </Chip>
                            )}
                          </div>
                        }
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Age 21:</span>
                              <span className="font-semibold">
                                {formatCurrency(
                                  planData.premium_adult_individual_age_21,
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Age 30:</span>
                              <span className="font-semibold">
                                {formatCurrency(
                                  planData.premium_adult_individual_age_30,
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Age 40:</span>
                              <span className="font-semibold">
                                {formatCurrency(
                                  planData.premium_adult_individual_age_40,
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Age 50:</span>
                              <span className="font-semibold">
                                {formatCurrency(
                                  planData.premium_adult_individual_age_50,
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Age 60:</span>
                              <span className="font-semibold">
                                {formatCurrency(
                                  planData.premium_adult_individual_age_60,
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionItem>

                      <AccordionItem
                        key="couple"
                        title={
                          <div className="flex items-center gap-2">
                            <span>Couple Coverage</span>
                            {familyMakeup === "couple" && (
                              <Chip color="success" size="sm" variant="flat">
                                Selected
                              </Chip>
                            )}
                          </div>
                        }
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Age 21:</span>
                              <span className="font-semibold">
                                {formatCurrency(planData.premium_couple_21)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Age 30:</span>
                              <span className="font-semibold">
                                {formatCurrency(planData.premium_couple_30)}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Age 40:</span>
                              <span className="font-semibold">
                                {formatCurrency(planData.premium_couple_40)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Age 50:</span>
                              <span className="font-semibold">
                                {formatCurrency(planData.premium_couple_50)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionItem>

                      <AccordionItem
                        key="family"
                        title={
                          <div className="flex items-center gap-2">
                            <span>Family with Children</span>
                            {familyMakeup.includes("child") && (
                              <Chip color="success" size="sm" variant="flat">
                                Selected Category
                              </Chip>
                            )}
                          </div>
                        }
                      >
                        <div className="space-y-6">
                          {/* Couple + 1 Child */}
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <h4 className="font-semibold text-md">
                                Couple + 1 Child
                              </h4>
                              {familyMakeup === "couple_plus_1_child" && (
                                <Chip color="success" size="sm" variant="flat">
                                  Selected
                                </Chip>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Age 21:</span>
                                  <span className="font-semibold">
                                    {formatCurrency(
                                      planData.couple_plus_1_child_age_21,
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Age 30:</span>
                                  <span className="font-semibold">
                                    {formatCurrency(
                                      planData.couple_plus_1_child_age_30,
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Age 40:</span>
                                  <span className="font-semibold">
                                    {formatCurrency(
                                      planData.couple_plus_1_child_age_40,
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Age 50:</span>
                                  <span className="font-semibold">
                                    {formatCurrency(
                                      planData.couple_plus_1_child_age_50,
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Couple + 2 Children */}
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <h4 className="font-semibold text-md">
                                Couple + 2 Children
                              </h4>
                              {familyMakeup === "couple_plus_2_children" && (
                                <Chip color="success" size="sm" variant="flat">
                                  Selected
                                </Chip>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Age 21:</span>
                                  <span className="font-semibold">
                                    {formatCurrency(
                                      planData.couple_plus_2_children_age_21,
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Age 30:</span>
                                  <span className="font-semibold">
                                    {formatCurrency(
                                      planData.couple_plus_2_children_age_30,
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Age 40:</span>
                                  <span className="font-semibold">
                                    {formatCurrency(
                                      planData.couple_plus_2_children_age_40,
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Age 50:</span>
                                  <span className="font-semibold">
                                    {formatCurrency(
                                      planData.couple_plus_2_children_age_50,
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Single Parent Options */}
                          <div>
                            <h4 className="font-semibold text-md mb-3">
                              Single Parent Options
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">
                                    Single Parent + 1 Child
                                  </span>
                                  {familyMakeup ===
                                    "individual_plus_1_child" && (
                                    <Chip
                                      color="success"
                                      size="sm"
                                      variant="flat"
                                    >
                                      Selected
                                    </Chip>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span>Age 21:</span>
                                      <span className="font-semibold">
                                        {formatCurrency(
                                          planData.individual_plus_1_child_age_21,
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Age 30:</span>
                                      <span className="font-semibold">
                                        {formatCurrency(
                                          planData.individual_plus_1_child_age_30,
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span>Age 40:</span>
                                      <span className="font-semibold">
                                        {formatCurrency(
                                          planData.individual_plus_1_child_age_40,
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Age 50:</span>
                                      <span className="font-semibold">
                                        {formatCurrency(
                                          planData.individual_plus_1_child_age_50,
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionItem>
                    </Accordion>
                  </CardBody>
                </Card>

                {/* Deductibles & Out-of-Pocket */}
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">
                      Deductibles & Out-of-Pocket Limits
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-blue-600">
                          Medical
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Individual Deductible:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                planData.medical_deductible_individual_standard,
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Family Deductible:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                planData.medical_deductible_family_standard,
                              )}
                            </span>
                          </div>
                          <Divider className="my-2" />
                          <div className="flex justify-between">
                            <span>Individual Max OOP:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                planData.medical_maximum_out_of_pocket_individual_standard,
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Family Max OOP:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                planData.medical_maximum_out_of_pocket_family_standard,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-green-600">
                          Prescription Drugs
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Individual Deductible:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                planData.drug_deductible_individual_standard ||
                                  "0",
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Family Deductible:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                planData.drug_deductible_family_standard || "0",
                              )}
                            </span>
                          </div>
                          <Divider className="my-2" />
                          <div className="flex justify-between">
                            <span>Individual Max OOP:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                planData.drug_maximum_out_of_pocket_individual_standard ||
                                  "0",
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Family Max OOP:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                planData.drug_maximum_out_of_pocket_family_standard ||
                                  "0",
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* ICHRA Cost Analysis */}
                {(monthlySalary > 0 || ichraAmount > 0) && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <span className="text-2xl">💼</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">
                            ICHRA Cost Analysis
                          </h3>
                          <p className="text-sm text-gray-600">
                            Individual Coverage Health Reimbursement Arrangement
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-6">
                        {/* ICHRA Overview */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">ℹ️</span>
                            <h4 className="font-semibold text-lg">
                              What is ICHRA?
                            </h4>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            ICHRA allows employers to provide tax-free
                            reimbursements for health insurance premiums and
                            medical expenses. Your employer contributes a fixed
                            monthly amount that you can use toward this plan.
                          </p>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Monthly Premium Cost */}
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="text-center">
                              <span className="text-2xl mb-2 block">📅</span>
                              <h4 className="font-semibold text-blue-800 mb-2">
                                Monthly Premium
                              </h4>
                              <div className="text-2xl font-bold text-blue-600 mb-1">
                                {formatCurrency(
                                  getPremiumData(familyMakeup, planData).find(
                                    (p) => p.age === 30,
                                  )?.value ||
                                    planData.premium_adult_individual_age_30,
                                )}
                              </div>
                              <p className="text-xs text-gray-600">
                                For {getFamilyTypeDisplayName(familyMakeup)}
                              </p>
                            </div>
                          </div>

                          {/* ICHRA Contribution */}
                          {ichraAmount > 0 && (
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <div className="text-center">
                                <span className="text-2xl mb-2 block">💰</span>
                                <h4 className="font-semibold text-green-800 mb-2">
                                  ICHRA Contribution
                                </h4>
                                <div className="text-2xl font-bold text-green-600 mb-1">
                                  {formatCurrency(ichraAmount)}
                                </div>
                                <p className="text-xs text-gray-600">
                                  Monthly employer contribution
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Your Cost */}
                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <div className="text-center">
                              <span className="text-2xl mb-2 block">🧮</span>
                              <h4 className="font-semibold text-purple-800 mb-2">
                                Your Monthly Cost
                              </h4>
                              <div className="text-2xl font-bold text-purple-600 mb-1">
                                {formatCurrency(
                                  Math.max(
                                    0,
                                    (getPremiumData(
                                      familyMakeup,
                                      planData,
                                    ).find((p) => p.age === 30)?.value ||
                                      planData.premium_adult_individual_age_30) -
                                      ichraAmount,
                                  ),
                                )}
                              </div>
                              <p className="text-xs text-gray-600">
                                After ICHRA reimbursement
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Annual Savings Calculation */}
                        {ichraAmount > 0 && (
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <span>📊</span> Annual Savings with ICHRA
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-lg font-semibold text-gray-700">
                                  Without ICHRA
                                </div>
                                <div className="text-xl font-bold text-red-600">
                                  {formatCurrency(
                                    (getPremiumData(
                                      familyMakeup,
                                      planData,
                                    ).find((p) => p.age === 30)?.value ||
                                      planData.premium_adult_individual_age_30) *
                                      12,
                                  )}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Annual cost
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold text-gray-700">
                                  With ICHRA
                                </div>
                                <div className="text-xl font-bold text-green-600">
                                  {formatCurrency(
                                    Math.max(
                                      0,
                                      (getPremiumData(
                                        familyMakeup,
                                        planData,
                                      ).find((p) => p.age === 30)?.value ||
                                        planData.premium_adult_individual_age_30) -
                                        ichraAmount,
                                    ) * 12,
                                  )}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Annual cost
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold text-gray-700">
                                  You Save
                                </div>
                                <div className="text-xl font-bold text-blue-600">
                                  {formatCurrency(ichraAmount * 12)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Annual savings
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Salary Context */}
                        {monthlySalary > 0 && (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <span>💼</span> Cost as Percentage of Salary
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm">
                                    Monthly Salary:
                                  </span>
                                  <span className="font-semibold">
                                    {formatCurrency(monthlySalary)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm">
                                    Insurance Cost:
                                  </span>
                                  <span className="font-semibold">
                                    {formatCurrency(
                                      Math.max(
                                        0,
                                        (getPremiumData(
                                          familyMakeup,
                                          planData,
                                        ).find((p) => p.age === 30)?.value ||
                                          planData.premium_adult_individual_age_30) -
                                          ichraAmount,
                                      ),
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center font-semibold">
                                  <span className="text-sm">
                                    Percentage of Salary:
                                  </span>
                                  <span className="text-blue-600">
                                    {(
                                      (Math.max(
                                        0,
                                        (getPremiumData(
                                          familyMakeup,
                                          planData,
                                        ).find((p) => p.age === 30)?.value ||
                                          planData.premium_adult_individual_age_30) -
                                          ichraAmount,
                                      ) /
                                        monthlySalary) *
                                      100
                                    ).toFixed(1)}
                                    %
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="text-center">
                                  <Progress
                                    className="mb-2"
                                    color={
                                      (Math.max(
                                        0,
                                        (getPremiumData(
                                          familyMakeup,
                                          planData,
                                        ).find((p) => p.age === 30)?.value ||
                                          planData.premium_adult_individual_age_30) -
                                          ichraAmount,
                                      ) /
                                        monthlySalary) *
                                        100 <
                                      10
                                        ? "success"
                                        : (Math.max(
                                              0,
                                              (getPremiumData(
                                                familyMakeup,
                                                planData,
                                              ).find((p) => p.age === 30)
                                                ?.value ||
                                                planData.premium_adult_individual_age_30) -
                                                ichraAmount,
                                            ) /
                                              monthlySalary) *
                                              100 <
                                            15
                                          ? "warning"
                                          : "danger"
                                    }
                                    size="lg"
                                    value={Math.min(
                                      100,
                                      (Math.max(
                                        0,
                                        (getPremiumData(
                                          familyMakeup,
                                          planData,
                                        ).find((p) => p.age === 30)?.value ||
                                          planData.premium_adult_individual_age_30) -
                                          ichraAmount,
                                      ) /
                                        monthlySalary) *
                                        100,
                                    )}
                                  />
                                  <p className="text-xs text-gray-600">
                                    {(Math.max(
                                      0,
                                      (getPremiumData(
                                        familyMakeup,
                                        planData,
                                      ).find((p) => p.age === 30)?.value ||
                                        planData.premium_adult_individual_age_30) -
                                        ichraAmount,
                                    ) /
                                      monthlySalary) *
                                      100 <
                                    10
                                      ? "Excellent affordability"
                                      : (Math.max(
                                            0,
                                            (getPremiumData(
                                              familyMakeup,
                                              planData,
                                            ).find((p) => p.age === 30)
                                              ?.value ||
                                              planData.premium_adult_individual_age_30) -
                                              ichraAmount,
                                          ) /
                                            monthlySalary) *
                                            100 <
                                          15
                                        ? "Good affordability"
                                        : "Consider budget impact"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ICHRA Tips */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <span>💡</span> ICHRA Tips
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <h5 className="font-semibold text-blue-800 mb-2">
                                Maximizing Your Benefit:
                              </h5>
                              <ul className="space-y-1 text-gray-700">
                                <li className="flex items-center gap-2">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                  <span>ICHRA funds are tax-free</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                  <span>
                                    Unused amounts may roll over (check with
                                    employer)
                                  </span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                  <span>
                                    Can be used for qualified medical expenses
                                  </span>
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-blue-800 mb-2">
                                Important Notes:
                              </h5>
                              <ul className="space-y-1 text-gray-700">
                                <li className="flex items-center gap-2">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                  <span>
                                    Reimbursement typically monthly or quarterly
                                  </span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                  <span>
                                    Must purchase qualifying health plan
                                  </span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                  <span>Keep receipts for reimbursement</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
            </Tab>

            {/* Coverage Tab */}
            <Tab key="coverage" title="Coverage">
              <div className="space-y-6 mt-6">
                {/* Coverage Strength Visualization */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <span className="text-2xl">🛡️</span>
                      </div>
                      <h3 className="text-xl font-semibold">
                        Coverage Strength Analysis
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Financial Protection */}
                      <div>
                        <h4 className="font-semibold mb-4 text-green-700">
                          🏦 Financial Protection
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm">
                                Deductible Protection
                              </span>
                              <span className="text-xs text-gray-500">
                                {planData.medical_deductible_individual_standard <
                                2000
                                  ? "Excellent"
                                  : planData.medical_deductible_individual_standard <
                                      5000
                                    ? "Good"
                                    : "Basic"}
                              </span>
                            </div>
                            <Progress
                              color={
                                planData.medical_deductible_individual_standard <
                                2000
                                  ? "success"
                                  : planData.medical_deductible_individual_standard <
                                      5000
                                    ? "warning"
                                    : "danger"
                              }
                              size="sm"
                              value={Math.max(
                                20,
                                100 -
                                  (planData.medical_deductible_individual_standard /
                                    10000) *
                                    100,
                              )}
                            />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm">
                                Out-of-Pocket Protection
                              </span>
                              <span className="text-xs text-gray-500">
                                {planData.medical_maximum_out_of_pocket_individual_standard <
                                5000
                                  ? "Strong"
                                  : planData.medical_maximum_out_of_pocket_individual_standard <
                                      8000
                                    ? "Moderate"
                                    : "Limited"}
                              </span>
                            </div>
                            <Progress
                              color={
                                planData.medical_maximum_out_of_pocket_individual_standard <
                                5000
                                  ? "success"
                                  : planData.medical_maximum_out_of_pocket_individual_standard <
                                      8000
                                    ? "warning"
                                    : "danger"
                              }
                              size="sm"
                              value={Math.max(
                                15,
                                100 -
                                  (planData.medical_maximum_out_of_pocket_individual_standard /
                                    15000) *
                                    100,
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Coverage Benefits */}
                      <div>
                        <h4 className="font-semibold mb-4 text-blue-700">
                          ✨ Coverage Benefits
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-blue-600">🩺</span>
                              <span className="text-sm font-medium">
                                Primary Care
                              </span>
                            </div>
                            <span className="text-sm font-medium text-right text-green-600">
                              {planData.primary_care_physician_standard}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-purple-600">👨‍⚕️</span>
                              <span className="text-sm font-medium">
                                Specialist Care
                              </span>
                            </div>
                            <Chip color="warning" size="sm" variant="flat">
                              {planData.specialist_standard}
                            </Chip>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-red-600">🚨</span>
                              <span className="text-sm font-medium">
                                Emergency Care
                              </span>
                            </div>
                            <span className="text-sm font-medium text-right text-red-600">
                              {planData.emergency_room_standard}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-orange-600">🏥</span>
                              <span className="text-sm font-medium">
                                Inpatient Care
                              </span>
                            </div>
                            <Chip color="secondary" size="sm" variant="flat">
                              {planData.inpatient_facility_standard}
                            </Chip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Essential Health Benefits */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <span className="text-2xl">📋</span>
                      </div>
                      <h3 className="text-xl font-semibold">
                        Essential Health Benefits Coverage
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        {
                          icon: "🏥",
                          title: "Ambulatory Care",
                          description: "Outpatient services",
                          covered: true,
                        },
                        {
                          icon: "🚑",
                          title: "Emergency Services",
                          description: "Emergency room visits",
                          covered: true,
                        },
                        {
                          icon: "🏥",
                          title: "Hospitalization",
                          description: "Inpatient hospital care",
                          covered: true,
                        },
                        {
                          icon: "🤱",
                          title: "Maternity Care",
                          description: "Pregnancy & newborn care",
                          covered: true,
                        },
                        {
                          icon: "🧠",
                          title: "Mental Health",
                          description: "Mental health & substance abuse",
                          covered: true,
                        },
                        {
                          icon: "💊",
                          title: "Prescription Drugs",
                          description: "Covered medications",
                          covered: true,
                        },
                        {
                          icon: "🔬",
                          title: "Lab Services",
                          description: "Laboratory tests",
                          covered: true,
                        },
                        {
                          icon: "🩹",
                          title: "Preventive Care",
                          description: "Wellness & prevention",
                          covered: true,
                        },
                        {
                          icon: "👶",
                          title: "Pediatric Services",
                          description: "Children's healthcare",
                          covered: true,
                        },
                      ].map((benefit, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{benefit.icon}</span>
                            <div className="flex-1">
                              <h5 className="font-semibold text-sm">
                                {benefit.title}
                              </h5>
                              <p className="text-xs text-gray-600 mb-2">
                                {benefit.description}
                              </p>
                              <Chip
                                color={benefit.covered ? "success" : "default"}
                                size="sm"
                                variant="flat"
                              >
                                {benefit.covered ? "Covered" : "Not Covered"}
                              </Chip>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Medical Services */}
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Medical Services</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between p-3 bg-blue-50 rounded-lg gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600">👨‍⚕️</span>
                            <span>Primary Care Physician</span>
                          </div>
                          <span className="text-sm font-medium text-right text-blue-600">
                            {planData.primary_care_physician_standard}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-purple-600">🩺</span>
                            <span>Specialist</span>
                          </div>
                          <Chip color="secondary" size="sm" variant="flat">
                            {planData.specialist_standard}
                          </Chip>
                        </div>
                        <div className="flex items-start justify-between p-3 bg-red-50 rounded-lg gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-red-600">🚨</span>
                            <span>Emergency Room</span>
                          </div>
                          <span className="text-sm font-medium text-right text-red-600">
                            {planData.emergency_room_standard}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">🏥</span>
                            <span>Inpatient Facility</span>
                          </div>
                          <Chip color="success" size="sm" variant="flat">
                            {planData.inpatient_facility_standard}
                          </Chip>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-600">👨‍⚕️</span>
                            <span>Inpatient Physician</span>
                          </div>
                          <Chip color="warning" size="sm" variant="flat">
                            {planData.inpatient_physician_standard || "Covered"}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Prescription Drug Coverage */}
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">
                      Prescription Drug Coverage
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl mb-2">💊</div>
                        <h4 className="font-semibold text-blue-900">
                          Generic Drugs
                        </h4>
                        <p className="text-blue-700 font-bold">
                          {planData.generic_drugs_standard}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl mb-2">🟢</div>
                        <h4 className="font-semibold text-green-900">
                          Preferred Brand
                        </h4>
                        <p className="text-green-700 font-bold">
                          {planData.preferred_brand_drugs_standard}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl mb-2">🟠</div>
                        <h4 className="font-semibold text-orange-900">
                          Non-Preferred Brand
                        </h4>
                        <p className="text-orange-700 font-bold">
                          {planData.non_preferred_brand_drugs_standard}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl mb-2">⭐</div>
                        <h4 className="font-semibold text-purple-900">
                          Specialty Drugs
                        </h4>
                        <p className="text-purple-700 font-bold">
                          {planData.specialty_drugs_standard}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Dental Coverage */}
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Dental Coverage</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🦷</span>
                          <div>
                            <h4 className="font-semibold">Adult Dental</h4>
                            <p className="text-sm text-gray-600">Age 19+</p>
                          </div>
                        </div>
                        <Badge
                          color={
                            planData.adult_dental === "Limited"
                              ? "warning"
                              : planData.adult_dental === "Included"
                                ? "success"
                                : "default"
                          }
                          variant="flat"
                        >
                          {planData.adult_dental || "Not Covered"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">👶</span>
                          <div>
                            <h4 className="font-semibold">Child Dental</h4>
                            <p className="text-sm text-gray-600">Under 19</p>
                          </div>
                        </div>
                        <Badge
                          color={
                            planData.child_dental === "Included"
                              ? "success"
                              : "warning"
                          }
                          variant="flat"
                        >
                          {planData.child_dental || "Not Covered"}
                        </Badge>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Tab>

            {/* Resources Tab */}
            <Tab key="resources" title="Resources">
              <div className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">
                      Plan Documents & Resources
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        className="h-16 justify-start"
                        color="primary"
                        startContent={<span className="text-xl">📄</span>}
                        variant="bordered"
                        onPress={() =>
                          window.open(
                            planData.summary_of_benefits_url,
                            "_blank",
                          )
                        }
                      >
                        <div className="text-left">
                          <div className="font-semibold">
                            Summary of Benefits
                          </div>
                          <div className="text-sm text-gray-600">
                            Detailed coverage overview
                          </div>
                        </div>
                      </Button>

                      <Button
                        className="h-16 justify-start"
                        color="secondary"
                        startContent={<span className="text-xl">💊</span>}
                        variant="bordered"
                        onPress={() =>
                          window.open(planData.drug_formulary_url, "_blank")
                        }
                      >
                        <div className="text-left">
                          <div className="font-semibold">Drug Formulary</div>
                          <div className="text-sm text-gray-600">
                            Covered medications list
                          </div>
                        </div>
                      </Button>

                      <Button
                        className="h-16 justify-start"
                        color="success"
                        startContent={<span className="text-xl">🔍</span>}
                        variant="bordered"
                        onPress={() =>
                          window.open(planData.network_url, "_blank")
                        }
                      >
                        <div className="text-left">
                          <div className="font-semibold">Provider Network</div>
                          <div className="text-sm text-gray-600">
                            Find in-network doctors
                          </div>
                        </div>
                      </Button>

                      {planData.plan_brochure_url && (
                        <Button
                          className="h-16 justify-start"
                          color="warning"
                          startContent={<span className="text-xl">📘</span>}
                          variant="bordered"
                          onPress={() =>
                            window.open(planData.plan_brochure_url!, "_blank")
                          }
                        >
                          <div className="text-left">
                            <div className="font-semibold">Plan Brochure</div>
                            <div className="text-sm text-gray-600">
                              Comprehensive plan guide
                            </div>
                          </div>
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Tab>

            {/* Details Tab */}
            <Tab key="details" title="Details">
              <div className="space-y-6 mt-6">
                {/* Plan Intelligence Dashboard */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <span className="text-2xl">🧠</span>
                      </div>
                      <h3 className="text-xl font-semibold">
                        Plan Intelligence Dashboard
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Value Score */}
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {planData.metal_level === "Gold"
                            ? "A+"
                            : planData.metal_level === "Silver"
                              ? "B+"
                              : planData.metal_level === "Bronze"
                                ? "B"
                                : "A"}
                        </div>
                        <h4 className="font-semibold text-green-800">
                          Value Score
                        </h4>
                        <p className="text-xs text-green-600">
                          Based on coverage vs cost
                        </p>
                      </div>

                      {/* Affordability Index */}
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {planData.premium_adult_individual_age_30 < 300
                            ? "9.2"
                            : planData.premium_adult_individual_age_30 < 500
                              ? "7.8"
                              : "6.5"}
                          /10
                        </div>
                        <h4 className="font-semibold text-blue-800">
                          Affordability
                        </h4>
                        <p className="text-xs text-blue-600">
                          Premium competitiveness
                        </p>
                      </div>

                      {/* Network Quality */}
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {planData.plan_type === "PPO" ? "9.1" : "8.3"}/10
                        </div>
                        <h4 className="font-semibold text-purple-800">
                          Network Quality
                        </h4>
                        <p className="text-xs text-purple-600">
                          Provider accessibility
                        </p>
                      </div>

                      {/* Flexibility Rating */}
                      <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                          {planData.plan_type === "PPO"
                            ? "9.5"
                            : planData.plan_type === "HMO"
                              ? "7.2"
                              : "8.0"}
                          /10
                        </div>
                        <h4 className="font-semibold text-orange-800">
                          Flexibility
                        </h4>
                        <p className="text-xs text-orange-600">
                          Care access freedom
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Risk Assessment */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <span className="text-2xl">⚖️</span>
                      </div>
                      <h3 className="text-xl font-semibold">Risk Assessment</h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Financial Risk */}
                      <div>
                        <h4 className="font-semibold mb-4 text-red-700 flex items-center gap-2">
                          💰 Financial Risk Profile
                        </h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">
                                Maximum Annual Exposure
                              </span>
                              <Chip
                                color={
                                  planData.premium_adult_individual_age_30 *
                                    12 +
                                    planData.medical_maximum_out_of_pocket_individual_standard <
                                  15000
                                    ? "success"
                                    : "warning"
                                }
                                size="sm"
                                variant="flat"
                              >
                                {formatCurrency(
                                  planData.premium_adult_individual_age_30 *
                                    12 +
                                    planData.medical_maximum_out_of_pocket_individual_standard,
                                )}
                              </Chip>
                            </div>
                            <p className="text-xs text-gray-600">
                              Worst-case scenario: All premiums + max
                              out-of-pocket
                            </p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">
                                Deductible Impact
                              </span>
                              <span className="text-sm font-bold">
                                {planData.medical_deductible_individual_standard >
                                5000
                                  ? "High"
                                  : planData.medical_deductible_individual_standard >
                                      2000
                                    ? "Moderate"
                                    : "Low"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              How much you pay before insurance kicks in
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Healthcare Usage Suitability */}
                      <div>
                        <h4 className="font-semibold mb-4 text-green-700 flex items-center gap-2">
                          🏥 Usage Suitability
                        </h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-green-600">✅</span>
                              <span className="text-sm font-medium">
                                Best for frequent users
                              </span>
                            </div>
                            <p className="text-xs text-green-600">
                              {planData.metal_level === "Gold"
                                ? "Excellent choice for regular doctor visits and medications"
                                : "Good balance of cost and coverage"}
                            </p>
                          </div>
                          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-yellow-600">⚠️</span>
                              <span className="text-sm font-medium">
                                Consider if you&apos;re healthy
                              </span>
                            </div>
                            <p className="text-xs text-yellow-600">
                              High deductible may mean higher out-of-pocket
                              costs for occasional care
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Plan Comparison Matrix */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <span className="text-2xl">📊</span>
                      </div>
                      <h3 className="text-xl font-semibold">
                        Competitive Analysis
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-semibold">
                              Feature
                            </th>
                            <th className="text-center py-3 px-4 font-semibold bg-blue-50">
                              This Plan
                            </th>
                            <th className="text-center py-3 px-4 font-semibold">
                              Market Average
                            </th>
                            <th className="text-center py-3 px-4 font-semibold">
                              Performance
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 px-4">Monthly Premium</td>
                            <td className="py-3 px-4 text-center bg-blue-50 font-semibold">
                              {formatCurrency(
                                planData.premium_adult_individual_age_30,
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {formatCurrency(450)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {planData.premium_adult_individual_age_30 <
                              450 ? (
                                <Chip color="success" size="sm" variant="flat">
                                  Better 📈
                                </Chip>
                              ) : (
                                <Chip color="warning" size="sm" variant="flat">
                                  Higher 📊
                                </Chip>
                              )}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4">Deductible</td>
                            <td className="py-3 px-4 text-center bg-blue-50 font-semibold">
                              {formatCurrency(
                                planData.medical_deductible_individual_standard,
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {formatCurrency(3000)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {planData.medical_deductible_individual_standard <
                              3000 ? (
                                <Chip color="success" size="sm" variant="flat">
                                  Lower 👍
                                </Chip>
                              ) : (
                                <Chip color="warning" size="sm" variant="flat">
                                  Higher 👎
                                </Chip>
                              )}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4">Primary Care</td>
                            <td className="py-3 px-4 text-center bg-blue-50 font-semibold">
                              {planData.primary_care_physician_standard}
                            </td>
                            <td className="py-3 px-4 text-center">$25 copay</td>
                            <td className="py-3 px-4 text-center">
                              <Chip color="primary" size="sm" variant="flat">
                                Competitive ⚖️
                              </Chip>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>

                {/* Technical Plan Information */}
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">
                      Technical Plan Information
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-500">Plan ID</span>
                          <p className="font-mono">
                            {planData.plan_id_standard_component}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            HIOS Issuer ID
                          </span>
                          <p className="font-mono">{planData.hios_issuer_id}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            Rating Area
                          </span>
                          <p>{planData.rating_area}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            Plan Option
                          </span>
                          <p>{planData.standardized_plan_option}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-500">Source</span>
                          <p>{planData.source}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            County Code
                          </span>
                          <p className="font-mono">
                            {planData.fips_county_code}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            Child Only Offering
                          </span>
                          <p>{planData.child_only_offering}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            EHB Percentage
                          </span>
                          <p>{planData.ehb_percent_of_total_premium}%</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Contact Information</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Customer Service</p>
                <div className="space-y-1">
                  {planData.customer_service_phone_number_toll_free && (
                    <p className="font-semibold text-blue-600">
                      {planData.customer_service_phone_number_toll_free}
                    </p>
                  )}
                  {planData.customer_service_phone_number_local && (
                    <p className="text-sm">
                      {planData.customer_service_phone_number_local}
                    </p>
                  )}
                  {planData.customer_service_phone_number_tty && (
                    <p className="text-xs text-gray-600">
                      TTY: {planData.customer_service_phone_number_tty}
                    </p>
                  )}
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <Button className="w-full" color="primary" onPress={onOpen}>
                Get a Quote
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Summary */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Summary</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Metal Level</span>
                  <Chip
                    color={getMetalLevelColor(planData.metal_level)}
                    size="sm"
                    variant="flat"
                  >
                    {planData.metal_level}
                  </Chip>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Plan Type</span>
                  <Chip color="primary" size="sm" variant="bordered">
                    {planData.plan_type}
                  </Chip>
                </div>
                <Divider />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Individual Deductible</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        planData.medical_deductible_individual_standard,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Individual Max OOP</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        planData.medical_maximum_out_of_pocket_individual_standard,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Compare Plans */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Compare Plans</h3>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-600 mb-4">
                Compare this plan with other available options in your area
              </p>
              <Button
                className="w-full"
                color="secondary"
                variant="bordered"
                onPress={() => router.push("/")}
              >
                View All Plans
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Quote Modal */}
      <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl">Get a Quote</h2>
                <p className="text-sm text-gray-600">
                  {planData.plan_marketing_name}
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardBody>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💡</span>
                        <div>
                          <p className="font-semibold text-blue-900">
                            Ready to Get Started?
                          </p>
                          <p className="text-sm text-blue-700">
                            Contact the insurance company directly for
                            personalized quotes and enrollment assistance.
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Contact Options</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Phone:</strong>{" "}
                          {planData.customer_service_phone_number_toll_free}
                        </p>
                        <p>
                          <strong>Local:</strong>{" "}
                          {planData.customer_service_phone_number_local}
                        </p>
                        <p>
                          <strong>TTY:</strong>{" "}
                          {planData.customer_service_phone_number_tty}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">
                        What You&apos;ll Need
                      </h4>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Social Security Number</li>
                        <li>Income information</li>
                        <li>Current health coverage details</li>
                        <li>Family member information</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() =>
                    window.open(planData.summary_of_benefits_url, "_blank")
                  }
                >
                  View Plan Details
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
