import moent from 'moment';
export const filterValueTypeOptions = [
  {
    label: '输入框',
    value: 'text',
  },
  {
    label: '下拉框',
    value: 'select',
  },
  {
    label: '日期',
    value: 'date',
  },
  {
    label: '日期区间',
    value: 'dateRange',
  },
  {
    label: '日期时间区间',
    value: 'dateTimeRange',
  },
];

export const tableValueTypeOptions = [
  {
    label: '序列',
    value: 'index',
  },
  {
    label: '文本',
    value: 'text',
  },
  {
    label: '枚举',
    value: 'select',
  },
];

export const buttonTypeOptions = [
  {
    label: 'Default',
    value: 'default',
  },
  {
    label: 'Primary',
    value: 'primary',
  },
  {
    label: 'Link',
    value: 'link',
  },
  {
    label: 'Text',
    value: 'text',
  },
];

export const defaultConfig = { isSelect: true };
export const defaultToolBarList = [
  {
    buttonName: '新建',
    buttonKey: 'add',
    buttonType: 'primary',
  },
  {
    buttonName: '导出',
    buttonKey: 'export',
    buttonType: 'default',
  },
];
export const defaultFilterItemColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
    hideInTable: true,
    valueType: 'text',
    fieldProps: {
      placeholder: '请输入姓名',
      maxLength: 20,
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    hideInTable: true,
    valueType: 'dateRange',
    fieldProps: {
      placeholder: ['开始时间', '创建时间'],
    },
  },
];
export const defaultItemColumns = [
  {
    title: '序号',
    valueType: 'index',
    hideInSearch: true,
    isFilter: false,
    isOperate: false,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text',
    hideInSearch: true,
    isFilter: true,
    isOperate: false,
    filterValueType: 'text',
    filterTitle: '姓名',
    maxLength: 20,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'text',
    hideInSearch: true,
    isFilter: true,
    filterValueType: 'dateRange',
    filterTitle: '创建时间',
  },
  {
    title: '操作',
    key: 'operate',
    align: 'center',
    hideInSearch: true,
    isOperate: true,
    isFilter: false,
    valueType: 'option',
    render: (_, record) => [
      <a key="edit" onClick={() => { }}>
        编辑
      </a>,
      <a key="info" onClick={() => { }}>
        详情
      </a>,
      <a key="delete" onClick={() => { }}>
        删除
      </a>,
    ],
    operateList: [
      {
        buttonName: '编辑',
        buttonKey: 'edit',
      },
      {
        buttonName: '详情',
        buttonKey: 'info',
      },
      {
        buttonName: '删除',
        buttonKey: 'delete',
      },
    ],
  },
];

const getDefaultDataSource = () => {
  let tableKeys = ['name', 'createTime'];
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
  return newDefaultData;
};

export const defaultDataSource = getDefaultDataSource();
