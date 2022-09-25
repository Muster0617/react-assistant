/* eslint-disable */

import { ProTable } from '@ant-design/pro-components';
import { Button, Space, Tooltip } from 'antd';
import { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const tableListDataSource = [];

for (let i = 0; i < 20; i += 1) {
  tableListDataSource.push({
    key: i,
    title:
      '国家基本公共服务国家基本公共服务国家基本公共服务国家基本公共服务国家基本公共服务国家基本公共服务',
    office: '国家发展改革委',
    wordSize: '发改社会',
    keyword: '政策通知',
    time: '2022-09-21',
  });
}

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

  const handleExcerpt = () => {
    console.log(selectedRowKeys, 'selectedRowKeys');
  };
  const handleDelete = () => {
    console.log(selectedRowKeys, 'handleDelete');
  };
  const onSelectChange = (newSelectedRowKeys, selectedRow) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const columns = [
    {
      title: '指标名称',
      dataIndex: 'title',
      hideInTable: true,
      fieldProps: {
        maxLength: 20,
      },
    },
    {
      title: '数据来源',
      dataIndex: 'office',
      valueType: 'select',
      hideInTable: true,
      initialValue: null,
      fieldProps: {
        options: [
          {
            label: '全部',
            value: null,
          },
          {
            label: '人工',
            value: 0,
          },
          {
            label: 'API',
            value: 1,
          },
        ],
      },
    },
    {
      title: '序号',
      width: 80,
      dataIndex: 'orderNum',
      render: (_, record, index) => <span>{index + 1}</span>,
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
      title: '指标定义',
      dataIndex: 'office',
      hideInSearch: true,
    },
    {
      title: '数据来源',
      dataIndex: 'wordSize',
      hideInSearch: true,
    },
    {
      title: '指标状态',
      dataIndex: 'keyword',
      hideInSearch: true,
    },
    {
      title: '发布时间',
      dataIndex: 'time',
      hideInSearch: true,
    },
    {
      title: '操作',
      width: 200,
      key: 'option',
      valueType: 'option',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            history.push({
              pathname: '/targetManagement/targetForm',
              query: {
                id: record?.key,
              },
            });
          }}
        >
          修改
        </a>,
        <a
          key="data"
          onClick={() => {
            history.push({
              pathname: '/targetManagement/dataAllocation',
              query: {
                id: record?.key,
              },
            });
          }}
        >
          数据
        </a>,
        <a key="delete">删除</a>,
      ],
    },
  ];
  return (
    <>
      <ProTable
        columns={columns}
        rowSelection={{
          onChange: onSelectChange,
          selectedRowKeys,
        }}
        tableAlertRender={false}
        request={async (value) => {
          console.log(value, 'value');
          return {
            data: tableListDataSource,
            success: true,
          };
        }}
        search={{
          defaultCollapsed: false,
          labelWidth: 120,
        }}
        scroll={{ x: 'max-content' }}
        options={false}
        pagination={{
          pageSize: 10,
        }}
        rowKey="key"
        headerTitle={
          <Space>
            <Button
              key="add"
              type="primary"
              onClick={() => {
                history.push('/targetManagement/targetForm');
              }}
            >
              + 新建
            </Button>
            <Button key="putaway" onClick={handleExcerpt}>
              批量上架
            </Button>
            <Button key="soldout" onClick={handleExcerpt}>
              批量下架
            </Button>
            <Button key="delete" onClick={handleDelete}>
              批量删除
            </Button>
          </Space>
        }
      />
    </>
  );
};
