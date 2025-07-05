export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      marketplace_plans: {
        Row: {
          adult_dental: string | null;
          child_dental: string | null;
          child_only_offering: string;
          col_73_percent_actuarial_value_silver_plan_cost_sharing:
            | string
            | null;
          col_87_percent_actuarial_value_silver_plan_cost_sharing:
            | string
            | null;
          col_94_percent_actuarial_value_silver_plan_cost_sharing:
            | string
            | null;
          county_name: string;
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
          created_at: string | null;
          customer_service_phone_number_local: string | null;
          customer_service_phone_number_toll_free: string | null;
          customer_service_phone_number_tty: string | null;
          drug_deductible_family_73_percent: string | null;
          drug_deductible_family_87_percent: string | null;
          drug_deductible_family_94_percent: string | null;
          drug_deductible_family_per_person_73_percent: string | null;
          drug_deductible_family_per_person_87_percent: string | null;
          drug_deductible_family_per_person_94_percent: string | null;
          drug_deductible_family_per_person_standard: string | null;
          drug_deductible_family_standard: string | null;
          drug_deductible_individual_73_percent: string | null;
          drug_deductible_individual_87_percent: string | null;
          drug_deductible_individual_94_percent: string | null;
          drug_deductible_individual_standard: string | null;
          drug_formulary_url: string;
          drug_maximum_out_of_pocket_family_73_percent: string | null;
          drug_maximum_out_of_pocket_family_87_percent: string | null;
          drug_maximum_out_of_pocket_family_94_percent: string | null;
          drug_maximum_out_of_pocket_family_per_person_73_percent:
            | string
            | null;
          drug_maximum_out_of_pocket_family_per_person_87_percent:
            | string
            | null;
          drug_maximum_out_of_pocket_family_per_person_94_percent:
            | string
            | null;
          drug_maximum_out_of_pocket_family_per_person_standard: string | null;
          drug_maximum_out_of_pocket_family_standard: string | null;
          drug_maximum_out_of_pocket_individual_73_percent: string | null;
          drug_maximum_out_of_pocket_individual_87_percent: string | null;
          drug_maximum_out_of_pocket_individual_94_percent: string | null;
          drug_maximum_out_of_pocket_individual_standard: string | null;
          ehb_percent_of_total_premium: string;
          emergency_room_73_percent: string | null;
          emergency_room_87_percent: string | null;
          emergency_room_94_percent: string | null;
          emergency_room_standard: string | null;
          fips_county_code: number;
          generic_drugs_73_percent: string | null;
          generic_drugs_87_percent: string | null;
          generic_drugs_94_percent: string | null;
          generic_drugs_standard: string | null;
          hios_issuer_id: number;
          id: string;
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
          inpatient_facility_73_percent: string | null;
          inpatient_facility_87_percent: string | null;
          inpatient_facility_94_percent: string | null;
          inpatient_facility_standard: string;
          inpatient_physician_73_percent: string | null;
          inpatient_physician_87_percent: string | null;
          inpatient_physician_94_percent: string | null;
          inpatient_physician_standard: string | null;
          issuer_name: string;
          medical_deductible_family_73_percent: number | null;
          medical_deductible_family_87_percent: number | null;
          medical_deductible_family_94_percent: number | null;
          medical_deductible_family_per_person_73_percent: number | null;
          medical_deductible_family_per_person_87_percent: number | null;
          medical_deductible_family_per_person_94_percent: number | null;
          medical_deductible_family_per_person_standard: string | null;
          medical_deductible_family_standard: number;
          medical_deductible_individual_73_percent: number | null;
          medical_deductible_individual_87_percent: number | null;
          medical_deductible_individual_94_percent: number | null;
          medical_deductible_individual_standard: number;
          medical_maximum_out_of_pocket_family_73_percent: number | null;
          medical_maximum_out_of_pocket_family_87_percent: number | null;
          medical_maximum_out_of_pocket_family_94_percent: number | null;
          medical_maximum_out_of_pocket_family_per_person_73_percent:
            | number
            | null;
          medical_maximum_out_of_pocket_family_per_person_87_percent:
            | number
            | null;
          medical_maximum_out_of_pocket_family_per_person_94_percent:
            | number
            | null;
          medical_maximum_out_of_pocket_family_per_person_standard: number;
          medical_maximum_out_of_pocket_family_standard: number;
          medical_maximum_out_of_pocket_individual_73_percent: number | null;
          medical_maximum_out_of_pocket_individual_87_percent: number | null;
          medical_maximum_out_of_pocket_individual_94_percent: number | null;
          medical_maximum_out_of_pocket_individual_standard: number;
          metal_level: string;
          network_url: string;
          non_preferred_brand_drugs_73_percent: string | null;
          non_preferred_brand_drugs_87_percent: string | null;
          non_preferred_brand_drugs_94_percent: string | null;
          non_preferred_brand_drugs_standard: string | null;
          plan_brochure_url: string | null;
          plan_id_standard_component: string;
          plan_marketing_name: string;
          plan_type: string;
          preferred_brand_drugs_73_percent: string | null;
          preferred_brand_drugs_87_percent: string | null;
          preferred_brand_drugs_94_percent: string | null;
          preferred_brand_drugs_standard: string | null;
          premium_adult_individual_age_21: number;
          premium_adult_individual_age_27: number;
          premium_adult_individual_age_30: number;
          premium_adult_individual_age_40: number;
          premium_adult_individual_age_50: number;
          premium_adult_individual_age_60: number;
          premium_child_age_0_14: number;
          premium_child_age_18: number;
          premium_couple_21: number;
          premium_couple_30: number;
          premium_couple_40: number;
          premium_couple_50: number;
          premium_couple_60: number;
          primary_care_physician_73_percent: string | null;
          primary_care_physician_87_percent: string | null;
          primary_care_physician_94_percent: string | null;
          primary_care_physician_standard: string | null;
          rating_area: string;
          source: string;
          specialist_73_percent: string | null;
          specialist_87_percent: string | null;
          specialist_94_percent: string | null;
          specialist_standard: string | null;
          specialty_drugs_73_percent: string | null;
          specialty_drugs_87_percent: string | null;
          specialty_drugs_94_percent: string | null;
          specialty_drugs_standard: string | null;
          standardized_plan_option: string;
          state_code: string;
          summary_of_benefits_url: string;
          updated_at: string | null;
        };
        Insert: {
          adult_dental?: string | null;
          child_dental?: string | null;
          child_only_offering: string;
          col_73_percent_actuarial_value_silver_plan_cost_sharing?:
            | string
            | null;
          col_87_percent_actuarial_value_silver_plan_cost_sharing?:
            | string
            | null;
          col_94_percent_actuarial_value_silver_plan_cost_sharing?:
            | string
            | null;
          county_name: string;
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
          created_at?: string | null;
          customer_service_phone_number_local?: string | null;
          customer_service_phone_number_toll_free?: string | null;
          customer_service_phone_number_tty?: string | null;
          drug_deductible_family_73_percent?: string | null;
          drug_deductible_family_87_percent?: string | null;
          drug_deductible_family_94_percent?: string | null;
          drug_deductible_family_per_person_73_percent?: string | null;
          drug_deductible_family_per_person_87_percent?: string | null;
          drug_deductible_family_per_person_94_percent?: string | null;
          drug_deductible_family_per_person_standard?: string | null;
          drug_deductible_family_standard?: string | null;
          drug_deductible_individual_73_percent?: string | null;
          drug_deductible_individual_87_percent?: string | null;
          drug_deductible_individual_94_percent?: string | null;
          drug_deductible_individual_standard?: string | null;
          drug_formulary_url: string;
          drug_maximum_out_of_pocket_family_73_percent?: string | null;
          drug_maximum_out_of_pocket_family_87_percent?: string | null;
          drug_maximum_out_of_pocket_family_94_percent?: string | null;
          drug_maximum_out_of_pocket_family_per_person_73_percent?:
            | string
            | null;
          drug_maximum_out_of_pocket_family_per_person_87_percent?:
            | string
            | null;
          drug_maximum_out_of_pocket_family_per_person_94_percent?:
            | string
            | null;
          drug_maximum_out_of_pocket_family_per_person_standard?: string | null;
          drug_maximum_out_of_pocket_family_standard?: string | null;
          drug_maximum_out_of_pocket_individual_73_percent?: string | null;
          drug_maximum_out_of_pocket_individual_87_percent?: string | null;
          drug_maximum_out_of_pocket_individual_94_percent?: string | null;
          drug_maximum_out_of_pocket_individual_standard?: string | null;
          ehb_percent_of_total_premium: string;
          emergency_room_73_percent?: string | null;
          emergency_room_87_percent?: string | null;
          emergency_room_94_percent?: string | null;
          emergency_room_standard?: string | null;
          fips_county_code: number;
          generic_drugs_73_percent?: string | null;
          generic_drugs_87_percent?: string | null;
          generic_drugs_94_percent?: string | null;
          generic_drugs_standard?: string | null;
          hios_issuer_id: number;
          id?: string;
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
          inpatient_facility_73_percent?: string | null;
          inpatient_facility_87_percent?: string | null;
          inpatient_facility_94_percent?: string | null;
          inpatient_facility_standard: string;
          inpatient_physician_73_percent?: string | null;
          inpatient_physician_87_percent?: string | null;
          inpatient_physician_94_percent?: string | null;
          inpatient_physician_standard?: string | null;
          issuer_name: string;
          medical_deductible_family_73_percent?: number | null;
          medical_deductible_family_87_percent?: number | null;
          medical_deductible_family_94_percent?: number | null;
          medical_deductible_family_per_person_73_percent?: number | null;
          medical_deductible_family_per_person_87_percent?: number | null;
          medical_deductible_family_per_person_94_percent?: number | null;
          medical_deductible_family_per_person_standard?: string | null;
          medical_deductible_family_standard: number;
          medical_deductible_individual_73_percent?: number | null;
          medical_deductible_individual_87_percent?: number | null;
          medical_deductible_individual_94_percent?: number | null;
          medical_deductible_individual_standard: number;
          medical_maximum_out_of_pocket_family_73_percent?: number | null;
          medical_maximum_out_of_pocket_family_87_percent?: number | null;
          medical_maximum_out_of_pocket_family_94_percent?: number | null;
          medical_maximum_out_of_pocket_family_per_person_73_percent?:
            | number
            | null;
          medical_maximum_out_of_pocket_family_per_person_87_percent?:
            | number
            | null;
          medical_maximum_out_of_pocket_family_per_person_94_percent?:
            | number
            | null;
          medical_maximum_out_of_pocket_family_per_person_standard: number;
          medical_maximum_out_of_pocket_family_standard: number;
          medical_maximum_out_of_pocket_individual_73_percent?: number | null;
          medical_maximum_out_of_pocket_individual_87_percent?: number | null;
          medical_maximum_out_of_pocket_individual_94_percent?: number | null;
          medical_maximum_out_of_pocket_individual_standard: number;
          metal_level: string;
          network_url: string;
          non_preferred_brand_drugs_73_percent?: string | null;
          non_preferred_brand_drugs_87_percent?: string | null;
          non_preferred_brand_drugs_94_percent?: string | null;
          non_preferred_brand_drugs_standard?: string | null;
          plan_brochure_url?: string | null;
          plan_id_standard_component: string;
          plan_marketing_name: string;
          plan_type: string;
          preferred_brand_drugs_73_percent?: string | null;
          preferred_brand_drugs_87_percent?: string | null;
          preferred_brand_drugs_94_percent?: string | null;
          preferred_brand_drugs_standard?: string | null;
          premium_adult_individual_age_21: number;
          premium_adult_individual_age_27: number;
          premium_adult_individual_age_30: number;
          premium_adult_individual_age_40: number;
          premium_adult_individual_age_50: number;
          premium_adult_individual_age_60: number;
          premium_child_age_0_14: number;
          premium_child_age_18: number;
          premium_couple_21: number;
          premium_couple_30: number;
          premium_couple_40: number;
          premium_couple_50: number;
          premium_couple_60: number;
          primary_care_physician_73_percent?: string | null;
          primary_care_physician_87_percent?: string | null;
          primary_care_physician_94_percent?: string | null;
          primary_care_physician_standard?: string | null;
          rating_area: string;
          source: string;
          specialist_73_percent?: string | null;
          specialist_87_percent?: string | null;
          specialist_94_percent?: string | null;
          specialist_standard?: string | null;
          specialty_drugs_73_percent?: string | null;
          specialty_drugs_87_percent?: string | null;
          specialty_drugs_94_percent?: string | null;
          specialty_drugs_standard?: string | null;
          standardized_plan_option: string;
          state_code: string;
          summary_of_benefits_url: string;
          updated_at?: string | null;
        };
        Update: {
          adult_dental?: string | null;
          child_dental?: string | null;
          child_only_offering?: string;
          col_73_percent_actuarial_value_silver_plan_cost_sharing?:
            | string
            | null;
          col_87_percent_actuarial_value_silver_plan_cost_sharing?:
            | string
            | null;
          col_94_percent_actuarial_value_silver_plan_cost_sharing?:
            | string
            | null;
          county_name?: string;
          couple_plus_1_child_age_21?: number;
          couple_plus_1_child_age_30?: number;
          couple_plus_1_child_age_40?: number;
          couple_plus_1_child_age_50?: number;
          couple_plus_2_children_age_21?: number;
          couple_plus_2_children_age_30?: number;
          couple_plus_2_children_age_40?: number;
          couple_plus_2_children_age_50?: number;
          couple_plus_3_or_more_children_age_21?: number;
          couple_plus_3_or_more_children_age_30?: number;
          couple_plus_3_or_more_children_age_40?: number;
          couple_plus_3_or_more_children_age_50?: number;
          created_at?: string | null;
          customer_service_phone_number_local?: string | null;
          customer_service_phone_number_toll_free?: string | null;
          customer_service_phone_number_tty?: string | null;
          drug_deductible_family_73_percent?: string | null;
          drug_deductible_family_87_percent?: string | null;
          drug_deductible_family_94_percent?: string | null;
          drug_deductible_family_per_person_73_percent?: string | null;
          drug_deductible_family_per_person_87_percent?: string | null;
          drug_deductible_family_per_person_94_percent?: string | null;
          drug_deductible_family_per_person_standard?: string | null;
          drug_deductible_family_standard?: string | null;
          drug_deductible_individual_73_percent?: string | null;
          drug_deductible_individual_87_percent?: string | null;
          drug_deductible_individual_94_percent?: string | null;
          drug_deductible_individual_standard?: string | null;
          drug_formulary_url?: string;
          drug_maximum_out_of_pocket_family_73_percent?: string | null;
          drug_maximum_out_of_pocket_family_87_percent?: string | null;
          drug_maximum_out_of_pocket_family_94_percent?: string | null;
          drug_maximum_out_of_pocket_family_per_person_73_percent?:
            | string
            | null;
          drug_maximum_out_of_pocket_family_per_person_87_percent?:
            | string
            | null;
          drug_maximum_out_of_pocket_family_per_person_94_percent?:
            | string
            | null;
          drug_maximum_out_of_pocket_family_per_person_standard?: string | null;
          drug_maximum_out_of_pocket_family_standard?: string | null;
          drug_maximum_out_of_pocket_individual_73_percent?: string | null;
          drug_maximum_out_of_pocket_individual_87_percent?: string | null;
          drug_maximum_out_of_pocket_individual_94_percent?: string | null;
          drug_maximum_out_of_pocket_individual_standard?: string | null;
          ehb_percent_of_total_premium?: string;
          emergency_room_73_percent?: string | null;
          emergency_room_87_percent?: string | null;
          emergency_room_94_percent?: string | null;
          emergency_room_standard?: string | null;
          fips_county_code?: number;
          generic_drugs_73_percent?: string | null;
          generic_drugs_87_percent?: string | null;
          generic_drugs_94_percent?: string | null;
          generic_drugs_standard?: string | null;
          hios_issuer_id?: number;
          id?: string;
          individual_plus_1_child_age_21?: number;
          individual_plus_1_child_age_30?: number;
          individual_plus_1_child_age_40?: number;
          individual_plus_1_child_age_50?: number;
          individual_plus_2_children_age_21?: number;
          individual_plus_2_children_age_30?: number;
          individual_plus_2_children_age_40?: number;
          individual_plus_2_children_age_50?: number;
          individual_plus_3_or_more_children_age_21?: number;
          individual_plus_3_or_more_children_age_30?: number;
          individual_plus_3_or_more_children_age_40?: number;
          individual_plus_3_or_more_children_age_50?: number;
          inpatient_facility_73_percent?: string | null;
          inpatient_facility_87_percent?: string | null;
          inpatient_facility_94_percent?: string | null;
          inpatient_facility_standard?: string;
          inpatient_physician_73_percent?: string | null;
          inpatient_physician_87_percent?: string | null;
          inpatient_physician_94_percent?: string | null;
          inpatient_physician_standard?: string | null;
          issuer_name?: string;
          medical_deductible_family_73_percent?: number | null;
          medical_deductible_family_87_percent?: number | null;
          medical_deductible_family_94_percent?: number | null;
          medical_deductible_family_per_person_73_percent?: number | null;
          medical_deductible_family_per_person_87_percent?: number | null;
          medical_deductible_family_per_person_94_percent?: number | null;
          medical_deductible_family_per_person_standard?: string | null;
          medical_deductible_family_standard?: number;
          medical_deductible_individual_73_percent?: number | null;
          medical_deductible_individual_87_percent?: number | null;
          medical_deductible_individual_94_percent?: number | null;
          medical_deductible_individual_standard?: number;
          medical_maximum_out_of_pocket_family_73_percent?: number | null;
          medical_maximum_out_of_pocket_family_87_percent?: number | null;
          medical_maximum_out_of_pocket_family_94_percent?: number | null;
          medical_maximum_out_of_pocket_family_per_person_73_percent?:
            | number
            | null;
          medical_maximum_out_of_pocket_family_per_person_87_percent?:
            | number
            | null;
          medical_maximum_out_of_pocket_family_per_person_94_percent?:
            | number
            | null;
          medical_maximum_out_of_pocket_family_per_person_standard?: number;
          medical_maximum_out_of_pocket_family_standard?: number;
          medical_maximum_out_of_pocket_individual_73_percent?: number | null;
          medical_maximum_out_of_pocket_individual_87_percent?: number | null;
          medical_maximum_out_of_pocket_individual_94_percent?: number | null;
          medical_maximum_out_of_pocket_individual_standard?: number;
          metal_level?: string;
          network_url?: string;
          non_preferred_brand_drugs_73_percent?: string | null;
          non_preferred_brand_drugs_87_percent?: string | null;
          non_preferred_brand_drugs_94_percent?: string | null;
          non_preferred_brand_drugs_standard?: string | null;
          plan_brochure_url?: string | null;
          plan_id_standard_component?: string;
          plan_marketing_name?: string;
          plan_type?: string;
          preferred_brand_drugs_73_percent?: string | null;
          preferred_brand_drugs_87_percent?: string | null;
          preferred_brand_drugs_94_percent?: string | null;
          preferred_brand_drugs_standard?: string | null;
          premium_adult_individual_age_21?: number;
          premium_adult_individual_age_27?: number;
          premium_adult_individual_age_30?: number;
          premium_adult_individual_age_40?: number;
          premium_adult_individual_age_50?: number;
          premium_adult_individual_age_60?: number;
          premium_child_age_0_14?: number;
          premium_child_age_18?: number;
          premium_couple_21?: number;
          premium_couple_30?: number;
          premium_couple_40?: number;
          premium_couple_50?: number;
          premium_couple_60?: number;
          primary_care_physician_73_percent?: string | null;
          primary_care_physician_87_percent?: string | null;
          primary_care_physician_94_percent?: string | null;
          primary_care_physician_standard?: string | null;
          rating_area?: string;
          source?: string;
          specialist_73_percent?: string | null;
          specialist_87_percent?: string | null;
          specialist_94_percent?: string | null;
          specialist_standard?: string | null;
          specialty_drugs_73_percent?: string | null;
          specialty_drugs_87_percent?: string | null;
          specialty_drugs_94_percent?: string | null;
          specialty_drugs_standard?: string | null;
          standardized_plan_option?: string;
          state_code?: string;
          summary_of_benefits_url?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      state_county_lookup: {
        Row: {
          county_name: string | null;
          fips_county_code: number | null;
          state_code: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
