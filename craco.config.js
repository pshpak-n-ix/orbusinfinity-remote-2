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
            "./TodoTiles": "./src/components/TodoTiles",
          },
          shared: webpackConfig.sharedDependencies,
        }),
        new DefinePlugin(webpackConfig.definePlugin),
      ],
    },
    configure: (config) => {
      config.output.publicPath = webpackConfig.publicPath;
      
      if (webpackConfig.enableMinification) {
        config.optimization = {
          ...config.optimization,
          minimize: true,
        };
      }
      
      if (!webpackConfig.enableSourceMaps) {
        config.devtool = false;
      }
      
      return config;
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