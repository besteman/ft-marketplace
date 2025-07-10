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
  id: number | string;
  metal_level: string | null;
  issuer_name: string | null;
  plan_id_standard_component: string | null;
  plan_marketing_name: string | null;
  plan_type: string | null;
  average_premium?: number | null;
}

// Detailed plan interface for individual plan pages
export interface DetailedPlanDetails {
  id: string;
  state_code: string;
  fips_county_code: number;
  county_name: string;
  metal_level: string;
  issuer_name: string;
  hios_issuer_id: number;
  plan_id_standard_component: string;
  plan_marketing_name: string;
  standardized_plan_option: string;
  plan_type: string;
  rating_area: string;
  child_only_offering: string;
  source: string;
  customer_service_phone_number_local: string | null;
  customer_service_phone_number_toll_free: string | null;
  customer_service_phone_number_tty: string | null;
  network_url: string;
  plan_brochure_url: string | null;
  summary_of_benefits_url: string;
  drug_formulary_url: string;
  adult_dental: string | null;
  child_dental: string | null;
  ehb_percent_of_total_premium: string;
  premium_child_age_0_14: number;
  premium_child_age_18: number;
  premium_adult_individual_age_21: number;
  premium_adult_individual_age_27: number;
  premium_adult_individual_age_30: number;
  premium_adult_individual_age_40: number;
  premium_adult_individual_age_50: number;
  premium_adult_individual_age_60: number;
  premium_couple_21: number;
  premium_couple_30: number;
  premium_couple_40: number;
  premium_couple_50: number;
  premium_couple_60: number;
  couple_plus_1_child_age_21: number;
  couple_plus_1_child_age_30: number;
  couple_plus_1_child_age_40: number;
  couple_plus_1_child_age_50: number;
  couple_plus_2_children_age_21: number;
  couple_plus_2_children_age_30: number;
  couple_plus_2_children_age_40: number;
  couple_plus_2_children_age_50: number;
  couple_plus_3_or_more_children_age_21: number;
  couple_plus_3_or_more_children_age_30: number;
  couple_plus_3_or_more_children_age_40: number;
  couple_plus_3_or_more_children_age_50: number;
  individual_plus_1_child_age_21: number;
  individual_plus_1_child_age_30: number;
  individual_plus_1_child_age_40: number;
  individual_plus_1_child_age_50: number;
  individual_plus_2_children_age_21: number;
  individual_plus_2_children_age_30: number;
  individual_plus_2_children_age_40: number;
  individual_plus_2_children_age_50: number;
  individual_plus_3_or_more_children_age_21: number;
  individual_plus_3_or_more_children_age_30: number;
  individual_plus_3_or_more_children_age_40: number;
  individual_plus_3_or_more_children_age_50: number;
  medical_deductible_individual_standard: number;
  drug_deductible_individual_standard: string | null;
  medical_deductible_family_standard: number;
  drug_deductible_family_standard: string | null;
  medical_deductible_family_per_person_standard: string | null;
  drug_deductible_family_per_person_standard: string | null;
  medical_maximum_out_of_pocket_individual_standard: number;
  drug_maximum_out_of_pocket_individual_standard: string | null;
  medical_maximum_out_of_pocket_family_standard: number;
  drug_maximum_out_of_pocket_family_standard: string | null;
  medical_maximum_out_of_pocket_family_per_person_standard: number;
  drug_maximum_out_of_pocket_family_per_person_standard: string | null;
  primary_care_physician_standard: string | null;
  specialist_standard: string | null;
  emergency_room_standard: string | null;
  inpatient_facility_standard: string;
  inpatient_physician_standard: string | null;
  generic_drugs_standard: string | null;
  preferred_brand_drugs_standard: string | null;
  non_preferred_brand_drugs_standard: string | null;
  specialty_drugs_standard: string | null;
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
