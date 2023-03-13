import { ProTable } from '@ant-design/pro-components';
import { Button, Space, Tooltip, message } from 'antd';
import { useMemo } from 'react';
// import CheckAuth from '@/components/Authorized/CheckAuth';

const handleTextEllipsis = (text: string = '', width: number = 240, row: number = 1) => {
  const textSize = Math.floor(width / 14) * row - 3;
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
  const { rowSelection, columnOperate, toolButton = [] } = tableConfig;

  const columns = useMemo(() => {
    return tableConfig?.columns?.reduce((pre, cur, index) => {
      if (cur.valueType === 'longText') {
        cur.render = (_, record) => {
          return handleTextEllipsis(record?.[cur?.dataIndex], cur?.width, cur?.row);
        };
      }
      if (index === tableConfig?.columns?.length - 1 && columnOperate instanceof Function) {
        const operateListLength = columnOperate({})?.length || 0;
        if (operateListLength > 0) {
          return [
            ...pre,
            cur,
            {
              title: '操作',
              key: 'operate',
              align: 'center',
              valueType: 'option',
              fixed: 'right',
              width: operateListLength * 70 >= 160 ? operateListLength * 70 : 160,
              render: (_, record) => {
                const operateList = columnOperate(record);
                return operateList?.map((item, index) => {
                  const { show = true, text, color, onClick = () => {} } = item;
                  const node = show && (
                    <a key={index} onClick={() => onClick()} style={{ color: color }}>
                      {text}
                    </a>
                  );
                  return node;
                  // const auth = item.auth || '';
                  // return auth ? (
                  //   <CheckAuth auth={auth}>{node}</CheckAuth>
                  // ) : (
                  //   node
                  // );
                });
              },
            },
          ];
        }
      }
      return [...pre, cur];
    }, []);
  }, [tableConfig]);

  const renderHeaderTool = useMemo(() => {
    return (
      <Space>
        {toolButton?.map((item, index) => {
          const { text, buttonProps, selectionButton, onClick = () => {} } = item;
          const node = (
            <Button
              key={index}
              {...buttonProps}
              onClick={onClick}
              {...(selectionButton
                ? {
                    type: rowSelection.selectedRowKeys.length > 0 ? 'primary' : 'default',
                  }
                : {})}
            >
              {text}
            </Button>
          );
          return node;
          // const auth = item.auth || '';
          // return auth ? <CheckAuth auth={auth}>{node}</CheckAuth> : node;
        })}
      </Space>
    );
  }, [tableConfig]);

  return <ProTable {...tableConfig} columns={columns} headerTitle={renderHeaderTool} />;
};
