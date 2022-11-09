import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormList,
  ProFormDependency,
  ProFormRadio,
  ProFormDigit,
} from '@ant-design/pro-components';
import ProCard from '@ant-design/pro-card';
import { buttonTypeOptions } from './constant';
import { Space, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useRef } from 'react';

export default () => {
  const actionRef = useRef();

  return (
    <ProForm.Group title="工具栏按钮配置">
      <ProFormList
        actionRef={actionRef}
        name="toolBarList"
        creatorButtonProps={{
          creatorButtonText: '添加工具栏按钮',
        }}
        itemRender={({ listDom, action }, { record, index }) => {
          return (
            <ProCard
              bordered
              extra={
                <Space>
                  <ArrowUpOutlined
                    onClick={() => {
                      actionRef.current.move(index, index - 1);
                    }}
                  />
                  <ArrowDownOutlined
                    onClick={() => {
                      actionRef.current.move(index, index + 1);
                    }}
                  />
                  {action}
                </Space>
              }
              style={{
                marginBlockEnd: 8,
              }}
            >
              {listDom}
            </ProCard>
          );
        }}
      >
        {() => {
          return (
            <ProForm.Group>
              <ProFormSelect
                name="buttonType"
                initialValue={'default'}
                label="按钮类型"
                width={120}
                fieldProps={{
                  options: buttonTypeOptions,
                }}
                placeholder="请输入按钮类型"
              />
              <ProFormText
                name="buttonName"
                label="按钮名称"
                width={180}
                rules={[{ required: true, message: '请输入按钮名称' }]}
                placeholder="请输入按钮名称"
              />
              <ProFormText
                name="buttonKey"
                label={
                  <>
                    <span style={{ marginRight: '4px' }}>按钮Key</span>
                    <Tooltip placement="top" title="会根据这个key生成对应的函数代码">
                      <ExclamationCircleOutlined style={{ cursor: 'pointer' }} />
                    </Tooltip>
                  </>
                }
                width={180}
                rules={[{ required: true, message: '请输入按钮Key' }]}
                placeholder="请输入按钮Key"
              />
            </ProForm.Group>
          );
        }}
      </ProFormList>
    </ProForm.Group>
  );
};
