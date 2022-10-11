/* eslint-disable */

import { ProTable } from '@ant-design/pro-components';
import ProCard from '@ant-design/pro-card';
import { Button, Space, Tooltip, Divider } from 'antd';
import { useState, useRef, useEffect } from 'react';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormList,
  ProFormDependency,
  ProFormRadio,
  ProFormDigit,
} from '@ant-design/pro-components';
import styles from './index.less';
import { valueTypeOptions, buttonTypeOptions } from './constant';
import { handleClipboard } from '@/utils/index';
import lodash from 'lodash';
import { useSize } from 'ahooks';

const renderTextEllipsis = (text, textSize) => {
  if (text?.length >= textSize) {
    return (
      <Tooltip title={text}>
        <span>{text.slice(0, textSize) + '...'}</span>
      </Tooltip>
    );
  } else {
    return <span>{text}</span>;
  }
};

export default ({ history }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [columns, setColumns] = useState([]);
  const [defaultData, setDefaultData] = useState([]);
  const [toolBarList, setToolBarList] = useState([]);
  const [config, setConfig] = useState({});
  const tableRef = useRef(null);
  const size = useSize(tableRef);

  const formRef = useRef();
  const actionRef = useRef();

  useEffect(() => {
    console.log(size);
  }, [size]);

  const handleCopes = (codes: string[]) => {
    return codes.join(`\r\n`);
  };

  const handleToolBarItemCode = (buttonType: string, buttonName: string, buttonKey: string) => {
    return [
      `              <Button key="${buttonKey}" type="${buttonType}" onClick={handle${lodash.upperFirst(
        buttonKey,
      )}Tool}>`,
      `                 ${buttonName}`,
      `              </Button>`,
    ];
  };

  const handleToolBarCode = (list = []) => {
    let toolBarCode = [`       headerTitle = {`, `           <Space>`];
    for (const item of list) {
      toolBarCode = toolBarCode.concat(
        handleToolBarItemCode(item?.buttonType, item?.buttonName, item?.buttonKey),
      );
    }
    toolBarCode = [...toolBarCode, `           </Space>`, `       }`];
    return toolBarCode;
  };

  const handleToolBarFuncCode = (list = []) => {
    let toolBarFuncCode = [];
    for (const item of list) {
      toolBarFuncCode.push(`   const handle${lodash.upperFirst(item?.buttonKey)}Tool = () => {}`);
    }
    return toolBarFuncCode;
  };

  const handleColumnItemCode = (
    title: string,
    dataIndex: string,
    valueType: string,
    hideInTable: boolean,
    hideInSearch: boolean,
    hasRender: boolean,
    isOperate: boolean,
    operateList = [],
    width: number,
    fieldProps = {},
  ) => {
    if (isOperate) {
      const operateItemCode = [];
      for (const operateItem of operateList) {
        operateItemCode.push(`            <a key="${operateItem.buttonKey}" onClick={() => {}}>`);
        operateItemCode.push(`               ${operateItem.buttonName}`);
        operateItemCode.push(`            </a>,`);
      }
      return [
        `      {`,
        `         title: '${title}',`,
        `         key: 'operate',`,
        `         align: 'center',`,
        `         valueType: 'option',`,
        ...((width && [`         width: ${width},`]) || []),
        `         render: ( _ , record ) => [`,
        ...operateItemCode,
        `         ],`,
        `      },`,
      ];
    } else {
      const fieldPropsCode = [];
      const fieldPropsKeys = Object.keys(fieldProps);
      for (const fieldPropsKey of fieldPropsKeys) {
        fieldPropsCode.push(`            ${fieldPropsKey}: ${fieldProps[fieldPropsKey]},`);
      }
      return [
        `      {`,
        `         title: '${title}',`,
        `         dataIndex: '${dataIndex}',`,
        ...((valueType && [`         valueType: '${valueType}',`]) || []),
        ...((width && [`         width: ${width},`]) || []),
        ...((hideInTable && [`         hideInTable: true,`]) || []),
        ...((hideInSearch && [`         hideInSearch: true,`]) || []),
        ...((fieldPropsKeys.length > 0 && [
          `         fieldProps: {`,
          ...fieldPropsCode,
          `         },`,
        ]) ||
          []),
        ...((hasRender && [`         render: ( _ , record ) => (record?.${dataIndex}),`]) || []),
        `      },`,
      ];
    }
  };

  const handleColumnCode = (list = []) => {
    let columnsCode = [`   const columns = [${list.length === 0 ? '];' : ''}`];
    for (const item of list) {
      columnsCode = columnsCode.concat(
        handleColumnItemCode(
          item?.title,
          item?.dataIndex,
          item?.valueType,
          item?.hideInTable,
          item?.hideInSearch,
          item?.hasRender,
          item?.isOperate,
          item?.operateList,
          item?.width,
          item?.fieldProps,
        ),
      );
    }
    if (list.length > 0) columnsCode.push('   ];');
    return columnsCode;
  };

  const handleDefaultData = (tableKeys = []) => {
    if (tableKeys.length > 0) {
      let newDefaultData = [];
      for (let i = 0; i < 3; i++) {
        let data = {};
        data.id = i + 1;
        for (const key of tableKeys) {
          data[key] = '模拟数据';
        }
        newDefaultData.push(data);
      }
      console.log(newDefaultData, 'newDefaultData');
      setDefaultData(newDefaultData);
    } else {
      setDefaultData([]);
    }
  };

  const handleDefaultDataCode = (list = []) => {
    let defaultDataCode = [`const defaultData = [${list.length === 0 ? '];' : ''}`];
    for (const item of list) {
      const keys = Object.keys(item);
      defaultDataCode.push(`     {`);
      for (const key of keys) {
        defaultDataCode.push(`      ${key}: "${item[key]}",`);
      }
      defaultDataCode.push(`     },`);
    }
    if (list.length > 0) defaultDataCode.push(`];`);
    return defaultDataCode;
  };

  const renderCodes = () => {
    let defaultDataCode = handleDefaultDataCode(defaultData);
    // ----------
    let columnsCode = handleColumnCode(columns);
    // ----------
    const toolBarCode = toolBarList?.length > 0 ? handleToolBarCode(toolBarList) : [];
    // ----------
    const toolBarFuncCode = toolBarList?.length > 0 ? handleToolBarFuncCode(toolBarList) : [];

    const codes = [
      `import ProTable from '@ant-design/pro-table'`,
      `import { Button, Space, Tooltip } from 'antd';`,
      `import { useState, useRef, useEffect } from 'react';`,
      ` `,
      ...defaultDataCode,
      ` `,
      `export default ({ history }) => {`,
      ...((config?.isSelect && [
        `   const [selectedRowKeys, setSelectedRowKeys] = useState([]);`,
      ]) ||
        []),
      `   const actionRef = useRef();`,
      toolBarFuncCode.length > 0 && ` `,
      ...toolBarFuncCode,
      (columnsCode.length > 1 || toolBarFuncCode.length > 0) && ` `,
      ...columnsCode,
      ` `,
      `   return (`,
      `     <ProTable`,
      `       actionRef={actionRef}`,
      `       columns={columns}`,
      ...((config?.isSelect && [
        `       rowSelection={{`,
        `         onChange: (keys) => setSelectedRowKeys(keys),`,
        `         selectedRowKeys,`,
        `       }}`,
      ]) ||
        []),
      `       tableAlertRender={false}`,
      `       request={async (values) => {return { data: defaultData }}}`,
      `       search={{ defaultCollapsed: false, labelWidth: 'auto' }}`,
      `       scroll={{ x: 'max-content' }}`,
      `       options={false}`,
      `       pagination={{ pageSize: 10 }}`,
      `       rowKey="id"`,
      ...toolBarCode,
      `     />`,
      `   )`,
      `}`,
    ];
    return (
      <div
        className={styles.code_container}
        style={{ height: `calc(89vh - ${size?.height + 20}px)` }}
      >
        <div>
          <Space style={{ display: 'flex', justifyContent: 'end' }}>
            <Button
              className="code-copy"
              type="link"
              onClick={() => handleClipboard('.code-copy', handleCopes(codes))}
            >
              复制
            </Button>
          </Space>
        </div>
        <div>
          <h2>代码：</h2>
          <code>
            <pre>
              {codes.map((code: string, index: number) => (
                <p key={index}>{code}</p>
              ))}
            </pre>
          </code>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.table_container} ref={tableRef}>
          <ProTable
            actionRef={actionRef}
            dataSource={defaultData}
            columns={columns}
            {...(config?.isSelect && {
              rowSelection: {
                onChange: (keys) => setSelectedRowKeys(keys),
                selectedRowKeys,
              },
            })}
            tableAlertRender={false}
            search={{ defaultCollapsed: false, labelWidth: 'auto' }}
            scroll={{ x: 'max-content' }}
            options={false}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            {...(toolBarList?.length > 0 && {
              headerTitle: (
                <Space>
                  {toolBarList.map((item) => (
                    <Button key={item.buttonKey} type={item.buttonType} onClick={() => {}}>
                      {item.buttonName}
                    </Button>
                  ))}
                </Space>
              ),
            })}
          />
        </div>
        <div>{renderCodes()}</div>
      </div>
      <div className={styles.form_container}>
        <ProForm
          formRef={formRef}
          autoFocusFirstInput
          onFinish={(values) => {
            console.log(values);
            const { filtrateList = [], tableList = [], config = {} } = values;
            const newColumns = [];
            const operateColumn = [];
            for (const item of filtrateList) {
              const column = {
                title: item?.title || '',
                dataIndex: item?.dataIndex || '',
                valueType: item?.valueType || 'text',
                hideInTable: true,
                ...(item?.maxLength
                  ? {
                      fieldProps: {
                        maxLength: item.maxLength,
                      },
                    }
                  : {}),
              };
              newColumns.push(column);
            }
            let tableKeys = [];
            for (const item of tableList) {
              let column = {};
              if (item.isOperate) {
                column = {
                  title: item.title,
                  hideInSearch: true,
                  isOperate: true,
                  align: 'center',
                  key: 'operate',
                  valueType: 'option',
                  ...(item?.width ? { width: item?.width } : {}),
                  operateList: item?.operateList || [],
                  render: (_, record) => {
                    return (item?.operateList || []).map((operateItem) => (
                      <a key={operateItem.buttonKey}>{operateItem.buttonName}</a>
                    ));
                  },
                };
                operateColumn.push(column);
              } else {
                tableKeys.push(item?.dataIndex);
                column = {
                  title: item?.title || '',
                  dataIndex: item?.dataIndex || '',
                  hideInSearch: true,
                  hasRender: item?.hasRender,
                  ...(item?.width ? { width: item?.width } : {}),
                };
                newColumns.push(column);
              }
            }
            handleDefaultData(tableKeys);
            setColumns([...newColumns, ...operateColumn]);
            setToolBarList(values?.toolBarList || []);
            setConfig(config);
          }}
          submitter={{
            searchConfig: {
              resetText: '重置',
              submitText: '生成表格',
            },
            onReset: () => {
              console.log('setToolBarList');
              setColumns([]);
              setSelectedRowKeys([]);
              setDefaultData([]);
              setToolBarList([]);
              setConfig({});
            },
          }}
        >
          <ProForm.Group title="表格配置">
            <ProFormRadio.Group
              name="isSelect"
              initialValue={false}
              label="是否可多选"
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
              transform={(value) => ({ config: { isSelect: value } })}
            />
          </ProForm.Group>
          <ProForm.Group title="工具栏按钮配置">
            <ProFormList
              name="toolBarList"
              creatorButtonProps={{
                creatorButtonText: '添加工具栏按钮',
              }}
              itemRender={({ listDom, action }, { record }) => {
                return (
                  <ProCard
                    bordered
                    extra={action}
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
                );
              }}
            </ProFormList>
          </ProForm.Group>
          <ProForm.Group title="筛选项配置">
            <ProFormList
              name="filtrateList"
              creatorButtonProps={{
                creatorButtonText: '添加筛选项',
              }}
              itemRender={({ listDom, action }, { record }) => {
                return (
                  <ProCard
                    bordered
                    extra={action}
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
                      name="valueType"
                      initialValue={'text'}
                      label="valueType"
                      width={120}
                      fieldProps={{
                        options: valueTypeOptions,
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
                );
              }}
            </ProFormList>
          </ProForm.Group>
          <ProForm.Group title="表格项配置">
            <ProFormList
              name="tableList"
              creatorButtonProps={{
                creatorButtonText: '添加表格项',
              }}
              itemRender={({ listDom, action }, { record }) => {
                return (
                  <ProCard
                    bordered
                    extra={action}
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
                      <ProFormText
                        name="title"
                        label="title"
                        width={180}
                        rules={[{ required: true }]}
                        placeholder="请输入title"
                      />
                      <ProFormDependency name={['isOperate']}>
                        {({ isOperate }) => {
                          if (!isOperate) {
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
                      <ProFormDigit
                        label="width"
                        name="width"
                        width={180}
                        placeholder="请输入width"
                      />
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
                              name="operateList"
                              label="操作栏按钮配置"
                              creatorButtonProps={{
                                creatorButtonText: '添加操作按钮',
                              }}
                              rules={[{ required: true, message: '请配置操作按钮' }]}
                              itemRender={({ listDom, action }, { record }) => {
                                return (
                                  <ProCard
                                    bordered
                                    extra={action}
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
        </ProForm>
      </div>
    </div>
  );
};
