import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Filter interfaces
export interface GeoFiltersData {
  state: string;
  county: string;
}

export interface DemoFiltersData {
  familyMakeup: string;
  averageMonthlySalary: string;
  ichraAmount: string;
}

export interface CombinedFiltersData {
  geo: GeoFiltersData;
  demo: DemoFiltersData;
}

// API Response Types
export interface GetCountiesResponse {
  counties: string[];
  count: number;
  state_code: string;
}

export interface PlanDetails {
  metal_level: string | null;
  issuer_name: string | null;
  plan_id_standard_component: string | null;
  plan_marketing_name: string | null;
  plan_type: string | null;
  average_premium?: number | null;
}

export interface GetMainPlanDetailsResponse {
  plans: PlanDetails[];
  count: number;
  state_code: string;
  county_name: string;
  family_makeup?: string | null;
}

export interface ApiErrorResponse {
  error: string;
}
