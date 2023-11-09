import type { Key } from 'react';
import { useEffect } from 'react';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { message, Tree } from 'antd';

const deepClone = (target: any) => {
  if (typeof target !== 'object') return target;
  const flag = target instanceof Array ? [] : {};
  for (const key in target) {
    if (typeof target[key] === 'object') flag[key] = deepClone(target[key]);
    else flag[key] = target[key];
  }
  return flag;
};

export default forwardRef(({ request, ...reset }: any, ref) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [loadedKeys, setLoadedKeys] = useState<Key[]>([]);

  const getTree = async () => {
    const { data, success, errorMsg } = await request();
    if (success) {
      setTreeData(data || []);
    } else message.error(errorMsg || '请求失败');
  };

  useEffect(() => {
    getTree();
  }, []);

  const updateTreeData = (data: any[], key: string, children: any[]) => {
    return data.map((node: any) => {
      if (node?.key === key) {
        node.children = children;
      }
      if (node?.children?.length > 0) {
        node.children = updateTreeData(node.children, key, children);
      }
      return node;
    });
  };

  const getKeys = (data: any[]) => {
    let keys: string[] = [];
    for (const item of data) {
      keys.push(item.key);
      if (item?.children?.length > 0) {
        keys = [...keys, ...getKeys(item.children)];
      }
    }
    return keys;
  };

  // 返回目标节点下子孙节点下的key
  const getChildKeys = (data: any[], key: string): any => {
    for (const item of data) {
      if (item.key === key) {
        return getKeys([item]);
      }
      if (item?.children?.length > 0) {
        return getChildKeys(item?.children, key);
      }
    }
    return [];
  };

  const resetNodeChild = (data: any[], key: string) => {
    return data.map((node) => {
      if (node?.key === key) {
        node.children = [];
      }
      if (node?.children?.length > 0) {
        node.children = resetNodeChild(node.children, key);
      }
      return node;
    });
  };

  const reloadNode = (key: string) => {
    const data = deepClone(treeData);
    const childKeys = getChildKeys(data, key);
    setTreeData(resetNodeChild(data, key));
    setLoadedKeys(loadedKeys?.filter((item) => !childKeys.includes(item)));
    setExpandedKeys(expandedKeys?.filter((item) => !childKeys.slice(1).includes(item)));
  };

  const onLoadData = ({ key, isLeaf }: any) =>
    new Promise<void>(async (resolve) => {
      if (isLeaf) {
        resolve();
        return;
      }
      const { data, success, errorMsg } = await request(key);
      if (success) {
        setTreeData((origin) => updateTreeData(origin, key, data));
      } else message.error(errorMsg || '请求失败');
      resolve();
    });

  useImperativeHandle(
    ref,
    () => ({
      reloadNode: reloadNode,
      getTreeData: () => treeData,
      setTreeData: (data: any[]) => setTreeData(data),
      getExpandedKeys: () => expandedKeys,
      setExpandedKeys: (keys: string[]) => setExpandedKeys(keys),
      getLoadedKeys: () => loadedKeys,
      setLoadedKeys: (keys: string[]) => setLoadedKeys(keys),
    }),
    [],
  );

  return (
    <Tree
      loadData={onLoadData}
      treeData={treeData}
      loadedKeys={loadedKeys}
      expandedKeys={expandedKeys}
      onExpand={(keys: Key[]) => setExpandedKeys(keys)}
      onLoad={(keys: Key[]) => setLoadedKeys(keys)}
      {...reset}
    />
  );
});
