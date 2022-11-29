/* eslint-disable */

import { ProTable } from '@ant-design/pro-components';
import { Button, Space, Tooltip, Tabs } from 'antd';
import { useState, useRef, useMemo, useEffect } from 'react';
import styles from './index.less';
import { copyText } from '@/utils/index';
import lodash from 'lodash';
import ItemForm from './ItemForm';
import ToolBarForm from './ToolBarForm';
import CodeView from '@/components/CodeView';
import ConfigForm from './ConfigForm';
import {
  defaultConfig,
  defaultToolBarList,
  defaultItemColumns,
  defaultDataSource,
  defaultFilterItemColumns,
} from './constant';

import { useModel } from 'umi';

// const renderTextEllipsis = (text, textSize) => {
//   if (text?.length >= textSize) {
//     return (
//       <Tooltip title={text}>
//         <span>{text.slice(0, textSize) + '...'}</span>
//       </Tooltip>
//     );
//   } else {
//     return <span>{text}</span>;
//   }
// };

export default ({ history }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rightActiveKey, setRightActiveKey] = useState('1');

  const [filterItemColumns, setFilterItemColumns] = useState(defaultFilterItemColumns);
  const [itemColumns, setItemColumns] = useState(defaultItemColumns);
  const [dataSource, setDataSource] = useState(defaultDataSource);
  const [toolBarList, setToolBarList] = useState(defaultToolBarList);
  const [config, setConfig] = useState(defaultConfig);
  const { initialState, setInitialState } = useModel('@@initialState');
  const wrapRef = useRef(null);
  const configFormRef = useRef();
  const toolBarFormRef = useRef();
  const itemFormRef = useRef();
  const columns = useMemo(
    () => [...filterItemColumns, ...itemColumns],
    [filterItemColumns, itemColumns],
  );

  const init = () => {
    setTimeout(() => {
      if (toolBarFormRef.current?.getFieldValue('toolBarList') === undefined) {
        toolBarFormRef.current?.setFieldsValue({ toolBarList });
      }
      if (toolBarFormRef.current?.getFieldsValue() === undefined) {
        configFormRef.current?.setFieldsValue({ ...config });
      }
      if (toolBarFormRef.current?.getFieldValue('itemList') === undefined) {
        itemFormRef.current?.setFieldsValue({ itemList: itemColumns });
      }
    }, 0);
  };

  useEffect(() => {
    init();
  }, [rightActiveKey]);

  const handleToolBarItemCode = (buttonType: string, buttonName: string, buttonKey: string) => {
    return [
      `          <Button key="${buttonKey}" type="${buttonType}" onClick={handle${lodash.upperFirst(
        buttonKey,
      )}Tool}>`,
      `            ${buttonName}`,
      `          </Button>`,
    ];
  };

  const handleToolBarCode = (list = []) => {
    let toolBarCode = [`      headerTitle={`, `        <Space>`];
    for (const item of list) {
      toolBarCode = toolBarCode.concat(
        handleToolBarItemCode(item?.buttonType, item?.buttonName, item?.buttonKey),
      );
    }
    toolBarCode = [...toolBarCode, `        </Space>`, `      }`];
    return toolBarCode;
  };

  const handleToolBarFuncCode = (list = []) => {
    let toolBarFuncCode = [];
    for (const item of list) {
      toolBarFuncCode.push(`  const handle${lodash.upperFirst(item?.buttonKey)}Tool = () => {};`);
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
        operateItemCode.push(`        <a key="${operateItem.buttonKey}" onClick={() => {}}>`);
        operateItemCode.push(`          ${operateItem.buttonName}`);
        operateItemCode.push(`        </a>,`);
      }
      return [
        `    {`,
        `      title: '${title}',`,
        `      key: 'operate',`,
        `      align: 'center',`,
        `      valueType: 'option',`,
        ...((width && [`      width: ${width},`]) || []),
        `      render: ( _ , record ) => [`,
        ...operateItemCode,
        `      ],`,
        `    },`,
      ];
    } else {
      const fieldPropsCode = [];
      const fieldPropsKeys = Object.keys(fieldProps);
      const fieldPropsType = {
        text: [
          { prop: 'placeholder', type: 'String' },
          { prop: 'maxLength', type: 'Number' },
        ],
        dateRange: [{ prop: 'placeholder', type: 'Arrary' }],
        dateTimeRange: [{ prop: 'placeholder', type: 'Arrary' }],
      };
      for (const fieldPropsKey of fieldPropsKeys) {
        const fieldPropCodeType = fieldPropsType?.[valueType]?.find(
          (item) => item?.prop === fieldPropsKey,
        )?.type;
        let fieldPropCode = '';
        switch (fieldPropCodeType) {
          default:
          case 'String':
            fieldPropCode = `        ${fieldPropsKey}: ${`'${fieldProps[fieldPropsKey]}'`},`;
            break;
          case 'Arrary':
            fieldPropCode = `        ${fieldPropsKey}: ${`['${fieldProps[fieldPropsKey]?.join(
              `', '`,
            )}']`},`;
            break;
          case 'Number':
            fieldPropCode = `        ${fieldPropsKey}: ${`${fieldProps[fieldPropsKey]}`},`;
            break;
        }

        fieldPropsCode.push(fieldPropCode);
      }
      return [
        `    {`,
        `      title: '${title}',`,
        ...((dataIndex && [`      dataIndex: '${dataIndex}',`]) || []),
        ...((valueType && [`      valueType: '${valueType}',`]) || []),
        ...((width && [`      width: ${width},`]) || []),
        ...((hideInTable && [`      hideInTable: true,`]) || []),
        ...((hideInSearch && [`      hideInSearch: true,`]) || []),
        ...((fieldPropsKeys.length > 0 && [`      fieldProps: {`, ...fieldPropsCode, `      },`]) ||
          []),
        ...((hasRender && [`      render: ( _ , record ) => (record?.${dataIndex}),`]) || []),
        `    },`,
      ];
    }
  };

  const handleColumnCode = (list: any = []) => {
    let columnsCode = [`  const columns = [${list.length === 0 ? '];' : ''}`];
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
    if (list.length > 0) columnsCode.push('  ];');
    return columnsCode;
  };

  const handleDefaultData = (tableKeys = []) => {
    if (tableKeys.length > 0) {
      let newDefaultData = [];
      for (let i = 0; i < 15; i++) {
        let data = {};
        data.id = i + 1;
        for (const key of tableKeys) {
          if (key) {
            data[key] = '模拟数据';
          }
        }
        newDefaultData.push(data);
      }
      setDataSource(newDefaultData);
    } else {
      setDataSource([]);
    }
  };

  const handleDefaultDataCode = (list = []) => {
    const tableKeys = Object.keys(list?.[0] || {})?.filter((item) => item !== 'id');
    let defaultDataCode = [
      'const getTableData = () => {',
      `  const tableKeys = ${tableKeys?.length > 0 ? `['${tableKeys.join(`', '`)}'];` : `[]`}`,
      `  let dataSource = [];`,
      `  if (tableKeys.length > 0) {`,
      `    for (let i = 0; i < 15; i++) {`,
      `      let data = {};`,
      `      data.id = i + 1;`,
      `      for (const key of tableKeys) {`,
      `        if (key) {`,
      `          data[key] = '模拟数据';`,
      `        }`,
      `      }`,
      `      dataSource.push(data);`,
      `    }`,
      `  }`,
      `  return Promise.resolve({`,
      `    success: true,`,
      `    data: {`,
      `      records: dataSource,`,
    ];
    defaultDataCode = defaultDataCode.concat([
      `      total: ${tableKeys.length > 0 ? 15 : 0},`,
      '    },',
      '  });',
      '};',
    ]);
    return defaultDataCode;
  };

  const codes = useMemo(() => {
    let defaultDataCode = handleDefaultDataCode(dataSource);
    // ----------
    let columnsCode = handleColumnCode(columns);
    // ----------
    const toolBarCode = toolBarList?.length > 0 ? handleToolBarCode(toolBarList) : [];
    // ----------
    const toolBarFuncCode = toolBarList?.length > 0 ? handleToolBarFuncCode(toolBarList) : [];

    const codeList = [
      `import ProTable from '@ant-design/pro-table';`,
      `import { Button, Space, Tooltip } from 'antd';`,
      `import { useState, useRef, useEffect } from 'react';`,
      ` `,
      ...defaultDataCode,
      ` `,
      `export default ({ history }) => {`,
      ...((config?.isSelect && [`  const [selectedRowKeys, setSelectedRowKeys] = useState([]);`]) ||
        []),
      `  const actionRef = useRef();`,
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
      `        const response = await getTableData(values);`,
      `        if (response?.success) {`,
      `          return {`,
      `            data: response?.data?.records || [],`,
      `            total: response?.data?.total,`,
      `            success: true,`,
      `          };`,
      `        }`,
      `      }}`,
      `      search={{ defaultCollapsed: false, labelWidth: 'auto' }}`,
      `      scroll={{ x: 'max-content' }}`,
      `      options={false}`,
      `      pagination={{ pageSize: 10 }}`,
      `      rowKey="id"`,
      ...toolBarCode,
      `    />`,
      `  );`,
      `};`,
    ];

    return codeList.join(`\r\n`);
  }, [config, dataSource, columns, toolBarList]);

  const handleConfigFormFinish = (values: any) => {
    const { config = {} } = values;
    setConfig(config);
  };

  const handleToolBarFormFinish = (values: any) => {
    const { toolBarList = [] } = values;
    setToolBarList(toolBarList);
  };

  // const handleFilterFormFinish = (values: any) => {
  //   const { filterList = [] } = values;
  //   const newColumns = [];
  //   for (const item of filterList) {
  //     const column = {
  //       title: item?.title || '',
  //       dataIndex: item?.dataIndex || '',
  //       valueType: item?.valueType || 'text',
  //       hideInTable: true,
  //       fieldProps: {
  //         ...(item?.maxLength ? { maxLength: item.maxLength } : {}),
  //         ...(item?.placeholder ? { placeholder: item.placeholder } : {}),
  //       },
  //     };
  //     newColumns.push(column);
  //   }
  //   setFilterColumns(newColumns);
  // };

  const handleItemFormFinish = (values: any) => {
    const { itemList = [] } = values;
    console.log(itemList, 'itemList');
    const itemColumns = [];
    const filterItemColumns = [];
    const operateColumns = [];
    let tableKeys = [];
    for (const item of itemList) {
      let itemColumn = {};
      let operateColumn = {};
      let filterItemColumn = {};
      if (item.isOperate) {
        operateColumn = {
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
        operateColumns.push(operateColumn);
      } else {
        tableKeys.push(item?.dataIndex);
        itemColumn = {
          title: item?.title || '',
          dataIndex: item?.dataIndex || '',
          valueType: item?.valueType || '',
          hideInSearch: true,
          hasRender: item?.hasRender,
          ...(item?.width ? { width: item?.width } : {}),
        };
        itemColumns.push(itemColumn);
        if (item.isFilter) {
          filterItemColumn = {
            title: item?.filterTitle || '',
            dataIndex: item?.dataIndex || '',
            valueType: item?.filterValueType || 'text',
            hideInTable: true,
            fieldProps: {
              ...(item?.maxLength ? { maxLength: item.maxLength } : {}),
              ...(item?.filterValueType === 'text'
                ? { placeholder: `请输入${item?.filterTitle}` }
                : {}),
              ...(item?.filterValueType.includes('Range')
                ? { placeholder: ['开始时间', '结束时间'] }
                : {}),
            },
          };
          filterItemColumns.push(filterItemColumn);
        }
      }
    }
    setFilterItemColumns([...filterItemColumns]);
    setItemColumns([...itemColumns, ...operateColumns]);
    handleDefaultData(tableKeys);
  };
  // 关闭左侧导航栏
  const handleCollapse = () => {
    if (!initialState?.collapsed) {
      setInitialState({ ...initialState, collapsed: true });
    }
  };

  const handleRightTabChange = (key: string) => {
    handleCollapse();
    setRightActiveKey(key);
  };

  return (
    <div className={styles.wrapper} ref={wrapRef} onClick={handleCollapse}>
      <div className={styles.container_left}>
        <Tabs defaultActiveKey="1" onChange={handleCollapse}>
          <Tabs.TabPane tab="表格展示" key="1">
            <div className={styles.table_container}>
              <ProTable
                dataSource={dataSource}
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
              <CodeView codes={codes} />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
      <div className={styles.container_right}>
        <Tabs activeKey={rightActiveKey} onChange={handleRightTabChange}>
          <Tabs.TabPane tab="表格配置" key="1">
            <ConfigForm
              formRef={configFormRef}
              onFinish={handleConfigFormFinish}
              onReset={() => {
                setSelectedRowKeys([]);
                setConfig({});
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="工具栏按钮配置" key="2">
            <ToolBarForm
              formRef={toolBarFormRef}
              onFinish={handleToolBarFormFinish}
              onReset={() => {
                setToolBarList([]);
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="表格项配置" key="4">
            <ItemForm
              formRef={itemFormRef}
              onFinish={handleItemFormFinish}
              onReset={() => {
                setDataSource([]);
                setItemColumns([]);
              }}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};
