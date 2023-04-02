class applicationEnv {
  [key: string]: any;

  constructor() {
    Object.assign(this, process.env.productConfig);
  }

  setEnv = (data: any) => {
    Object.assign(this, data);
  };
}

const env = new applicationEnv();

export const useEnv = (): applicationEnv => {
  return env;
};
