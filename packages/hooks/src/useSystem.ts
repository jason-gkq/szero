import platform from "platform";

class systemInfo {
  platform: any;
  winWidth: number;
  winHeight: number;
  onLunchPlatform: any;

  onLunchPackage: any;
  onLunchScreen: any;
  constructor() {
    const processEnv = process.env;
    const {
      navigator: navigatorInfo,
      screen: screenInfo,
      innerHeight,
      innerWidth,
      outerHeight,
      outerWidth,
      screenTop,
      screenLeft,
    } = window;
    const platformInfo = platform.parse(navigatorInfo.userAgent);

    this.platform = platformInfo.name;
    this.winWidth = innerWidth || document.body.clientWidth;
    this.winHeight = innerHeight || screenInfo.availHeight;
    /**
     * 根据运行环境解析出来的 platform 信息
     */
    this.onLunchPlatform = platformInfo;
    this.onLunchPackage = {
      projectName: processEnv.npm_package_name || "",
      babelEnv: processEnv.BABEL_ENV,
      nodeEnv: processEnv.NODE_ENV,
      lang: processEnv.LANG,
      launchInstanceID: processEnv.LaunchInstanceID,
      version: processEnv.npm_package_version,
      lifecycleEvent: processEnv.npm_lifecycle_event,
      lifeycleScript: processEnv.npm_lifecycle_script,
      projectMain: processEnv.npm_package_main,
      projectType: processEnv.npm_package_type,
      publicUrlOrPath: processEnv.publicUrlOrPath,
    };
    /**
     * 计算项目启动时所有宽高以及屏幕信息
     */
    this.onLunchScreen = {
      innerHeight, // 屏幕可用工作区高度
      innerWidth, // 屏幕可用工作区宽度
      outerHeight, // 屏幕高
      outerWidth, // 屏幕宽
      screenTop, // 网页正文部分上
      screenLeft, // 网页正文部分左
      height: screenInfo.height, // 屏幕分辨率的高
      width: screenInfo.width, // 屏幕分辨率的宽
      availHeight: screenInfo.availHeight, // 屏幕可用工作区高度
      availWidth: screenInfo.availWidth, // 屏幕可用工作区宽度
      colorDepth: screenInfo.colorDepth, // 屏幕设置的位彩色
      pixelDepth: screenInfo.pixelDepth, // 屏幕设置的像素/英寸
    };
  }
}

const system = new systemInfo();

export const useSystem = (): systemInfo => {
  return system;
};
