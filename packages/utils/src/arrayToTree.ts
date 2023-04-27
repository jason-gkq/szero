import isArray from './isArray';

/**
 * 数组变成树形结构方法
 *
 * @param items
 * @param key 当前 id 名称
 * @param parentKey 父级id名称
 * @param childrenKey 子集存放数组名称
 * @returns
 */
export function arrayToTree(
  items: Array<any>,
  key: string,
  parentKey: string,
  childrenKey: string = 'children',
  rootList: any[] = []
) {
  const result: any = [];
  const itemMap: any = {};
  const mapItems: any = {};
  /**
   * 如果没有传入跟节点，则先获取跟节点
   */
  if (!rootList || !isArray(rootList) || rootList.length <= 0) {
    items.forEach((item: any) => {
      mapItems[item[key]] = item;
    });
    items.forEach((item: any) => {
      if (!mapItems[item[parentKey]]) {
        rootList.push(item[key]);
      }
    });
  }

  for (const item of items) {
    const id = item[key];
    const pid = item[parentKey];

    if (!itemMap[id]) {
      itemMap[id] = {
        [childrenKey]: [],
      };
    }

    itemMap[id] = {
      ...item,
      [childrenKey]: itemMap[id][childrenKey],
    };
    const treeItem = itemMap[id];

    if (rootList.includes(id)) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          [childrenKey]: [],
        };
      }
      itemMap[pid][childrenKey].push(treeItem);
    }
  }
  return result;
}

export default arrayToTree;
