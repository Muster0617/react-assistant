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
import { useRef, useState } from 'react';
// import { EditableProTable } from '@ant-design/pro-components';
import FormTitle from '@/components/FormTitle';
import FilterField from './FilterField';
import OperateField from './OperateField';
import styles from './index.less';
import { useSize } from 'ahooks';

export default (props) => {
  const { onFinish, onReset, formRef } = props;
  // const [editableKeys, setEditableRowKeys] = useState([]);
  const actionRef = useRef();
  const wrapRef = useRef(null);
  const size = useSize(wrapRef);

  // const enumColumns = [
  //   {
  //     title: 'Type',
  //     dataIndex: 'type',
  //     valueType: 'select',
  //     initialValue: 'String',
  //     fieldProps: {
  //       options: [
  //         {
  //           label: 'String',
  //           value: 'String',
  //         },
  //         {
  //           label: 'Number',
  //           value: 'Number',
  //         },
  //         {
  //           label: 'Boolean',
  //           value: 'Boolean',
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     title: 'Label',
  //     dataIndex: 'label',
  //   },
  //   {
  //     title: 'Value',
  //     dataIndex: 'value',
  //   },
  //   {
  //     title: '操作',
  //     valueType: 'option',
  //   },
  // ];

  return (
    <div className={styles.form_wrapper} ref={wrapRef}>
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
        <ProForm.Group title="表格项配置">
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
                <ProFormDependency name={['title']}>
                  {({ title }) => {
                    return (
                      <ProCard
                        title={
                          <span>
                            {`${index + 1} - `}
                            {title || <span style={{ color: 'red' }}>当前配置项</span>}
                          </span>
                        }
                        headerBordered
                        defaultCollapsed
                        collapsible
                        style={{ minWidth: size?.width - 48 }}
                      >
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
                                          const itemList =
                                            formRef.current?.getFieldValue('itemList');
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
                        {/* <ProForm.Group>
                          <ProFormDependency name={['valueType']}>
                            {({ valueType }) => {
                              if (valueType === 'select') {
                                return (
                                  <ProForm.Item
                                    label="枚举配置"
                                    name="enumList"
                                    trigger="onValuesChange"
                                  >
                                    <EditableProTable
                                      rowKey="id"
                                      toolBarRender={false}
                                      columns={enumColumns}
                                      recordCreatorProps={{
                                        newRecordType: 'dataSource',
                                        record: () => ({
                                          id: Date.now(),
                                        }),
                                      }}
                                      editable={{
                                        type: 'multiple',
                                        editableKeys,
                                        onChange: setEditableRowKeys,
                                        actionRender: (row, _, dom) => {
                                          return [dom.delete];
                                        },
                                      }}
                                    />
                                  </ProForm.Item>
                                );
                              }
                            }}
                          </ProFormDependency>
                        </ProForm.Group> */}
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
                                if (value) {
                                  itemList[index].title = '操作';
                                  itemList[index].isFilter = false;
                                } else {
                                  itemList[index].title = '';
                                  itemList[index].valueType = 'text';
                                }
                                formRef.current?.setFieldsValue({ itemList });
                              },
                            }}
                          />
                        </ProForm.Group>
                      </ProCard>
                    );
                  }}
                </ProFormDependency>
              );
            }}
          </ProFormList>
        </ProForm.Group>
      </ProForm>
    </div>
  );
};
