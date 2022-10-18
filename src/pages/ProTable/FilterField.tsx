import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormList,
  ProFormDependency,
  ProFormDigit,
} from '@ant-design/pro-components';
import ProCard from '@ant-design/pro-card';
import { filterValueTypeOptions } from './constant';
import { Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useRef } from 'react';

export default () => {
  const actionRef = useRef();

  return (
    <ProForm.Group title="筛选项配置">
      <ProFormList
        actionRef={actionRef}
        name="filterList"
        creatorButtonProps={{
          creatorButtonText: '添加筛选项',
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
            <>
              <ProForm.Group>
                <ProFormSelect
                  name="valueType"
                  initialValue={'text'}
                  label="valueType"
                  width={120}
                  fieldProps={{
                    options: filterValueTypeOptions,
                  }}
                />
                <ProFormText
                  name="title"
                  label="title"
                  width={180}
                  rules={[{ required: true }]}
                  placeholder="请输入title"
                />
                <ProFormText
                  name="dataIndex"
                  label="dataIndex"
                  width={180}
                  rules={[{ required: true }]}
                  placeholder="请输入dataIndex"
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormDependency name={['valueType']}>
                  {({ valueType }) => {
                    if (valueType === 'text') {
                      return (
                        <ProFormText
                          name="placeholder"
                          label="placeholder"
                          width={180}
                          placeholder="请输入placeholder"
                        />
                      );
                    }
                  }}
                </ProFormDependency>
                <ProFormDependency name={['valueType']}>
                  {({ valueType }) => {
                    if (valueType === 'text') {
                      return (
                        <ProFormDigit
                          label="最大长度"
                          name="maxLength"
                          width={180}
                          placeholder="请输入最大长度"
                        />
                      );
                    }
                  }}
                </ProFormDependency>
              </ProForm.Group>
            </>
          );
        }}
      </ProFormList>
    </ProForm.Group>
  );
};
