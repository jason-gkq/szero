import { useEnv, useToken } from '@szero/hooks';
import { setCacheEnvironment } from '@szero/cache';
import { initNavigate } from '@szero/navigate';

/**
 * 初始化配置文件
 */
const env = useEnv();
env.setEnv(process.env.productConfig);

const {
  appName,
  tokenName,
  cachePrefix,
  route: configRoute,
  layout: configLayout,
} = env;

initNavigate({
  routeType: configRoute?.type,
  rootRoute: appName,
  index: configLayout.index,
});

const { setTokenName } = useToken();
if (tokenName) {
  setTokenName(tokenName);
} else {
  setTokenName(appName ? `${appName}-token` : 'token');
}

setCacheEnvironment({
  prefix: cachePrefix,
  prefixUnable: [],
});
