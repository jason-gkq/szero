/**
 * 时间格式化
 * dateFormat("YYYY-mm-dd HH:MM:SS", 2021-12-30T09:02:24.000+08:00) => 2021-12-30 09:02:24
 *
 * @param fmt
 * @param date
 * @returns
 */
export function dateFormat(fmt: string, date: Date | string) {
  if (!date) {
    return '';
  }
  date = new Date(date);
  let ret;
  const opt: { [key: string]: any } = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
      );
    }
  }
  return fmt;
}
export default dateFormat;
