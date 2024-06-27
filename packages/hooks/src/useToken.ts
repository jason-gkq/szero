import { cookieStorage } from '@szero/cache';

let tokenName = 'token';
/**
 * 设置token存储key
 * @param name token存储key
 */
export const setTokenName = (name: string) => {
  tokenName = name;
};
/**
 * @description 使用cookie管理token
 */
export default () => {
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
