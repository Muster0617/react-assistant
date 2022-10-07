/* eslint-disable */

import { ProTable } from '@ant-design/pro-components';
import { Button, Space, Tooltip, Divider } from 'antd';
import { useState, useRef, useEffect } from 'react';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormList,
  ProFormDependency,
  ProFormRadio,
} from '@ant-design/pro-components';
import styles from './index.less';
import { valueTypeOptions, buttonTypeOptions } from './constant';
import { handleClipboard } from '@/utils/index';

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

const defaultColumns = [
  {
    title: '序号',
    width: 80,
    valueType: 'index',
    hideInSearch: true,
  },
  {
    title: '指标名称',
    dataIndex: 'title',
    hideInSearch: true,
    render: (_, record) => {
      return renderTextEllipsis(record?.title, 30);
    },
  },
  {
    title: '操作',
    width: 200,
    key: 'option',
    valueType: 'option',
    align: 'center',
    hideInSearch: true,
    render: (_, record) => [<a key="delete">删除</a>],
  },
];

export default ({ history }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [columns, setColumns] = useState([]);
  const [defaultData, setDefaultData] = useState([]);
  const [toolBarList, setToolBarList] = useState([]);
  const [config, setConfig] = useState({});

  const formRef = useRef();
  const actionRef = useRef();

  const handleCopes = (codes: string[]) => {
    return codes.join(`\r\n`);
  };

  const handleToolBarItemCode = (buttonType: string, buttonName: string, buttonKey: string) => {
    return [
      `              <Button key="${buttonKey}" type="${buttonType}" onClick={() => {}}>`,
      `                 ${buttonName}`,
      `              </Button>`,
    ];
  };

  const handleToolBarCode = (list = []) => {
    let toolBarCode = [
      `       headerTitle = {${list.length === 0 ? '}' : ''}`,
      ...((list?.length > 0 && [`           <Space>`]) || []),
    ];
    for (const item of list) {
      toolBarCode = toolBarCode.concat(
        handleToolBarItemCode(item?.buttonType, item?.buttonName, item?.buttonKey),
      );
    }
    if (list.length > 0) toolBarCode = [...toolBarCode, `           </Space>`, `       }`];
    return toolBarCode;
  };

  const handleColumnItemCode = (
    title: string,
    dataIndex: string,
    valueType: string,
    hideInTable: boolean,
    hideInSearch: boolean,
    hasRender: boolean,
  ) => {
    return [
      `      {`,
      `         title:'${title}',`,
      `         dataIndex:'${dataIndex}',`,
      ...((valueType && [`         valueType:'${valueType}',`]) || []),
      ...((hideInTable && [`         hideInTable:true,`]) || []),
      ...((hideInSearch && [`         hideInSearch:true,`]) || []),
      ...((hasRender && [`         render:( _ , record ) => (record?.${dataIndex}),`]) || []),
      `      },`,
    ];
  };

  const handleColumnCode = (list = []) => {
    let columnsCode = [`   const columns = [${list.length === 0 ? ']' : ''}`];
    for (const item of list) {
      columnsCode = columnsCode.concat(
        handleColumnItemCode(
          item?.title,
          item?.dataIndex,
          item?.valueType,
          item?.hideInTable,
          item?.hideInSearch,
          item?.hasRender,
        ),
      );
    }
    if (list.length > 0) columnsCode.push('   ]');
    return columnsCode;
  };

  const handleDefaultData = (tableKeys = []) => {
    if (tableKeys.length > 0) {
      let newDefaultData = [];
      let data = {};
      for (let i = 0; i < 3; i++) {
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
    let defaultDataCode = [`const defaultData = [${list.length === 0 ? ']' : ''}`];
    for (const item of list) {
      defaultDataCode.push(`    ${JSON.stringify(item)},`);
    }
    if (list.length > 0) defaultDataCode.push(`]`);
    return defaultDataCode;
  };

  const renderCodes = () => {
    let defaultDataCode = handleDefaultDataCode(defaultData);
    // ----------
    let columnsCode = handleColumnCode(columns);
    // ----------
    const toolBarCode = toolBarList?.length > 0 ? handleToolBarCode(toolBarList) : [];
    // ----------

    const codes = [
      `import { ProTable } from '@ant-design/pro-components'`,
      `import { Button, Space, Tooltip } from 'antd';`,
      `import { useState, useRef, useEffect } from 'react';`,
      ...defaultDataCode,
      `export default ({ history }) => {`,
      ...((config?.isSelect && [
        `   const [selectedRowKeys, setSelectedRowKeys] = useState([]);`,
      ]) ||
        []),
      `   const actionRef = useRef();`,
      ...columnsCode,
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
      `       request={async (value) => {return { data: defaultData }}}`,
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
      <div className={styles.code_container}>
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
      <div className={styles.table_container}>
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
        <div>{renderCodes()}</div>
      </div>
      <div className={styles.form_container}>
        <ProForm
          formRef={formRef}
          autoFocusFirstInput
          onFinish={(values) => {
            const { filtrateList = [], tableList = [], config = {} } = values;
            const newColumns = [];
            for (const item of filtrateList) {
              const column = {
                title: item?.title || '',
                dataIndex: item?.dataIndex || '',
                valueType: item?.valueType || 'text',
                hideInTable: true,
              };
              newColumns.push(column);
            }
            let tableKeys = [];
            for (const item of tableList) {
              tableKeys.push(item?.dataIndex);
              const column = {
                title: item?.title || '',
                dataIndex: item?.dataIndex || '',
                hideInSearch: true,
                hasRender: item?.hasRender,
              };
              newColumns.push(column);
            }
            handleDefaultData(tableKeys);
            setColumns(newColumns);
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
          <ProForm.Group title="工具栏配置">
            <ProFormList name="toolBarList">
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
            <ProFormList name="filtrateList">
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
                  </ProForm.Group>
                );
              }}
            </ProFormList>
          </ProForm.Group>
          <ProForm.Group title="表格项配置">
            <ProFormList name="tableList">
              {() => {
                return (
                  <ProForm.Group>
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
                  </ProForm.Group>
                );
              }}
            </ProFormList>
          </ProForm.Group>
        </ProForm>
      </div>
    </div>
  );
};
