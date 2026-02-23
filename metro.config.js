// Learn more https://docs.expo.dev/guides/monorepos/
// We set EXPO_NO_METRO_WORKSPACE_ROOT=1 so expo-router resolves ./app/
// relative to this project instead of the monorepo root. That means we
// must manually tell Metro where to find monorepo dependencies.
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const monorepoRoot = path.resolve(__dirname, "../..");
const config = getDefaultConfig(__dirname);

// Watch the monorepo root so Metro can find workspace packages
config.watchFolders = [monorepoRoot];

// Let Metro resolve packages from both this project and the monorepo root
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Stub web-only dependencies that @tambo-ai/react imports
const upstreamResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-dom" || moduleName === "react-media-recorder") {
    return { type: "empty" };
  }
  if (upstreamResolveRequest) {
    return upstreamResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
