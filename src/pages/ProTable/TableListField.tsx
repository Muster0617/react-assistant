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
import { tableValueTypeOptions } from './constant';
import { Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useRef } from 'react';

export default ({ formRef }) => {
  const actionRef = useRef();
  const operateListActionRef = useRef();

  return (
    <ProForm.Group title="表格项配置">
      <ProFormList
        actionRef={actionRef}
        name="tableList"
        creatorButtonProps={{
          creatorButtonText: '添加表格项',
        }}
        copyIconProps={{ tooltipText: false }}
        deleteIconProps={{ tooltipText: false }}
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
        {(f, index) => {
          return (
            <>
              <ProForm.Group>
                <ProFormDependency name={['isOperate']}>
                  {({ isOperate }) => {
                    if (!isOperate) {
                      return (
                        <ProFormSelect
                          name="valueType"
                          initialValue={'text'}
                          label="valueType"
                          width={120}
                          fieldProps={{
                            options: tableValueTypeOptions,
                            onChange: (value) => {
                              if (value === 'index') {
                                const tableList = formRef.current?.getFieldValue('tableList');
                                tableList[index].title = '序号';
                                formRef.current?.setFieldsValue({ tableList });
                              }
                            },
                          }}
                        />
                      );
                    }
                  }}
                </ProFormDependency>
                <ProFormText
                  name="title"
                  label="title"
                  width={180}
                  rules={[{ required: true }]}
                  placeholder="请输入title"
                />

                <ProFormDependency name={['isOperate', 'valueType']}>
                  {({ isOperate, valueType }) => {
                    if (!isOperate && ['text'].includes(valueType)) {
                      return (
                        <ProFormText
                          name="dataIndex"
                          label="dataIndex"
                          width={180}
                          rules={[{ required: true }]}
                          placeholder="请输入dataIndex"
                        />
                      );
                    }
                  }}
                </ProFormDependency>
                <ProFormDigit label="width" name="width" width={180} placeholder="请输入width" />
                <ProFormRadio.Group
                  name="isOperate"
                  initialValue={false}
                  label="是否是操作栏"
                  options={[
                    {
                      label: '是',
                      value: true,
                    },
                    {
                      label: '否',
                      value: false,
                    },
                  ]}
                  fieldProps={{
                    onChange: (value) => {
                      if (value) {
                        const tableList = formRef.current?.getFieldValue('tableList');
                        tableList[index].title = '操作';
                        formRef.current?.setFieldsValue({ tableList });
                      }
                    },
                  }}
                />
              </ProForm.Group>

              {/* <ProForm.Group>
                <ProFormRadio.Group
                  name="hasRender"
                  initialValue={false}
                  label="是否需要render函数"
                  options={[
                    {
                      label: '是',
                      value: true,
                    },
                    {
                      label: '否',
                      value: false,
                    },
                  ]}
                />
              </ProForm.Group> */}
              <ProFormDependency name={['isOperate']}>
                {({ isOperate }) => {
                  if (isOperate) {
                    return (
                      <ProFormList
                        actionRef={operateListActionRef}
                        name="operateList"
                        label="操作栏按钮配置"
                        creatorButtonProps={{
                          creatorButtonText: '添加操作按钮',
                        }}
                        rules={[{ required: true, message: '请配置操作按钮' }]}
                        itemRender={({ listDom, action }, { record, index }) => {
                          return (
                            <ProCard
                              bordered
                              extra={
                                <Space>
                                  <ArrowUpOutlined
                                    onClick={() => {
                                      operateListActionRef.current.move(index, index - 1);
                                    }}
                                  />
                                  <ArrowDownOutlined
                                    onClick={() => {
                                      operateListActionRef.current.move(index, index + 1);
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
                        <ProForm.Group>
                          {/* <ProFormSelect
                            name="buttonType"
                            initialValue={'default'}
                            label="按钮类型"
                            width={120}
                            fieldProps={{
                              options: buttonTypeOptions,
                            }}
                            placeholder="请输入按钮类型"
                          /> */}
                          <ProFormText
                            name="buttonName"
                            label="按钮名称"
                            width={180}
                            rules={[{ required: true }]}
                            placeholder="请输入按钮名称"
                          />
                          <ProFormText
                            name="buttonKey"
                            label="按钮Key"
                            width={180}
                            rules={[{ required: true }]}
                            placeholder="请输入按钮Key"
                          />
                        </ProForm.Group>
                      </ProFormList>
                    );
                  }
                }}
              </ProFormDependency>
            </>
          );
        }}
      </ProFormList>
    </ProForm.Group>
  );
};
