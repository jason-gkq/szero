import isInWechatWork from './isInWechatWork';

// 判断是否在微信中
export function isInWechat() {
  const ua = navigator.userAgent.toLowerCase();
  return /micromessenger/i.test(ua) && !isInWechatWork();
}

export default isInWechat;
