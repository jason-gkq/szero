import isInWechat from './isInWechat';
import isInWechatWork from './isInWechatWork';
// 判断是否在浏览器中
export function isInBrowser() {
  return !isInWechat() && !isInWechatWork();
}

export default isInBrowser;
