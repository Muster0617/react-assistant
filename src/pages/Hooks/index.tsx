import React, { useState } from 'react';
import styles from './index.less';
import { Tabs } from 'antd';
import UseState from './components/UseState';
export default () => {
  const [activeKey, setActiveKey] = useState('1');
  const renderTab = () => {
    switch (activeKey) {
      default:
      case '1':
        return <UseState />;
    }
  };
  return (
    <div className={styles.wrapper}>
      <Tabs accessKey={activeKey} onChange={(key) => setActiveKey(key)}>
        <Tabs.TabPane tab="useState" key="1">
          {renderTab()}
        </Tabs.TabPane>
        {renderTab()}
      </Tabs>
    </div>
  );
};
