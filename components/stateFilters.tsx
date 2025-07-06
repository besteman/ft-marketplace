"use client";

import React from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";

// US States data with full names and 2-letter codes
const US_STATES = [
  { code: "AK", name: "Alaska" },
  { code: "AL", name: "Alabama" },
  { code: "AR", name: "Arkansas" },
  { code: "AZ", name: "Arizona" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "HI", name: "Hawaii" },
  { code: "IA", name: "Iowa" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "KS", name: "Kansas" },
  { code: "LA", name: "Louisiana" },
  { code: "MI", name: "Michigan" },
  { code: "MO", name: "Missouri" },
  { code: "MS", name: "Mississippi" },
  { code: "MT", name: "Montana" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "NE", name: "Nebraska" },
  { code: "NH", name: "New Hampshire" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "WI", name: "Wisconsin" },
  { code: "WV", name: "West Virginia" },
  { code: "WY", name: "Wyoming" },
];

interface StateFiltersProps {
  selectedState?: string;
  onStateChange?: (stateCode: string) => void;
  placeholder?: string;
  className?: string;
}

export default function StateFilters({
  selectedState,
  onStateChange,
  placeholder = "Select a state",
  className = "",
}: StateFiltersProps) {
  const selectedStateName = selectedState
    ? US_STATES.find((state) => state.code === selectedState)?.name
    : null;

  const handleSelectionChange = (keys: any) => {
    const selectedKey = Array.from(keys as Set<string>)[0];

    if (selectedKey && onStateChange) {
      onStateChange(selectedKey);
    }
  };

  return (
    <Dropdown className={className}>
      <DropdownTrigger>
        <Button className="capitalize" variant="bordered">
          {selectedStateName || placeholder}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="State selection"
        className="max-h-60 overflow-y-auto"
        disallowEmptySelection={false}
        selectedKeys={selectedState ? new Set([selectedState]) : new Set()}
        selectionMode="single"
        variant="flat"
        onSelectionChange={handleSelectionChange}
      >
        {US_STATES.map((state) => (
          <DropdownItem key={state.code} value={state.code}>
            {state.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
