import type { Key } from 'react';
import React, { useState } from 'react';
import { Button, Tree, Card, Input } from 'antd';

interface DataNode {
  title: string;
  key: string;
  children: DataNode[];
  isLeaf?: boolean;
}

const initTreeData: DataNode[] = [
  { title: 'Expand to load -- 1', key: '1', children: [] },
  { title: 'Expand to load -- 2', key: '2', children: [] },
  { title: 'Tree Node -- 3', key: '3', isLeaf: true, children: [] },
];

const deepClone = (target: any) => {
  if (typeof target !== 'object') return target;
  const flag = target instanceof Array ? [] : {};
  for (const key in target) {
    if (typeof target[key] === 'object') flag[key] = deepClone(target[key]);
    else flag[key] = target[key];
  }
  return flag;
};

export default () => {
  const [treeData, setTreeData] = useState(initTreeData);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [loadedKeys, setLoadedKeys] = useState<Key[]>([]);
  const [reloadKey, setReloadKey] = useState<string>('');

  const updateTreeData = (data: DataNode[], key: string, children: DataNode[]) => {
    return data.map((node: DataNode) => {
      if (node?.key === key) {
        node.children = children;
      }
      if (node?.children?.length > 0) {
        node.children = updateTreeData(node.children, key, children);
      }
      return node;
    });
  };

  const getKeys = (data: DataNode[]) => {
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
  const getChildKeys = (data: DataNode[], key: string): any => {
    for (const item of data) {
      if (item.key === key) {
        return getKeys([item]);
      }
      if (item?.children?.length > 0) {
        return getChildKeys(item?.children, key);
      }
    }
  };

  const resetNodeChild = (data: DataNode[], key: string) => {
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
    const data = deepClone(treeData);
    const childKeys = getChildKeys(data, reloadKey);
    setTreeData(resetNodeChild(data, reloadKey));
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
            { title: `Child Node ${key}-0`, key: `${key}-0`, children: [] },
            { title: `Child Node ${key}-1`, key: `${key}-1`, children: [] },
          ]),
        );

        resolve();
      }, 1000);
    });

  return (
    <>
      <div
        style={{
          display: 'flex',
          marginBottom: 24,
        }}
      >
        <Input
          style={{
            width: 300,
            marginRight: 24,
          }}
          value={reloadKey}
          onChange={(e) => setReloadKey(e.target.value)}
          placeholder="请输入节点的key"
        />
        <Button type="primary" onClick={reloadNode}>
          刷新
        </Button>
      </div>
      <Tree
        loadData={onLoadData}
        treeData={treeData}
        loadedKeys={loadedKeys}
        expandedKeys={expandedKeys}
        onExpand={(keys: Key[]) => setExpandedKeys(keys)}
        onLoad={(keys: Key[]) => setLoadedKeys(keys)}
      />
    </>
  );
};
