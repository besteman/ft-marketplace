"use client";

import type {
  GetMainPlanDetailsResponse,
  CombinedFiltersData,
  PlanDetails,
} from "@/types";

import React, { useState, useMemo, useEffect } from "react";
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

import CombinedFilters from "@/components/combinedFilters";
import FiltersSummary from "@/components/filtersSummary";

export default function PlansPage() {
  const searchParams = useSearchParams();

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
    { key: "out_of_pocket", label: "Out-of-Pocket Premium" },
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
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="mt-8 w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        {!filtersApplied ? (
          <CombinedFilters onSubmit={handleFiltersSubmit} />
        ) : (
          submittedData && (
            <FiltersSummary data={submittedData} onReset={handleResetFilters} />
          )
        )}
      </div>

      {error && (
        <div className="w-full max-w-2xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Error: {error}
        </div>
      )}

      {loading && (
        <div className="w-full max-w-2xl rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-700">
          Loading plan details...
        </div>
      )}

      {planDetails.length > 0 && !loading && (
        <div className="w-full max-w-6xl rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Available Plans ({filteredPlanDetails.length} of{" "}
            {planDetails.length})
          </h2>

          {/* Filter Controls */}
          <div className="mb-6 flex flex-wrap gap-4">
            {/* Metal Level Filter */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-600">
                Metal Level
              </span>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="min-w-[140px] justify-start"
                    variant="bordered"
                  >
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
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-600">Issuer</span>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="min-w-[180px] justify-start truncate"
                    variant="bordered"
                  >
                    {issuerFilter === "all" ? "All Issuers" : issuerFilter}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Issuer Filter"
                  items={[
                    { key: "all", label: "All Issuers" },
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
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-600">
                Plan Type
              </span>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="min-w-[140px] justify-start"
                    variant="bordered"
                  >
                    {planTypeFilter === "all" ? "All Types" : planTypeFilter}
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
            <div className="flex flex-col gap-1">
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
                Clear Filters
              </Button>
            </div>
          </div>

          <Table aria-label="Plan details table">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={filteredPlanDetails}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      {(() => {
                        if (columnKey === "average_premium") {
                          return formatCurrency(item.average_premium);
                        }
                        if (columnKey === "net_cost") {
                          return formatCurrency(
                            calculateNetCost(item.average_premium),
                          );
                        }
                        if (columnKey === "out_of_pocket") {
                          return formatCurrency(
                            calculateOutOfPocketPremium(item.average_premium),
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
                            <Link
                              className="text-blue-600 hover:text-blue-800 underline"
                              href={href}
                            >
                              Details
                            </Link>
                          );
                        }

                        return item[columnKey as keyof PlanDetails] || "N/A";
                      })()}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
