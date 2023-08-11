import { cookieStorage } from '@szero/cache';

export default () => {
  let tokenName = 'token';

  const setTokenName = (name: string) => {
    tokenName = name;
  };

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
  return { setToken, getToken, removeToken, setTokenName };
};
