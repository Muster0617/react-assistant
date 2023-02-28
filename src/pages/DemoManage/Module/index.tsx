import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Modal, message } from 'antd';
import { useRef, useState } from 'react';
import { history } from 'umi';
import ProTable from './ProTable.tsx';
// import DrawerForm from './DrawerForm.tsx';
// import { queryPageList, deleteByIds } from '@/services/';

const showConfirm = (content: String, onOk: Function, okType: String = 'danger') => {
  Modal.confirm({
    title: '提示',
    okType,
    content,
    okText: '确定',
    cancelText: '取消',
    onOk: () => onOk(),
  });
};

// 获取初始数据
const getTableData = () => {
  let dataSource = [];
  for (let i = 0; i < 15; i++) {
    let data = {};
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

const constant = {
  stateEnum: {
    1: '正常',
    2: '异常',
  },
};

const columns = [
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
    width: 400,
    valueType: 'longText',
  },
  {
    title: '状态',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum: constant.stateEnum,
    fieldProps: {
      placeholder: '请选择状态',
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateRange',
    fieldProps: {
      placeholder: ['开始时间', '结束时间'],
    },
    render: (_, { createTime }: { createTime: String }) => createTime,
  },
];

const handlePayload = (values) => {
  const { rangeTime = [] } = values;
  const payload = {
    ...values,
    size: values.pageSize,
    startTime: rangeTime?.[0],
    endTime: rangeTime?.[1],
  };
  delete payload.pageSize;
  return payload;
};

export default (props) => {
  const actionRef = useRef();
  const reloadTable = () => actionRef.current?.reload();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  // const [id, setId] = useState('');
  // const [formType, setFormType] = useState('add');
  // const [open, setOpen] = useState(false);

  const tableConfig = {
    actionRef: actionRef,
    columns: columns,
    // 请求配置
    requestConfig: {
      api: getTableData,
      handlePayload,
      fieldNames: {
        data: 'records',
      },
    },
    // 多选配置
    rowSelection: {
      onChange: (keys, rows) => {
        setSelectedRowKeys(keys);
        setSelectedRows(rows);
      },
      selectedRowKeys,
    },
    // 列表项操作栏按钮配置
    columnOperate: [
      {
        text: '详情',
        onClick: ({ id }: { id: String | Number }) => columnOperateMap.handleInfo(id),
      },
      {
        text: '编辑',
        onClick: ({ id }: { id: String | Number }) => columnOperateMap.handleEdit(id),
      },
    ],
    // 工具栏按钮配置
    toolButton: [
      {
        text: '新建',
        buttonType: 'primary',
        onClick: () => toolButtonMap.handleAddTool(),
      },
      {
        text: '删除',
        selectionButton: true,
        onClick: () => toolButtonMap.handleRemoveTool(),
      },
    ],
  };

  const columnOperateMap = {
    // 详情
    handleInfo: (id: String | Number) => {
      //   setFormType('info');
      //   setFormId(id);
      //   setOpen(true);
      //   history.push({
      //     pathname: '/form',
      //     query: { id, type: 'info' },
      //   });
    },
    // 编辑
    handleEdit: (id: String | Number) => {
      //   setFormType('edit');
      //   setFormId(id);
      //   setOpen(true);
      //   history.push({
      //     pathname: '/form',
      //     query: { id, type: 'edit' },
      //   });
    },
  };
  const toolButtonMap = {
    // 新增
    handleAddTool: () => {
      // setFormType('add');
      // setOpen(true);
      // history.push({
      //   pathname: '/form',
      //   query: { type: 'add' },
      // });
    },
    // 多选删除
    handleRemoveTool: async () => {
      // const operateName = '删除';
      // if (selectedRowKeys.length > 0) {
      //   const handleDelete = async (id) => {
      //     const res = await deleteByIds({ ids: selectedRowKeys.join(',') });
      //     if (res.success) {
      //       message.success(`${operateName}成功`);
      //       reloadTable();
      //     }
      //   };
      //   showConfirm(`是否要${operateName}所选择的列表项？`, handleDelete);
      // } else message.warning('请勾选列表项');
    },
  };

  return (
    <PageHeaderWrapper>
      <ProTable tableConfig={tableConfig} />
      {/* <DrawerForm type={formType} id={id} open={open} setOpen={setOpen} /> */}
    </PageHeaderWrapper>
  );
};
