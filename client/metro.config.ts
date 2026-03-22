const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
config.resolver.assetExts = config.resolver.assetExts.filter((e: string) => e !== "svg");
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];
module.exports = config;
