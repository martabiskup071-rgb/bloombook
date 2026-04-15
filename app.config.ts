import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  web: {
    ...config.web,
    output: process.env.EAS_BUILD ? undefined : 'server',
  },
});
