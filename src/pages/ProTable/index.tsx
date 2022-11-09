/* eslint-disable */

import { ProTable } from '@ant-design/pro-components';
import { Button, Space, Tooltip, Tabs } from 'antd';
import { useState, useRef, useMemo } from 'react';
import { ProForm } from '@ant-design/pro-components';
import styles from './index.less';
import { handleClipboard } from '@/utils/index';
import lodash from 'lodash';
import ItemField from './ItemField';
import FilterField from './FilterField';
import ToolBarList from './ToolBarList';
import ConfigField from './ConfigField';
import { useModel } from 'umi';

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
  const [filterColumns, setFilterColumns] = useState([]);
  const [itemColumns, setItemColumns] = useState([]);
  const [defaultData, setDefaultData] = useState([]);
  const [toolBarList, setToolBarList] = useState([]);
  const [config, setConfig] = useState({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const wrapRef = useRef(null);
  const configFormRef = useRef();
  const toolBarFormRef = useRef();
  const filterFormRef = useRef();
  const itemFormRef = useRef();
  const columns = useMemo(() => [...filterColumns, ...itemColumns], [filterColumns, itemColumns]);

  const handleCopes = (codes: string[]) => {
    return codes.join(`\r\n`);
  };

  const handleToolBarItemCode = (buttonType: string, buttonName: string, buttonKey: string) => {
    return [
      `             <Button key="${buttonKey}" type="${buttonType}" onClick={handle${lodash.upperFirst(
        buttonKey,
      )}Tool}>`,
      `                ${buttonName}`,
      `             </Button>`,
    ];
  };

  const handleToolBarCode = (list = []) => {
    let toolBarCode = [`      headerTitle = {`, `           <Space>`];
    for (const item of list) {
      toolBarCode = toolBarCode.concat(
        handleToolBarItemCode(item?.buttonType, item?.buttonName, item?.buttonKey),
      );
    }
    toolBarCode = [...toolBarCode, `          </Space>`, `       }`];
    return toolBarCode;
  };

  const handleToolBarFuncCode = (list = []) => {
    let toolBarFuncCode = [];
    for (const item of list) {
      toolBarFuncCode.push(`  const handle${lodash.upperFirst(item?.buttonKey)}Tool = () => {}`);
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
        operateItemCode.push(`           <a key="${operateItem.buttonKey}" onClick={() => {}}>`);
        operateItemCode.push(`              ${operateItem.buttonName}`);
        operateItemCode.push(`           </a>,`);
      }
      return [
        `     {`,
        `        title: '${title}',`,
        `        key: 'operate',`,
        `        align: 'center',`,
        `        valueType: 'option',`,
        ...((width && [`        width: ${width},`]) || []),
        `        render: ( _ , record ) => [`,
        ...operateItemCode,
        `        ],`,
        `     },`,
      ];
    } else {
      const fieldPropsCode = [];
      const fieldPropsKeys = Object.keys(fieldProps);
      const isStringType = ['placeholder'];
      for (const fieldPropsKey of fieldPropsKeys) {
        fieldPropsCode.push(
          `            ${fieldPropsKey}: ${
            isStringType.includes(fieldPropsKey)
              ? `'${fieldProps[fieldPropsKey]}'`
              : fieldProps[fieldPropsKey]
          },`,
        );
      }
      return [
        `     {`,
        `        title: '${title}',`,
        ...((dataIndex && [`        dataIndex: '${dataIndex}',`]) || []),
        ...((valueType && [`        valueType: '${valueType}',`]) || []),
        ...((width && [`        width: ${width},`]) || []),
        ...((hideInTable && [`        hideInTable: true,`]) || []),
        ...((hideInSearch && [`        hideInSearch: true,`]) || []),
        ...((fieldPropsKeys.length > 0 && [
          `        fieldProps: {`,
          ...fieldPropsCode,
          `        },`,
        ]) ||
          []),
        ...((hasRender && [`        render: ( _ , record ) => (record?.${dataIndex}),`]) || []),
        `     },`,
      ];
    }
  };

  const handleColumnCode = (list: any = []) => {
    let columnsCode = [`  const columns = [${list.length === 0 ? ']' : ''}`];
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
    if (list.length > 0) columnsCode.push('  ]');
    return columnsCode;
  };

  const handleDefaultData = (tableKeys = []) => {
    if (tableKeys.length > 0) {
      let newDefaultData = [];
      for (let i = 0; i < 5; i++) {
        let data = {};
        data.id = i + 1;
        for (const key of tableKeys) {
          if (key) {
            data[key] = '模拟数据';
          }
        }
        newDefaultData.push(data);
      }
      setDefaultData(newDefaultData);
    } else {
      setDefaultData([]);
    }
  };

  const handleDefaultDataCode = (list = []) => {
    let defaultDataCode = [
      'const getTableData = () => {',
      `  return Promise.resolve({`,
      `    success: true,`,
      `    data: {`,
      `      records: [${list?.length > 0 ? '' : '],'}`,
    ];
    for (const item of list) {
      const keys = Object.keys(item);
      defaultDataCode.push(`          {`);
      for (const key of keys) {
        defaultDataCode.push(`            ${key}: "${item[key]}",`);
      }
      defaultDataCode.push(`          },`);
    }
    if (list.length > 0) {
      defaultDataCode.push(`      ],`);
    }
    defaultDataCode = defaultDataCode.concat([`      total: ${list.length}`, '    }', '  })', '}']);
    return defaultDataCode;
  };

  const codes = useMemo(() => {
    let defaultDataCode = handleDefaultDataCode(defaultData);
    // ----------
    let columnsCode = handleColumnCode(columns);
    // ----------
    const toolBarCode = toolBarList?.length > 0 ? handleToolBarCode(toolBarList) : [];
    // ----------
    const toolBarFuncCode = toolBarList?.length > 0 ? handleToolBarFuncCode(toolBarList) : [];

    return [
      `import ProTable from '@ant-design/pro-table'`,
      `import { Button, Space, Tooltip } from 'antd'`,
      `import { useState, useRef, useEffect } from 'react'`,
      ` `,
      ...defaultDataCode,
      ` `,
      `export default ({ history }) => {`,
      ...((config?.isSelect && [`  const [selectedRowKeys, setSelectedRowKeys] = useState([])`]) ||
        []),
      `  const actionRef = useRef()`,
      ...(toolBarFuncCode.length > 0 ? [` `] : []),
      ...toolBarFuncCode,
      ...(columnsCode.length > 1 || toolBarFuncCode.length > 0 ? [` `] : []),
      ...columnsCode,
      ` `,
      `  return (`,
      `    <ProTable`,
      `      actionRef={actionRef}`,
      `      columns={columns}`,
      ...((config?.isSelect && [
        `      rowSelection={{`,
        `        onChange: (keys) => setSelectedRowKeys(keys),`,
        `        selectedRowKeys,`,
        `      }}`,
      ]) ||
        []),
      `      tableAlertRender={false}`,
      `      request={async (values) => {`,
      `        const response = await getTableData(values)`,
      `        if (response?.success) {`,
      `          return {`,
      `            data: response?.data?.records || [],`,
      `            total: response?.data?.total,`,
      `            success: true`,
      `          }`,
      `        }`,
      `      }}`,
      `      search={{ defaultCollapsed: false, labelWidth: 'auto' }}`,
      `      scroll={{ x: 'max-content' }}`,
      `      options={false}`,
      `      pagination={{ pageSize: 10 }}`,
      `      rowKey="id"`,
      ...toolBarCode,
      `    />`,
      `  )`,
      `}`,
    ];
  }, [config, defaultData, columns, toolBarList]);

  const handleConfigFormFinish = (values: any) => {
    const { config = {} } = values;
    setConfig(config);
  };

  const handleToolBarFormFinish = (values: any) => {
    const { toolBarList = [] } = values;
    setToolBarList(toolBarList);
  };

  const handleFilterFormFinish = (values: any) => {
    const { filterList = [] } = values;
    const newColumns = [];
    for (const item of filterList) {
      const column = {
        title: item?.title || '',
        dataIndex: item?.dataIndex || '',
        valueType: item?.valueType || 'text',
        hideInTable: true,
        fieldProps: {
          ...(item?.maxLength ? { maxLength: item.maxLength } : {}),
          ...(item?.placeholder ? { placeholder: item.placeholder } : {}),
        },
      };
      newColumns.push(column);
    }
    setFilterColumns(newColumns);
  };

  const handleItemFormFinish = (values: any) => {
    const { itemList = [] } = values;
    const newColumns = [];
    const operateColumn = [];
    let tableKeys = [];
    for (const item of itemList) {
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
          valueType: item?.valueType || '',
          hideInSearch: true,
          hasRender: item?.hasRender,
          ...(item?.width ? { width: item?.width } : {}),
        };
        newColumns.push(column);
      }
    }
    setItemColumns([...newColumns, ...operateColumn]);
    handleDefaultData(tableKeys);
  };
  // 关闭左侧导航栏
  const handleCollapse = () => {
    if (!initialState?.collapsed) {
      setInitialState({ ...initialState, collapsed: true });
    }
  };

  return (
    <div className={styles.wrapper} ref={wrapRef} onClick={handleCollapse}>
      <div className={styles.container_left}>
        <Tabs defaultActiveKey="1" onChange={handleCollapse}>
          <Tabs.TabPane tab="表格展示" key="1">
            <div className={styles.table_container}>
              <ProTable
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
          </Tabs.TabPane>
          <Tabs.TabPane tab="代码预览" key="2">
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
              <div className={styles.code_content}>
                <code>
                  <pre className={styles.code_body}>
                    {codes.map((code: string, index: number) => (
                      <p key={index}>{code}</p>
                    ))}
                  </pre>
                </code>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
      <div className={styles.container_right}>
        <Tabs defaultActiveKey="1" onChange={handleCollapse}>
          <Tabs.TabPane tab="表格配置" key="1">
            <ProForm
              formRef={configFormRef}
              autoFocusFirstInput
              onFinish={handleConfigFormFinish}
              submitter={{
                searchConfig: {
                  resetText: '重置',
                  submitText: '生成表格',
                },
                onReset: () => {
                  setSelectedRowKeys([]);
                  setConfig({});
                },
              }}
            >
              <ConfigField />
            </ProForm>
          </Tabs.TabPane>
          <Tabs.TabPane tab="工具栏按钮配置" key="2">
            <ProForm
              formRef={toolBarFormRef}
              autoFocusFirstInput
              onFinish={handleToolBarFormFinish}
              submitter={{
                searchConfig: {
                  resetText: '重置',
                  submitText: '生成表格',
                },
                onReset: () => {
                  setToolBarList([]);
                },
              }}
            >
              <ToolBarList />
            </ProForm>
          </Tabs.TabPane>
          <Tabs.TabPane tab="筛选项配置" key="3">
            <ProForm
              formRef={filterFormRef}
              autoFocusFirstInput
              onFinish={handleFilterFormFinish}
              submitter={{
                searchConfig: {
                  resetText: '重置',
                  submitText: '生成表格',
                },
                onReset: () => {
                  setFilterColumns([]);
                },
              }}
            >
              <FilterField />
            </ProForm>
          </Tabs.TabPane>
          <Tabs.TabPane tab="表格项配置" key="4">
            <ProForm
              formRef={itemFormRef}
              autoFocusFirstInput
              onFinish={handleItemFormFinish}
              submitter={{
                searchConfig: {
                  resetText: '重置',
                  submitText: '生成表格',
                },
                onReset: () => {
                  setDefaultData([]);
                  setItemColumns([]);
                },
              }}
            >
              <ItemField formRef={itemFormRef} />
            </ProForm>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};
