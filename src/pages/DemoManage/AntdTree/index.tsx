import React, { useState } from 'react';
import { Button, Tree } from 'antd';

interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

const initTreeData: DataNode[] = [
  { title: 'Expand to load', key: '0' },
  { title: 'Expand to load', key: '1' },
  { title: 'Tree Node', key: '2', isLeaf: true },
];

const deepClone = (target) => {
  if (typeof target !== 'object') return target;
  const flag = target instanceof Array ? [] : {};
  for (const key in target) {
    if (typeof target[key] === 'object') flag[key] = deepClone(target[key]);
    else flag[key] = target[key];
  }
  return flag;
};

const App: React.FC = () => {
  const [treeData, setTreeData] = useState(initTreeData);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [loadedKeys, setLoadedKeys] = useState([]);

  const updateTreeData = (data, key, children) => {
    return data.map((node) => {
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
  const getChildKeys = (data, key) => {
    for (const item of data) {
      console.log(item, 'item');
      if (item.key === key) {
        return getKeys([item]);
      }
      if (item?.children?.length > 0) {
        return getChildKeys(item?.children, key);
      }
    }
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

  const reloadNode = () => {
    const key = '0-0';
    const data = deepClone(treeData);
    // 清除loadedKeys\
    const childKeys = getChildKeys(data, key);

    setTreeData(resetNodeChild(data, key));
    setLoadedKeys(loadedKeys?.filter((item) => !childKeys.includes(item)));
    setExpandedKeys(expandedKeys?.filter((item) => !childKeys.slice(1).includes(item)));

    console.log(childKeys, 'childKeys');
  };

  const onLoadData = ({ key, isLeaf }: any) =>
    new Promise<void>((resolve) => {
      if (isLeaf) {
        resolve();
        return;
      }
      setTimeout(() => {
        setTreeData((origin) =>
          updateTreeData(origin, key, [
            { title: 'Child Node', key: `${key}-0` },
            { title: 'Child Node', key: `${key}-1` },
          ]),
        );

        resolve();
      }, 1000);
    });

  return (
    <>
      <Tree
        loadData={onLoadData}
        treeData={treeData}
        loadedKeys={loadedKeys}
        expandedKeys={expandedKeys}
        onExpand={(keys) => setExpandedKeys(keys)}
        onLoad={(keys) => setLoadedKeys(keys)}
      />
      <Button onClick={reloadNode}>刷新</Button>
    </>
  );
};

export default App;
