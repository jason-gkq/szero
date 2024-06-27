/**
 * 存储全局环境变量，可在项目启动时候初始化
 */

class applicationEnv {
  [key: string]: any;

  setEnv = (data: any) => {
    Object.assign(this, data);
  };
}

const env = new applicationEnv();

/**
 * @description 获取配置文件中的环境变量
 * @returns {Record<string, any>}
 */
export const useEnv = () => {
  return env;
};
