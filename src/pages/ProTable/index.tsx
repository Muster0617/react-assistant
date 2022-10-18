/* eslint-disable */

import { ProTable } from '@ant-design/pro-components';
import ProCard from '@ant-design/pro-card';
import { Button, Space, Tooltip, Divider } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { ProForm } from '@ant-design/pro-components';
import styles from './index.less';
import { handleClipboard } from '@/utils/index';
import lodash from 'lodash';
import { useSize } from 'ahooks';
import TableListField from './TableListField';
import FilterField from './FilterField';
import ToolBarList from './ToolBarList';
import ConfigField from './ConfigField';

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
        `      {`,
        `         title: '${title}',`,
        ...((dataIndex && [`         dataIndex: ${dataIndex},`]) || []),
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
      for (let i = 0; i < 2; i++) {
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
      `       form={{ syncToUrl: true }}`,
      `       columns={columns}`,
      ...((config?.isSelect && [
        `       rowSelection={{`,
        `         onChange: (keys) => setSelectedRowKeys(keys),`,
        `         selectedRowKeys,`,
        `       }}`,
      ]) ||
        []),
      `       tableAlertRender={false}`,
      `       request={async (values) => {`,
      `         return { data: defaultData }`,
      `       }}`,
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

  const handleFormFinish = (values) => {
    console.log(values);
    const { filterList = [], tableList = [], config = {} } = values;
    const newColumns = [];
    const operateColumn = [];
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
          valueType: item?.valueType || '',
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
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container_top} ref={tableRef}>
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
      <div
        className={styles.container_bottom}
        style={{ height: `calc(89vh - ${size?.height + 20}px)` }}
      >
        <div
          className={styles.form_container}
          style={{ height: `calc(89vh - ${size?.height + 20}px)` }}
        >
          <ProForm
            formRef={formRef}
            autoFocusFirstInput
            onFinish={handleFormFinish}
            submitter={{
              searchConfig: {
                resetText: '重置',
                submitText: '生成表格',
              },
              onReset: () => {
                setColumns([]);
                setSelectedRowKeys([]);
                setDefaultData([]);
                setToolBarList([]);
                setConfig({});
              },
            }}
          >
            <ConfigField />
            <ToolBarList />
            <FilterField />
            <TableListField />
          </ProForm>
        </div>
        {renderCodes()}
      </div>
    </div>
  );
};
