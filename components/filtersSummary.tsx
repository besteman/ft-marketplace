"use client";

import type { CombinedFiltersData } from "@/types";

import React from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";

interface FiltersSummaryProps {
  data: CombinedFiltersData;
  onReset: () => void;
}

const familyMakeupLabels: Record<string, string> = {
  adult_individual: "Adult Individual",
  couple: "Couple (Two Adults)",
  couple_one_child: "Couple + 1 child",
  couple_two_children: "Couple + 2 children",
  couple_three_children: "Couple + 3 or more children",
  individual_one_children: "Individual + 1 child",
  individual_two_children: "Individual + 2 children",
  individual_three_children: "Individual + 3 or more children",
};

export default function FiltersSummary({ data, onReset }: FiltersSummaryProps) {
  const formatCurrency = (value: string) => {
    if (!value) return "Not specified";

    const number = parseFloat(value);

    if (isNaN(number)) return "Not specified";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Your Selected Filters
              </h3>
              <p className="text-sm text-gray-600">Review your choices below</p>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          {/* Geographic Information */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">
              📍 Location
            </h4>
            <div className="flex flex-wrap gap-2">
              <Chip color="primary" variant="flat">
                🗺️ {data.geo.state || "Not specified"}
              </Chip>
              <Chip color="primary" variant="flat">
                🏘️ {data.geo.county || "Not specified"}
              </Chip>
            </div>
          </div>

          {/* Demographics Information */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">
              👥 Demographics
            </h4>
            <div className="flex flex-wrap gap-2">
              <Chip color="secondary" variant="flat">
                👨‍👩‍👧‍👦{" "}
                {data.demo.familyMakeup
                  ? familyMakeupLabels[data.demo.familyMakeup] ||
                    data.demo.familyMakeup
                  : "Not specified"}
              </Chip>
            </div>
          </div>

          {/* Income Information */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">
              💰 Financial Details
            </h4>
            <div className="flex flex-wrap gap-2">
              <Chip color="success" variant="flat">
                💰 Salary: {formatCurrency(data.demo.averageMonthlySalary)}
              </Chip>
              <Chip color="success" variant="flat">
                🏢 ICHRA: {formatCurrency(data.demo.ichraAmount)}
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex flex-col items-center gap-3">
            <p className="text-center text-sm text-gray-600">
              Need to make changes to your selection?
            </p>
            <Button color="secondary" variant="bordered" onPress={onReset}>
              🔄 Change Filters
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
