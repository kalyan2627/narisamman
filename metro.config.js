const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude the Spring Boot backend directory from Metro file watching
config.resolver.blockList = [
  /[/\\]backend[/\\]/,
  ...(Array.isArray(config.resolver.blockList) 
    ? config.resolver.blockList 
    : (config.resolver.blockList ? [config.resolver.blockList] : [])),
];

module.exports = config;
