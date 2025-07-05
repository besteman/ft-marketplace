"use client";

import type { GetCountiesResponse } from "@/types";

import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";

interface CountyFiltersProps {
  selectedState?: string;
  selectedCounty?: string;
  onCountyChange?: (countyName: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CountyFilters({
  selectedState,
  selectedCounty,
  onCountyChange,
  placeholder = "Select a county",
  className = "",
}: CountyFiltersProps) {
  const [counties, setCounties] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch counties when selectedState changes
  useEffect(() => {
    const fetchCounties = async () => {
      if (!selectedState) {
        setCounties([]);
        setError(null);

        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/db/getCounties?state_code=${selectedState}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch counties");
        }

        const data: GetCountiesResponse = await response.json();

        setCounties(data.counties);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setCounties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCounties();
  }, [selectedState]);

  const handleSelectionChange = (keys: any) => {
    const selectedKey = Array.from(keys as Set<string>)[0];

    if (selectedKey && onCountyChange) {
      onCountyChange(selectedKey);
    }
  };

  const getButtonText = () => {
    if (!selectedState) {
      return "Select a state first";
    }

    if (loading) {
      return "Loading counties...";
    }

    if (error) {
      return "Error loading counties";
    }

    if (counties.length === 0) {
      return "No counties available";
    }

    return selectedCounty || placeholder;
  };

  const isDisabled =
    !selectedState || loading || error !== null || counties.length === 0;

  return (
    <Dropdown className={className}>
      <DropdownTrigger>
        <Button
          className="capitalize"
          isDisabled={isDisabled}
          variant="bordered"
        >
          {getButtonText()}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="County selection"
        className="max-h-60 overflow-y-auto"
        disallowEmptySelection={false}
        selectedKeys={selectedCounty ? new Set([selectedCounty]) : new Set()}
        selectionMode="single"
        variant="flat"
        onSelectionChange={handleSelectionChange}
      >
        {counties.map((county) => (
          <DropdownItem key={county} value={county}>
            {county}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
