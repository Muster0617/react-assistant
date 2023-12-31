import { useCallback, useEffect } from 'react';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { message, Tree } from 'antd';

const deepClone = (target ) => {
  if (typeof target !== 'object') return target;
  const flag = target instanceof Array ? [] : {};
  for (const key in target) {
    if (typeof target[key] === 'object') flag[key] = deepClone(target[key]);
    else flag[key] = target[key];
  }
  return flag;
};

export default forwardRef(({ request, ...reset } , ref) => {
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [loadedKeys, setLoadedKeys] = useState([]);

  const getTree = async () => {
    const { data, success, errorMsg } = await request();
    if (success) {
      setTreeData(data || []);
    } else message.error(errorMsg || '请求失败');
  };

  useEffect(() => {
    getTree();
  }, []);

  const updateTreeData = (data, key, children) => {
    return data.map((node ) => {
      if (node?.key === key) {
        node.children = children;
      }
      if (node?.children?.length > 0) {
        node.children = updateTreeData(node.children, key, children);
      }
      return node;
    });
  };

  const getKeys = (data) => {
    let keys = [];
    for (const item of data) {
      keys.push(item.key);
      if (item?.children?.length > 0) {
        keys = [...keys, ...getKeys(item.children)];
      }
    }
    return keys;
  };

  // 返回目标节点下子孙节点下的key
  const getChildKeys = (data, key)  => {
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

  const resetNodeChild = (data, key) => {
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

  const reloadNode = (key) => {
    const data = deepClone(treeData);
    const childKeys = getChildKeys(data, key);
    setTreeData(resetNodeChild(data, key));
    setLoadedKeys(loadedKeys?.filter((item) => !childKeys.includes(item)));
    setExpandedKeys(expandedKeys?.filter((item) => !childKeys.slice(1).includes(item)));
  }

  const onLoadData = ({ key, isLeaf } ) =>
    new Promise(async (resolve) => {
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
      setTreeData: (data) => setTreeData(data),
      getExpandedKeys: () => expandedKeys,
      setExpandedKeys: (keys) => setExpandedKeys(keys),
      getLoadedKeys: () => loadedKeys,
      setLoadedKeys: (keys) => setLoadedKeys(keys),
    }),
    [expandedKeys, loadedKeys, treeData],
  );

  return (
    <Tree
      loadData={onLoadData}
      treeData={treeData}
      loadedKeys={loadedKeys}
      expandedKeys={expandedKeys}
      onExpand={(keys) => setExpandedKeys(keys)}
      onLoad={(keys) => setLoadedKeys(keys)}
      {...reset}
    />
  );
});
