export * from './util';

// 判断是否在企业微信中
export function isInWechatWork() {
  var ua = navigator.userAgent.toLowerCase();
  return /wxwork/i.test(ua);
}

// 判断是否在微信中
export function isInWechat() {
  var ua = navigator.userAgent.toLowerCase();
  return /micromessenger/i.test(ua) && !isInWechatWork();
}

// 判断是否在浏览器中
export function isInBrowser() {
  return !isInWechat() && !isInWechatWork();
}

// 判断当前页面的URL是否属于企业微信域名
export function isInWechatWorkDomain() {
  var host = location.host;
  return host.indexOf('.wxwork.com') !== -1;
}
