export interface IUseSelectEnum {
  /**
   * @description 获取数据源
   * @returns {Record<string, any>[]}
   */
  getData: () => Record<string, any>[];
  /**
   * 根据数据源获取枚举数据，仅用于列表中枚举 antd valueEnum 数据组装
   * @returns {Record<string, any>}
   * @example
   * ```tsx
   * getEnum() // 返回格式：{ '0': {text: '停用'}, '1': {text: '启用'} }
   * getEnum({'0': 'Error', '1': 'Success'}) // 返回格式：{ '0': {text: '停用', status: 'Error'}, '1': {text: '启用', status: 'Success'} }
   * ```
   */
  getEnum: () => Record<string, any>;
  /**
   * 根据数据源获取枚举数据，仅用于列表中枚举 antd options 数据组装
   * @returns {{ value: string; label: string } & Record<string, any>[]}
   * @example
   * ```tsx
   * getOptions() // 返回格式：[{ value: '0', label: '停用' }, { value: '1', label: '启用' }]
   * ```
   */
  getOptions: () => { value: string; label: string } & Record<string, any>[];
  /**
   * 根据数据源获取枚举值获取枚举名称
   * @param value 枚举值
   * @returns {string}
   * @example
   * ```tsx
   * getLabel('1') // "启用"
   * getLabel('0') // "停用"
   * ```
   */
  getLabel: (value: string | number | boolean) => string | number | boolean;
  /**
   * 根据数据源获取枚举值获取枚举状态
   * @param value
   * @returns
   * @example
   * ```tsx
   * getKey('启用')  //  1
   * getKey('停用')  //  0
   * ```
   */
  getKey: (value: string | number | boolean) => string | number | boolean;
  /**
   * 根据数据源获取枚举名称获取枚举值
   * @param value 枚举名称
   * @returns
   * @example
   * ```tsx
   * getValue('启用')  //  1
   * getValue('停用')  //  0
   * ```
   */
  getValue: (value: string | number | boolean) => string | number | boolean;
}

/**
 * @description 枚举选择器
 * @param data 数据源
 * @param key 节点值字段
 * @param label 节点名称字段
 * @returns {IUseSelectEnum}
 */
export default (
  data: Record<string, any>[],
  key = 'value',
  label = 'label'
): IUseSelectEnum => {
  const getData = () => {
    return data;
  };

  const getEnum = (status?: { [key: string]: string }) => {
    if (!data) {
      return {};
    }
    let groups = {};
    data.reduce((groups: any, item: any) => {
      if (status && status[item[key]]) {
        groups[item[key]] = {
          text: String(item[label]),
          status: status[item[key]],
        };
      } else {
        groups[item[key]] = { text: String(item[label]) };
      }
      return groups;
    }, groups);
    return groups;
  };
  const getOptions = () => {
    if (!data) {
      return [];
    }
    return data.reduce((options: any, item: any) => {
      options.push({
        value: item[key],
        label: item[label],
        ...item,
      });
      return options;
    }, []);
  };
  const getLabel = (
    value: string | number | boolean
  ): string | number | boolean => {
    if (!data) {
      return value;
    }
    const currentData = data.find(
      (item) => String(item[key]) === String(value)
    );
    return currentData?.[label] || value;
  };
  const getValue = (
    value: string | number | boolean
  ): string | number | boolean => {
    if (!data) {
      return value;
    }
    const currentData = data.find(
      (item) => String(item[label]) === String(value)
    );
    return currentData?.[key] || value;
  };
  const getKey = getValue;
  return { getData, getEnum, getOptions, getLabel, getKey, getValue };
};
