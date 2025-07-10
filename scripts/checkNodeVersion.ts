#!/usr/bin/env node

/**
 * Node.js Version Check Script
 * Ensures that Node.js version 24 or higher is being used
 */

import { execSync } from "child_process";
import * as path from "path";
import {
  type NodeVersionInfo,
  type NodeVersionError,
  type NodeVersionCheckResult,
  NODE_VERSION_CONSTANTS,
  getNodeVersionStatus,
  formatNodeVersionMessage,
} from "../types/nodeVersion";

function getCurrentNodeVersion(): number {
  try {
    const version: string = process.version;
    const majorVersion: number = parseInt(version.slice(1).split(".")[0], 10);
    return majorVersion;
  } catch (error) {
    const nodeError = error as NodeVersionError;
    console.error("❌ Error getting Node.js version:", nodeError.message);
    process.exit(1);
  }
}

function getNodeVersionInfo(): NodeVersionInfo {
  const version: string = process.version;
  const majorVersion: number = getCurrentNodeVersion();
  const isSupported: boolean =
    majorVersion >= NODE_VERSION_CONSTANTS.REQUIRED_MAJOR_VERSION;

  return {
    version,
    majorVersion,
    isSupported,
    environment: "server",
    platform: process.platform,
    arch: process.arch,
    requiredVersion: NODE_VERSION_CONSTANTS.REQUIRED_VERSION_STRING,
    timestamp: new Date().toISOString(),
  };
}

function checkNodeVersion(): NodeVersionCheckResult {
  const nodeInfo: NodeVersionInfo = getNodeVersionInfo();
  const status = getNodeVersionStatus(nodeInfo.majorVersion);

  console.log(`🔍 Checking Node.js version...`);
  console.log(`📋 Current Node.js version: ${nodeInfo.version}`);
  console.log(
    `🎯 Required Node.js version: ${NODE_VERSION_CONSTANTS.REQUIRED_VERSION_STRING}`,
  );

  if (!nodeInfo.isSupported) {
    console.error(
      `\n❌ Node.js version ${NODE_VERSION_CONSTANTS.REQUIRED_VERSION_STRING} is required!`,
    );
    console.error(`   Current version: ${nodeInfo.version}`);
    console.error(
      `   Required version: ${NODE_VERSION_CONSTANTS.REQUIRED_VERSION_STRING}`,
    );
    console.error(`\n🔧 To fix this issue:`);
    console.error(
      `   1. Install Node.js ${NODE_VERSION_CONSTANTS.REQUIRED_MAJOR_VERSION}.x from https://nodejs.org/`,
    );
    console.error(`   2. Or use Node Version Manager (nvm):`);
    console.error(
      `      nvm install ${NODE_VERSION_CONSTANTS.REQUIRED_MAJOR_VERSION}`,
    );
    console.error(
      `      nvm use ${NODE_VERSION_CONSTANTS.REQUIRED_MAJOR_VERSION}`,
    );
    console.error(`   3. Or use the .nvmrc file:`);
    console.error(`      nvm use`);
    console.error(
      `\n💡 Note: This project includes a .nvmrc file for automatic version management.`,
    );
    process.exit(1);
  }

  const message = formatNodeVersionMessage(nodeInfo);
  console.log(message);

  return {
    success: true,
    version: nodeInfo.version,
    majorVersion: nodeInfo.majorVersion,
    isSupported: nodeInfo.isSupported,
    message,
  };
}

// Only run the check if this script is executed directly
if (require.main === module) {
  checkNodeVersion();
}

export { checkNodeVersion, getCurrentNodeVersion, getNodeVersionInfo };
export type { NodeVersionInfo, NodeVersionError };
