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

export default (props) => {
  const { onFinish, onReset } = props;
  const actionRef = useRef();
  const formRef = useRef();

  return (
    <>
      <ProForm
        formRef={formRef}
        autoFocusFirstInput
        onFinish={onFinish}
        submitter={{
          searchConfig: {
            resetText: '重置',
            submitText: '生成表格',
          },
          onReset,
        }}
      >
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
                    initialValue={'Default'}
                    label="按钮类型"
                    width={120}
                    fieldProps={{
                      options: buttonTypeOptions,
                    }}
                    placeholder="请输入按钮类型"
                  />
                  <ProFormText
                    name="buttonName"
                    label="ButtonName"
                    width={180}
                    rules={[{ required: true, message: '请输入按钮名称' }]}
                    placeholder="请输入ButtonName"
                  />
                  <ProFormText
                    name="buttonKey"
                    label="ButtonKey（唯一）"
                    width={180}
                    rules={[{ required: true, message: '请输入按钮Key' }]}
                    placeholder="请输入ButtonKey"
                  />
                </ProForm.Group>
              );
            }}
          </ProFormList>
        </ProForm.Group>
      </ProForm>
    </>
  );
};
