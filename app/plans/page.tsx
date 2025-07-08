"use client";

import type {
  GetMainPlanDetailsResponse,
  CombinedFiltersData,
  PlanDetails,
} from "@/types";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Tooltip } from "@heroui/tooltip";
import { Divider } from "@heroui/divider";
import { useDisclosure } from "@heroui/modal";

import CombinedFilters from "@/components/combinedFilters";
import FiltersSummary from "@/components/filtersSummary";
import HelpModal from "@/components/helpModal";

function PlansPageContent() {
  const searchParams = useSearchParams();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [planDetails, setPlanDetails] = useState<PlanDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [submittedData, setSubmittedData] =
    useState<CombinedFiltersData | null>(null);

  // Filter states
  const [metalLevelFilter, setMetalLevelFilter] = useState<string>("all");
  const [issuerFilter, setIssuerFilter] = useState<string>("all");
  const [planTypeFilter, setPlanTypeFilter] = useState<string>("all");

  // Check if we should restore state on page load
  useEffect(() => {
    const restoreState = () => {
      try {
        // Check URL parameters first (from navigation back)
        const shouldRestore = searchParams?.get("restore");

        if (shouldRestore === "true") {
          const savedState = localStorage.getItem("plansPageState");
          const savedFilters = localStorage.getItem("plansPageFilters");
          const savedPlans = localStorage.getItem("plansPagePlans");

          if (savedState && savedFilters && savedPlans) {
            const state = JSON.parse(savedState);
            const filters = JSON.parse(savedFilters);
            const plans = JSON.parse(savedPlans);

            setSubmittedData(state);
            setFiltersApplied(true);
            setPlanDetails(plans);
            setMetalLevelFilter(filters.metalLevel || "all");
            setIssuerFilter(filters.issuer || "all");
            setPlanTypeFilter(filters.planType || "all");

            // Clean up URL without triggering reload
            const newUrl = new URL(window.location.href);

            newUrl.searchParams.delete("restore");
            window.history.replaceState({}, "", newUrl.toString());
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error restoring state:", error);
      }
    };

    restoreState();
  }, [searchParams]);

  // Save state when filters are applied or plans are loaded
  useEffect(() => {
    if (filtersApplied && submittedData && planDetails.length > 0) {
      try {
        localStorage.setItem("plansPageState", JSON.stringify(submittedData));
        localStorage.setItem("plansPagePlans", JSON.stringify(planDetails));
        localStorage.setItem(
          "plansPageFilters",
          JSON.stringify({
            metalLevel: metalLevelFilter,
            issuer: issuerFilter,
            planType: planTypeFilter,
          }),
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error saving state:", error);
      }
    }
  }, [
    filtersApplied,
    submittedData,
    planDetails,
    metalLevelFilter,
    issuerFilter,
    planTypeFilter,
  ]);

  // Get unique values for filters
  const uniqueMetalLevels = useMemo(() => {
    const levels = Array.from(
      new Set(planDetails.map((plan) => plan.metal_level).filter(Boolean)),
    ) as string[];

    return levels.sort();
  }, [planDetails]);

  const uniqueIssuers = useMemo(() => {
    const issuers = Array.from(
      new Set(planDetails.map((plan) => plan.issuer_name).filter(Boolean)),
    ) as string[];

    return issuers.sort();
  }, [planDetails]);

  const uniquePlanTypes = useMemo(() => {
    const types = Array.from(
      new Set(planDetails.map((plan) => plan.plan_type).filter(Boolean)),
    ) as string[];

    return types.sort();
  }, [planDetails]);

  // Filter the plan details based on selected filters
  const filteredPlanDetails = useMemo(() => {
    return planDetails.filter((plan) => {
      const metalMatch =
        metalLevelFilter === "all" || plan.metal_level === metalLevelFilter;
      const issuerMatch =
        issuerFilter === "all" || plan.issuer_name === issuerFilter;
      const typeMatch =
        planTypeFilter === "all" || plan.plan_type === planTypeFilter;

      return metalMatch && issuerMatch && typeMatch;
    });
  }, [planDetails, metalLevelFilter, issuerFilter, planTypeFilter]);

  const handleFiltersSubmit = async (data: CombinedFiltersData) => {
    const filters = data.geo;

    if (!filters.state || !filters.county) {
      setError("Both state and county must be selected");

      return;
    }

    // Store the submitted data and show summary
    setSubmittedData(data);
    setFiltersApplied(true);

    setLoading(true);
    setError(null);

    try {
      const familyMakeup = data.demo.familyMakeup || "";
      const response = await fetch(
        `/api/db/getMainPlanDetails?state_code=${filters.state}&county_name=${encodeURIComponent(filters.county)}&family_makeup=${encodeURIComponent(familyMakeup)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch plan details");
      }

      const responseData: GetMainPlanDetailsResponse = await response.json();

      setPlanDetails(responseData.plans);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setPlanDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFiltersApplied(false);
    setSubmittedData(null);
    setPlanDetails([]);
    setError(null);
    // Reset table filters
    setMetalLevelFilter("all");
    setIssuerFilter("all");
    setPlanTypeFilter("all");
  };

  const columns = [
    { key: "metal_level", label: "Metal Level" },
    { key: "issuer_name", label: "Issuer" },
    { key: "plan_marketing_name", label: "Plan Name" },
    { key: "plan_type", label: "Plan Type" },
    { key: "average_premium", label: "Avg Premium" },
    { key: "out_of_pocket", label: "Out-of-Pocket" },
    { key: "net_cost", label: "Remaining Budget" },
    { key: "details", label: "Details" },
  ];

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "N/A";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getMetalLevelColor = (
    metalLevel: string,
  ): "primary" | "secondary" | "success" | "warning" | "danger" => {
    switch (metalLevel?.toLowerCase()) {
      case "bronze":
        return "warning";
      case "silver":
        return "secondary";
      case "gold":
        return "success";
      case "platinum":
        return "primary";
      case "catastrophic":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getPlanTypeIcon = (planType: string): string => {
    switch (planType?.toUpperCase()) {
      case "HMO":
        return "🏥";
      case "PPO":
        return "🏩";
      case "EPO":
        return "🏪";
      case "POS":
        return "🎯";
      default:
        return "📋";
    }
  };

  const calculateNetCost = (
    averagePremium: number | null | undefined,
  ): number | null => {
    if (
      !submittedData ||
      averagePremium === null ||
      averagePremium === undefined
    ) {
      return null;
    }

    const monthlySalary = submittedData.demo.averageMonthlySalary
      ? parseFloat(submittedData.demo.averageMonthlySalary)
      : 0;

    const ichraAmount = submittedData.demo.ichraAmount
      ? parseFloat(submittedData.demo.ichraAmount)
      : 0;

    // Formula: Average Monthly Salary + ICHRA amount - Avg Premium
    return monthlySalary + ichraAmount - averagePremium;
  };

  const calculateOutOfPocketPremium = (
    averagePremium: number | null | undefined,
  ): number | null => {
    if (
      !submittedData ||
      averagePremium === null ||
      averagePremium === undefined
    ) {
      return null;
    }

    const ichraAmount = submittedData.demo.ichraAmount
      ? parseFloat(submittedData.demo.ichraAmount)
      : 0;

    // Formula: Avg Premium - ICHRA amount
    return Math.max(0, averagePremium - ichraAmount);
  };

  return (
    <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
      {/* Filter Section */}
      <Card className="w-full max-w-4xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Find Your Health Plan
              </h1>
              <p className="text-gray-600">
                {!filtersApplied
                  ? "Start by telling us about your location and situation"
                  : "Review your plan options and compare details"}
              </p>
            </div>
            <Tooltip content="Need help getting started?">
              <Button
                color="secondary"
                size="sm"
                variant="flat"
                onPress={onOpen}
              >
                ❓ Help
              </Button>
            </Tooltip>
          </div>
        </CardHeader>
        <CardBody>
          {!filtersApplied ? (
            <CombinedFilters onSubmit={handleFiltersSubmit} />
          ) : (
            submittedData && (
              <FiltersSummary
                data={submittedData}
                onReset={handleResetFilters}
              />
            )
          )}
        </CardBody>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="w-full max-w-4xl border-red-200 bg-red-50">
          <CardBody>
            <div className="flex items-center gap-2 text-red-700">
              <span className="text-lg">⚠️</span>
              <span>Error: {error}</span>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="w-full max-w-4xl">
          <CardBody>
            <div className="flex flex-col items-center gap-4">
              <Progress
                isIndeterminate
                aria-label="Loading plan details"
                className="max-w-md"
                size="md"
              />
              <p className="text-blue-700">
                Loading plan details for {submittedData?.geo.county},{" "}
                {submittedData?.geo.state}...
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Plans Results */}
      {planDetails.length > 0 && !loading && (
        <div className="w-full max-w-7xl space-y-6">
          {/* Results Summary */}
          <Card>
            <CardBody>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Available Plans
                  </h2>
                  <p className="text-gray-600">
                    Showing {filteredPlanDetails.length} of {planDetails.length}{" "}
                    plans for {submittedData?.geo.county},{" "}
                    {submittedData?.geo.state}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Tooltip content="Plans that meet your location criteria">
                    <Chip color="primary" variant="flat">
                      📍 {planDetails.length} Total Plans
                    </Chip>
                  </Tooltip>
                  {filteredPlanDetails.length !== planDetails.length && (
                    <Tooltip content="Plans visible after applying filters">
                      <Chip color="secondary" variant="flat">
                        🔍 {filteredPlanDetails.length} Filtered
                      </Chip>
                    </Tooltip>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Filter Controls */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-800">
                Filter & Sort Plans
              </h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Metal Level Filter */}
                <div className="flex flex-col gap-2">
                  <Tooltip content="Filter by plan metal level (coverage tier)">
                    <span className="text-sm font-medium text-gray-600">
                      🏅 Metal Level
                    </span>
                  </Tooltip>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button className="justify-start" variant="bordered">
                        {metalLevelFilter === "all"
                          ? "All Levels"
                          : metalLevelFilter}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Metal Level Filter"
                      items={[
                        { key: "all", label: "All Levels" },
                        ...uniqueMetalLevels.map((level) => ({
                          key: level,
                          label: level,
                        })),
                      ]}
                      onAction={(key) => setMetalLevelFilter(key as string)}
                    >
                      {(item) => (
                        <DropdownItem key={item.key}>{item.label}</DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </div>

                {/* Issuer Filter */}
                <div className="flex flex-col gap-2">
                  <Tooltip content="Filter by insurance company">
                    <span className="text-sm font-medium text-gray-600">
                      🏢 Insurance Company
                    </span>
                  </Tooltip>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        className="justify-start truncate"
                        variant="bordered"
                      >
                        {issuerFilter === "all"
                          ? "All Companies"
                          : issuerFilter}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Issuer Filter"
                      items={[
                        { key: "all", label: "All Companies" },
                        ...uniqueIssuers.map((issuer) => ({
                          key: issuer,
                          label: issuer,
                        })),
                      ]}
                      onAction={(key) => setIssuerFilter(key as string)}
                    >
                      {(item) => (
                        <DropdownItem key={item.key}>{item.label}</DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </div>

                {/* Plan Type Filter */}
                <div className="flex flex-col gap-2">
                  <Tooltip content="Filter by plan type (HMO, PPO, etc.)">
                    <span className="text-sm font-medium text-gray-600">
                      📋 Plan Type
                    </span>
                  </Tooltip>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button className="justify-start" variant="bordered">
                        {planTypeFilter === "all"
                          ? "All Types"
                          : planTypeFilter}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Plan Type Filter"
                      items={[
                        { key: "all", label: "All Types" },
                        ...uniquePlanTypes.map((type) => ({
                          key: type,
                          label: type,
                        })),
                      ]}
                      onAction={(key) => setPlanTypeFilter(key as string)}
                    >
                      {(item) => (
                        <DropdownItem key={item.key}>{item.label}</DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </div>

                {/* Clear Filters Button */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-transparent">
                    Actions
                  </span>
                  <Button
                    color="secondary"
                    variant="flat"
                    onPress={() => {
                      setMetalLevelFilter("all");
                      setIssuerFilter("all");
                      setPlanTypeFilter("all");
                    }}
                  >
                    🔄 Clear Filters
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Plans Table */}
          <Card>
            <Divider />
            <CardBody className="overflow-x-auto p-0">
              <Table
                aria-label="Plan details table"
                classNames={{
                  wrapper: "min-h-[200px]",
                }}
              >
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      key={column.key}
                      className="text-xs font-medium uppercase"
                    >
                      {column.label}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={filteredPlanDetails}>
                  {(item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      {(columnKey) => (
                        <TableCell className="py-4">
                          {(() => {
                            if (columnKey === "metal_level") {
                              return item.metal_level ? (
                                <Chip
                                  color={getMetalLevelColor(item.metal_level)}
                                  size="sm"
                                  variant="flat"
                                >
                                  {item.metal_level}
                                </Chip>
                              ) : (
                                "N/A"
                              );
                            }
                            if (columnKey === "plan_type") {
                              return item.plan_type ? (
                                <div className="flex items-center gap-2">
                                  <span>{getPlanTypeIcon(item.plan_type)}</span>
                                  <span className="text-sm">
                                    {item.plan_type}
                                  </span>
                                </div>
                              ) : (
                                "N/A"
                              );
                            }
                            if (columnKey === "issuer_name") {
                              return (
                                <div className="max-w-[200px]">
                                  <Tooltip
                                    content={item.issuer_name || "Unknown"}
                                  >
                                    <p className="truncate text-sm font-medium">
                                      {item.issuer_name || "N/A"}
                                    </p>
                                  </Tooltip>
                                </div>
                              );
                            }
                            if (columnKey === "plan_marketing_name") {
                              return (
                                <div className="max-w-[250px]">
                                  <Tooltip
                                    content={
                                      item.plan_marketing_name || "Unknown"
                                    }
                                  >
                                    <p className="truncate text-sm">
                                      {item.plan_marketing_name || "N/A"}
                                    </p>
                                  </Tooltip>
                                </div>
                              );
                            }
                            if (columnKey === "average_premium") {
                              const premium = item.average_premium;

                              return (
                                <div className="text-sm">
                                  <span className="font-medium">
                                    {formatCurrency(premium)}
                                  </span>
                                  <br />
                                  <span className="text-xs text-gray-500">
                                    per month
                                  </span>
                                </div>
                              );
                            }
                            if (columnKey === "net_cost") {
                              const netCost = calculateNetCost(
                                item.average_premium,
                              );
                              const isPositive = netCost && netCost > 0;

                              return (
                                <div className="text-sm">
                                  <span
                                    className={`font-medium ${
                                      isPositive
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {formatCurrency(netCost)}
                                  </span>
                                  <br />
                                  <span className="text-xs text-gray-500">
                                    {isPositive
                                      ? "budget remaining"
                                      : "over budget"}
                                  </span>
                                </div>
                              );
                            }
                            if (columnKey === "out_of_pocket") {
                              const outOfPocket = calculateOutOfPocketPremium(
                                item.average_premium,
                              );

                              return (
                                <div className="text-sm">
                                  <span className="font-medium">
                                    {formatCurrency(outOfPocket)}
                                  </span>
                                  <br />
                                  <span className="text-xs text-gray-500">
                                    your cost
                                  </span>
                                </div>
                              );
                            }
                            if (columnKey === "details") {
                              const params = new URLSearchParams();

                              if (submittedData?.demo.familyMakeup) {
                                params.append(
                                  "family_makeup",
                                  submittedData.demo.familyMakeup,
                                );
                              }
                              if (submittedData?.demo.averageMonthlySalary) {
                                params.append(
                                  "average_monthly_salary",
                                  submittedData.demo.averageMonthlySalary,
                                );
                              }
                              if (submittedData?.demo.ichraAmount) {
                                params.append(
                                  "ichra_amount",
                                  submittedData.demo.ichraAmount,
                                );
                              }

                              const queryString = params.toString();
                              const href = queryString
                                ? `/plans/${item.id}?${queryString}`
                                : `/plans/${item.id}`;

                              return (
                                <Link href={href}>
                                  <Button
                                    color="primary"
                                    size="sm"
                                    variant="light"
                                  >
                                    View Details
                                  </Button>
                                </Link>
                              );
                            }

                            return (
                              item[columnKey as keyof PlanDetails] || "N/A"
                            );
                          })()}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardBody>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Need Help?</h3>
                  <p className="text-sm text-gray-600">
                    Compare plans side-by-side or get expert assistance
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Tooltip content="Feature coming soon">
                    <Button isDisabled color="secondary" variant="flat">
                      📊 Compare Selected
                    </Button>
                  </Tooltip>
                  <Button color="primary" variant="flat" onPress={onOpen}>
                    📞 Get Help
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Help Modal */}
      <HelpModal isOpen={isOpen} onClose={onOpenChange} />
    </section>
  );
}

export default function PlansPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlansPageContent />
    </Suspense>
  );
}
