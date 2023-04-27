// 判断当前页面的URL是否属于企业微信域名
export function isInWechatWorkDomain() {
  const host = location.host;
  return host.indexOf('.wxwork.com') !== -1;
}
export default isInWechatWorkDomain;
