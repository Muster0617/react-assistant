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
import { valueTypeOptions } from './constant';
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
  const [config, setConfig] = useState({});

  const formRef = useRef();
  const actionRef = useRef();

  const handleCope = (codes: string[]) => {
    return codes.join(`\r\n`);
  };

  const renderCodes = () => {
    const columnsCode = [`   const columns = [${columns.length === 0 ? ']' : ''}`];
    for (const column of columns) {
      columnsCode.push(`        ${JSON.stringify(column)},`);
    }
    columns.length > 0 && columnsCode.push('   ]');
    const codes = [
      `import { ProTable } from '@ant-design/pro-components'`,
      `import { Button, Space, Tooltip } from 'antd';`,
      `import { useState, useRef, useEffect } from 'react';`,
      `export default ({ history }) => {`,
      ...((config?.isSelect && [
        `   const [selectedRowKeys, setSelectedRowKeys] = useState([]);`,
        `   const [columns, setColumns] = useState([]);`,
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
        `       }},`,
      ]) ||
        []),
      `       tableAlertRender={false}`,
      `       request={async (value) => {return { data: [] }}}`,
      `       search={{ defaultCollapsed: false, labelWidth: 'auto' }}`,
      `       scroll={{ x: 'max-content' }}`,
      `       options={false}`,
      `       pagination={{ pageSize: 10 }}`,
      `       rowKey="key"`,
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
              onClick={() => handleClipboard('.code-copy', handleCope(codes))}
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
          columns={columns}
          {...(config?.isSelect && {
            rowSelection: {
              onChange: (keys) => setSelectedRowKeys(keys),
              selectedRowKeys,
            },
          })}
          tableAlertRender={false}
          request={async (value) => {
            return { data: [] };
          }}
          search={{ defaultCollapsed: false, labelWidth: 'auto' }}
          scroll={{ x: 'max-content' }}
          options={false}
          pagination={{ pageSize: 10 }}
          rowKey="key"
          headerTitle={
            <Space>
              <Button key="add" type="primary" onClick={() => {}}>
                + 新建
              </Button>
              <Button key="putaway" onClick={() => {}}>
                批量上架
              </Button>
              <Button key="soldout" onClick={() => {}}>
                批量下架
              </Button>
              <Button key="delete" onClick={() => {}}>
                批量删除
              </Button>
            </Space>
          }
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
            for (const item of tableList) {
              const column = {
                title: item?.title || '',
                dataIndex: item?.dataIndex || '',
                hideInSearch: true,
                hasRender: item?.hasRender,
              };
              newColumns.push(column);
            }
            console.log(values, 'values');
            setColumns(newColumns);
            setConfig(config);
          }}
          submitter={{
            searchConfig: {
              resetText: '重置',
              submitText: '生成表格',
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
          <ProForm.Group title="筛选项配置">
            <ProFormList name="filtrateList">
              {() => {
                return (
                  <>
                    <ProFormSelect
                      name="valueType"
                      initialValue={'text'}
                      label="valueType"
                      width="sm"
                      fieldProps={{
                        options: valueTypeOptions,
                      }}
                    />
                    <ProForm.Group>
                      <ProFormText
                        name="title"
                        label="title"
                        width={180}
                        rules={[{ required: true }]}
                      />
                      <ProFormText
                        name="dataIndex"
                        label="dataIndex"
                        width={180}
                        rules={[{ required: true }]}
                      />
                    </ProForm.Group>
                  </>
                );
              }}
            </ProFormList>
          </ProForm.Group>
          <ProForm.Group title="表格项配置">
            <ProFormList name="tableList">
              {() => {
                return (
                  <>
                    <ProForm.Group>
                      <ProFormText
                        name="title"
                        label="title"
                        width={180}
                        rules={[{ required: true }]}
                      />
                      <ProFormText
                        name="dataIndex"
                        label="dataIndex"
                        width={180}
                        rules={[{ required: true }]}
                      />
                    </ProForm.Group>
                    <ProForm.Group>
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
