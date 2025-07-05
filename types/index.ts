import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// API Response Types
export interface GetCountiesResponse {
  counties: string[];
  count: number;
  state_code: string;
}

export interface ApiErrorResponse {
  error: string;
}
