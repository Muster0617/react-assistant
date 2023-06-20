import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Modal, message } from 'antd';
import { useRef, useState } from 'react';
import { history } from 'umi';
import moment from 'moment';
import ProTable from './ProTable';
// import DrawerForm from './DrawerForm';
// import { queryPageList, deleteByIds } from '@/services/';

const showConfirm = (props: any) => {
  Modal.confirm({
    title: '提示',
    okType: 'danger',
    okText: '确定',
    cancelText: '取消',
    ...props,
  });
};

// 获取初始数据
const getTableData = () => {
  const dataSource: (string | number)[] = [];
  for (let i = 0; i < 15; i++) {
    const data: any = {};
    data.id = i + 1;
    data.state = i % 2 === 0 ? 1 : 2;
    data.name = '模拟数据';
    data.introduce =
      '这是一段很长很长超级超级长的无意义说明文本并且重复了很多没有意义的词语，就是为了让它变得很长很长超级超级长';
    data.createTime = '2015-6-22';
    dataSource.push(data);
  }
  return Promise.resolve({
    success: true,
    data: {
      records: dataSource,
      total: 15,
    },
  });
};

export default () => {
  const actionRef = useRef();
  const reloadTable = () => actionRef.current?.reload();
  const reloadAndRestTable = () => actionRef.current?.reloadAndRest();
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [selectedRows, setSelectedRows] = useState<[]>([]);
  // const [id, setId] = useState<string | number>('');
  // const [formType, setFormType] = useState<string>('add');
  // const [open, setOpen] = useState<boolean>(false);

  const fetch = async (values: any) => {
    const payload = {
      ...values,
      size: values.pageSize,
    };
    console.log(payload, 'payload');
    delete payload.pageSize;
    const { success, data, errorMsg } = await getTableData(payload);
    if (success) {
      return {
        data: data?.records || [],
        total: data?.total,
        success: true,
      };
    } else message.error(errorMsg || '请求列表数据失败');
  };

  const tableConfig = {
    request: fetch,
    actionRef: actionRef,
    scroll: { x: 'max-content' },
    options: false,
    search: { defaultCollapsed: false, labelWidth: 'auto' },
    pagination: { pageSize: 10 },
    rowKey: 'id',
    tableAlertRender: false,
    // 表格多选配置
    rowSelection: {
      onChange: (keys: (string | number)[], rows: []) => {
        setSelectedRowKeys(keys);
        setSelectedRows(rows);
      },
      selectedRowKeys,
    },
    columns: [
      {
        title: '序号',
        valueType: 'index',
        width: 60,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        fieldProps: {
          placeholder: '请输入姓名',
          maxLength: 20,
        },
      },
      {
        title: '介绍',
        dataIndex: 'introduce',
        hideInSearch: true,
        width: 380,
        valueType: 'longText',
      },
      {
        title: '状态',
        dataIndex: 'state',
        valueType: 'select',
        valueEnum: {
          1: '正常',
          2: '异常',
        },
        fieldProps: {
          placeholder: '请选择状态',
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        valueType: 'dateTimeRange',
        fieldProps: {
          placeholder: ['开始时间', '结束时间'],
        },
        render: (_, { createTime }: { createTime: string }) => createTime,
        transform: (values = []) => ({
          startTime: moment(values?.[0]).format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment(values?.[1]).format('YYYY-MM-DD HH:mm:ss'),
        }),
      },
    ],
    // 列表项操作栏按钮配置
    columnOperate: ({ id }: { id: string | number }) => {
      return [
        {
          text: '详情',
          onClick: () => {
            //   setFormType('info');
            //   setId(id);
            //   setOpen(true);
            //   history.push({
            //     pathname: '/form',
            //     query: { id, type: 'info' },
            //   });
          },
        },
        {
          text: '编辑',
          visible: id % 2 == 0,
          color: 'red',
          onClick: () => {
            //   setFormType('edit');
            //   setId(id);
            //   setOpen(true);
            //   history.push({
            //     pathname: '/form',
            //     query: { id, type: 'edit' },
            //   });
          },
        },
      ];
    },
    // 工具栏按钮配置
    toolButton: [
      {
        text: '新建',
        onClick: () => {
          // setFormType('add');
          // setOpen(true);
          // history.push({
          //   pathname: '/form',
          //   query: { type: 'add' },
          // });
        },
        buttonProps: {
          type: 'primary',
        },
      },
      {
        text: '删除',
        selectionButton: true,
        onClick: () => {
          // const operateName = '删除';
          // if (selectedRowKeys.length > 0) {
          //   const handleDelete = async () => {
          //     const res = await deleteByIds({ ids: selectedRowKeys.join(',') });
          //     if (res.success) {
          //       message.success(`${operateName}成功`);
          //       reloadTable();
          //     }
          //   };
          //   showConfirm({ content: `是否要${operateName}所选择的列表项？`, onOk: handleDelete });
          // } else message.warning(`请选择要${operateName}的列表项`);
        },
      },
    ],
  };

  return (
    <PageHeaderWrapper>
      <ProTable tableConfig={tableConfig} />
      {/* <DrawerForm type={formType} id={id} open={open} setOpen={setOpen} /> */}
    </PageHeaderWrapper>
  );
};
