import type { GetCountiesResponse, ApiErrorResponse } from "@/types";

import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/service/db";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<GetCountiesResponse | ApiErrorResponse>> {
  try {
    // Get the state_code from URL search parameters
    const { searchParams } = new URL(request.url);
    const stateCode = searchParams.get("state_code");

    // Validate required parameter
    if (!stateCode) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "state_code parameter is required" },
        { status: 400 },
      );
    }

    // Query Supabase using the state_county_lookup table
    const { data, error } = await supabase
      .from("state_county_lookup")
      .select("county_name")
      .eq("state_code", stateCode.toUpperCase())
      .not("county_name", "is", null)
      .order("county_name");

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Supabase error:", error);

      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to fetch counties from database" },
        { status: 500 },
      );
    }

    // Extract county names (should already be unique in lookup table)
    const counties = data
      .map((item: { county_name: string | null }) => item.county_name)
      .filter((county): county is string => county !== null && county !== "");

    return NextResponse.json<GetCountiesResponse>({
      counties: counties,
      count: counties.length,
      state_code: stateCode.toUpperCase(),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("API error:", error);

    return NextResponse.json<ApiErrorResponse>(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
