import { ProTable } from '@ant-design/pro-components';
import { Button, Space, Tooltip, message } from 'antd';
import { useMemo, useState } from 'react';

/**
 * 超过最大字数显示省略号处理，并添加鼠标移入显示全部内容效果
 *
 * @param {string} text - 文字内容
 * @param {width} value - 表格项宽度
 * @returns {string | component} Tooltip组件或者文字内容
 */
const handleTextEllipsis = (text: String = '', width: Number = 240) => {
  const textSize = Math.floor(width / 14) - 3;
  if (text?.length > textSize) {
    return (
      <Tooltip
        title={<div style={{ maxHeight: '330px', overflowY: 'auto' }}>{text}</div>}
        overlayStyle={{
          maxWidth: '550px',
        }}
      >
        <span>{`${text?.slice(0, textSize)}...`}</span>
      </Tooltip>
    );
  }
  return <span>{text || '-'}</span>;
};

export default ({ tableConfig }) => {
  const { requestConfig, rowSelection } = tableConfig;

  const columns = useMemo(() => {
    const list = [];
    for (const item of tableConfig.columns) {
      if (item.valueType === 'longText') {
        item.render = (_, record) => {
          return handleTextEllipsis(record?.[item?.dataIndex], item?.width);
        };
      }
      list.push(item);
    }
    return [
      ...list,
      {
        title: '操作',
        key: 'operate',
        align: 'center',
        valueType: 'option',
        render: (_, record) =>
          tableConfig.columnOperate.map((item, index) => (
            <a key={index} onClick={() => item?.onClick(record)}>
              {item.text}
            </a>
          )),
      },
    ];
  }, [tableConfig]);

  const renderHeaderTool = useMemo(() => {
    return (
      <Space>
        {tableConfig.toolButton.map((item, index) => {
          return (
            <Button
              key={index}
              type={item.buttonType}
              onClick={item.onClick}
              {...(item.selectionButton
                ? {
                    type: rowSelection.selectedRowKeys.length > 0 ? 'primary' : 'default',
                  }
                : {})}
            >
              {item.text}
            </Button>
          );
        })}
      </Space>
    );
  }, [rowSelection]);

  const requestList = async (values) => {
    const { api, handlePayload, fieldNames } = requestConfig;
    const response = await api(handlePayload ? handlePayload(values) : values);
    if (response?.success) {
      return {
        data: response?.data?.[fieldNames.data] || [],
        total: response?.data?.[fieldNames.total || 'total'],
        success: true,
      };
    }
  };

  return (
    <ProTable
      tableAlertRender={false}
      search={{ defaultCollapsed: false, labelWidth: 'auto' }}
      scroll={{ x: 'max-content' }}
      options={false}
      pagination={{ pageSize: 10 }}
      rowKey="id"
      {...tableConfig}
      columns={columns}
      headerTitle={renderHeaderTool}
      request={requestList}
    />
  );
};
