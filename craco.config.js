const { ModuleFederationPlugin } = require("webpack").container;
const { DefinePlugin } = require("webpack");
const deps = require("./package.json").dependencies;
const { createWebpackConfig } = require("./config/environments");

const webpackConfig = createWebpackConfig();

module.exports = {
  babel: {
    presets: [
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
          development: false  // Force production JSX transform
        }
      ]
    ],
    plugins: [
      [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'automatic',
          development: false  // Explicitly disable development JSX
        }
      ]
    ]
  },
  webpack: {
    plugins: {
      add: [
        new ModuleFederationPlugin({
          name: "remote_app_2",
          filename: "remoteEntry.js",
          exposes: {
            "./Dashboard": "./src/components/DashboardMock",
            "./TodoTiles": "./src/components/TodoTilesWrapper",
          },
          shared: webpackConfig.sharedDependencies,
        }),
        new DefinePlugin(webpackConfig.definePlugin),
      ],
    },
    configure: (webpackConfig) => {
      // Set environment-specific configuration
      if (webpackConfig.isProduction) {
        webpackConfig.mode = 'production';
      }
      
      // Set environment-specific public path
      webpackConfig.output.publicPath = webpackConfig.publicPath;
      return webpackConfig;
    },
  },
  devServer: {
    // Use a different port to avoid conflicts with the shell app.
    port: webpackConfig.devServerPort,
    // CORS configuration to allow cross-origin requests for Module Federation
    headers: webpackConfig.corsHeaders,
    // Additional settings for Module Federation
    allowedHosts: "all",
  },
};