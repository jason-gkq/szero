/**
 * @description 时间格式化
 * @param fmt 格式化字符串 YYYY-MM-DD HH:mm:ss
 * @param date 时间对象或时间字符串
 * @returns 格式化后的字符串
 * @example
 * ```typescript
 * dateFormat('YYYY-MM-DD', new Date()) // 2022-01-01
 * dateFormat('YYYY-MM-DD HH:mm:ss', new Date()) // 2022-01-01 00:00:00
 * ```
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
