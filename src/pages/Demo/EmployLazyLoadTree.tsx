import { useState, useRef } from 'react';
import { Button, Input, Space } from 'antd';
import LazyLoadTree from '@/components/LazyLoadTree';

export default () => {
  const [reloadKey, setReloadKey] = useState<string>('');
  const treeRef = useRef<any>({});

  const request = async (key) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (key) {
          resolve({
            data: [
              { title: `Child Node ${key}-0`, key: `${key}-0`, children: [] },
              { title: `Child Node ${key}-1`, key: `${key}-1`, children: [] },
            ],
            success: true,
          });
          return;
        }
        resolve({
          data: [
            { title: 'Expand to load -- 1', key: '1', children: [] },
            { title: 'Expand to load -- 2', key: '2', children: [] },
            { title: 'Tree Node -- 3', key: '3', isLeaf: true, children: [] },
          ],
          success: true,
        });
      }, 500);
    });
  };

  return (
    <>
      <div
        style={{
          marginBottom: 12,
        }}
      >
        <Space>
          <Input
            style={{
              width: 300,
            }}
            value={reloadKey}
            onChange={(e) => setReloadKey(e.target.value)}
            placeholder="请输入节点的key"
          />
          <Button type="primary" onClick={() => treeRef.current.reloadNode(reloadKey)}>
            刷新
          </Button>
        </Space>
      </div>
      <LazyLoadTree ref={treeRef} request={request} />
    </>
  );
};
