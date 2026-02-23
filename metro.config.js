const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

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
