import { useEnv } from './useEnv';
import { cookieStorage } from '@szero/cache';

export default () => {
  let { appName, tokenName } = useEnv();
  if (!tokenName) {
    tokenName = appName ? `${appName}-token` : 'token';
  }
  const setToken = (token: string) => {
    cookieStorage.setItem(tokenName, token, Infinity);
    return true;
  };

  const getToken = () => {
    return cookieStorage.getItem(tokenName);
  };

  const removeToken = () => {
    cookieStorage.removeItem(tokenName);
    return true;
  };
  return { setToken, getToken, removeToken };
};
