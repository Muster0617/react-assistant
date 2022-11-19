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
import { tableValueTypeOptions } from '../constant';
import { Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import FormTitle from './FormTitle';
import FilterField from './FilterField';
import OperateField from './OperateField';

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
        <ProForm.Group title="表格配置">
          <ProFormList
            actionRef={actionRef}
            name="itemList"
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
                  <FormTitle title="基本" />
                  <ProForm.Group>
                    <ProFormDependency name={['isOperate']}>
                      {({ isOperate }) => {
                        if (!isOperate) {
                          return (
                            <ProFormSelect
                              name="valueType"
                              initialValue={'text'}
                              label="表格项类型"
                              width={120}
                              fieldProps={{
                                options: tableValueTypeOptions,
                                onChange: (value) => {
                                  if (value === 'index') {
                                    const itemList = formRef.current?.getFieldValue('itemList');
                                    itemList[index].title = '序号';
                                    itemList[index].isFilter = false;
                                    formRef.current?.setFieldsValue({ itemList });
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
                      label="Title"
                      width={180}
                      rules={[{ required: true }]}
                      placeholder="请输入Title"
                      fieldProps={{
                        onChange: (e) => {
                          const value = e.target.value;
                          let itemList = formRef.current?.getFieldValue('itemList');
                          if (value) {
                            itemList[index].filterTitle = value;
                          }
                          if (!value) {
                            itemList[index].filterTitle = ``;
                          }
                          formRef.current?.setFieldsValue({ itemList });
                        },
                      }}
                    />
                    <ProFormDependency name={['isOperate', 'valueType']}>
                      {({ isOperate, valueType }) => {
                        if (!isOperate && ['text'].includes(valueType)) {
                          return (
                            <ProFormText
                              name="dataIndex"
                              label="DataIndex"
                              width={180}
                              rules={[{ required: true }]}
                              placeholder="请输入DataIndex"
                            />
                          );
                        }
                      }}
                    </ProFormDependency>
                    <ProFormDigit
                      label="Width"
                      name="width"
                      width={180}
                      placeholder="请输入Width"
                    />
                  </ProForm.Group>
                  <ProFormDependency name={['isFilter']}>
                    {({ isFilter }) => {
                      if (isFilter) {
                        return <FilterField formRef={formRef} index={index} />;
                      }
                    }}
                  </ProFormDependency>
                  <ProFormDependency name={['isOperate']}>
                    {({ isOperate }) => {
                      if (isOperate) {
                        return <OperateField />;
                      }
                    }}
                  </ProFormDependency>

                  <FormTitle title="扩展" />
                  <ProForm.Group>
                    <ProFormRadio.Group
                      name="isFilter"
                      initialValue={false}
                      label="是否是筛选项"
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
                        onChange: (e) => {
                          const value = e.target.value;
                          if (value) {
                            const itemList = formRef.current?.getFieldValue('itemList');
                            itemList[index].isOperate = false;
                            formRef.current?.setFieldsValue({ itemList });
                          }
                        },
                      }}
                    />
                    <ProFormRadio.Group
                      name="isOperate"
                      initialValue={false}
                      label="是否是操作项"
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
                        onChange: (e) => {
                          const value = e.target.value;
                          const itemList = formRef.current?.getFieldValue('itemList');
                          console.log(value, 'value');
                          if (value) {
                            itemList[index].title = '操作';
                            itemList[index].isFilter = false;
                          } else {
                            itemList[index].title = '';
                          }
                          formRef.current?.setFieldsValue({ itemList });
                        },
                      }}
                    />
                  </ProForm.Group>
                </>
              );
            }}
          </ProFormList>
        </ProForm.Group>
      </ProForm>
    </>
  );
};
