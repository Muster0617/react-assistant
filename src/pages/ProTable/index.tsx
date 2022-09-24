import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Menu, Space, Tag } from 'antd';
import { useRef } from 'react';
import styles from './index.less';

export default () => {
  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'created_at',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
          查看
        </a>,
      ],
    },
  ];
  const actionRef = useRef();
  return (
    <div className={styles.wrapper}>
      <div>
        <ProTable
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={async (values) => {
            console.log(values);
          }}
          editable={{
            type: 'multiple',
          }}
          rowKey="id"
          search={{
            labelWidth: 'auto',
          }}
          pagination={{
            pageSize: 10,
          }}
          dateFormatter="string"
          headerTitle="高级表格"
          toolBarRender={() => [
            <Button key="button" type="primary">
              新建
            </Button>,
          ]}
        />
      </div>
    </div>
  );
};
