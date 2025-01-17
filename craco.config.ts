import { CracoConfig } from '@craco/types';
const CracoLessPlugin = require('craco-less');

const config: CracoConfig = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#1DA57A', // Primary color
              '@link-color': '#1DA57A',   // Link color
              '@border-radius-base': '5px', // Border radius
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};

export default config;
