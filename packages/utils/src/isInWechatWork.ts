// 判断是否在企业微信中
export function isInWechatWork() {
  const ua = navigator.userAgent.toLowerCase();
  return /wxwork/i.test(ua);
}
export default isInWechatWork;
