/**
 * Type definitions for Node.js version checking functionality
 */

export interface NodeVersionInfo {
  version: string;
  majorVersion: number;
  isSupported: boolean;
  environment: "server" | "client";
  platform: string;
  arch: string;
  requiredVersion: string;
  timestamp: string;
}

export interface NodeVersionError extends Error {
  code?: string;
  errno?: number;
}

export interface NodeVersionErrorResponse {
  error: string;
  details: string;
}

export type NodeVersionResponse = NodeVersionInfo | NodeVersionErrorResponse;

export interface NodeVersionCheckResult {
  success: boolean;
  version: string;
  majorVersion: number;
  isSupported: boolean;
  message: string;
}

export interface NodeVersionDisplayProps {
  className?: string;
  showDetails?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export interface NodeVersionTooltipData {
  version: string;
  environment: string;
  platform: string;
  arch: string;
  requiredVersion: string;
  status: string;
  timestamp: string;
}

export const NODE_VERSION_CONSTANTS = {
  REQUIRED_MAJOR_VERSION: 24,
  REQUIRED_VERSION_STRING: "24.x or higher",
  VERSION_CHECK_ENDPOINT: "/api/system/node-version",
} as const;

export type NodeVersionStatus =
  | "compatible"
  | "needs-update"
  | "unknown"
  | "error";

export function isNodeVersionInfo(
  response: NodeVersionResponse,
): response is NodeVersionInfo {
  return "version" in response && "majorVersion" in response;
}

export function isNodeVersionError(
  response: NodeVersionResponse,
): response is NodeVersionErrorResponse {
  return "error" in response;
}

export function getNodeVersionStatus(majorVersion: number): NodeVersionStatus {
  if (majorVersion >= NODE_VERSION_CONSTANTS.REQUIRED_MAJOR_VERSION) {
    return "compatible";
  } else if (majorVersion > 0) {
    return "needs-update";
  } else {
    return "unknown";
  }
}

export function formatNodeVersionMessage(versionInfo: NodeVersionInfo): string {
  const status = getNodeVersionStatus(versionInfo.majorVersion);

  switch (status) {
    case "compatible":
      return `✅ Node.js ${versionInfo.version} is compatible`;
    case "needs-update":
      return `⚠️ Node.js ${versionInfo.version} needs update to ${NODE_VERSION_CONSTANTS.REQUIRED_VERSION_STRING}`;
    case "unknown":
      return `❓ Node.js version unknown`;
    default:
      return `❌ Node.js version check failed`;
  }
}
