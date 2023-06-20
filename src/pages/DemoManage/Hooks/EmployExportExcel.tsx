import { Button, Table, Space } from 'antd';
import useExportExcel from '@/hooks/useExportExcel';

export default () => {
  const dataSource = [
    {
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ];
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
    },
  ];
  return (
    <>
      <Button
        type="primary"
        onClick={useExportExcel({
          dataSource: dataSource,
          columns: columns,
        })}
        style={{
          marginBottom: 24,
        }}
      >
        导出Excel
      </Button>
      <Table columns={columns} dataSource={dataSource} />
    </>
  );
};
