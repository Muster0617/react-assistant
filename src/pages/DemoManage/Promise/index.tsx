import { ProForm, EditableProTable } from '@ant-design/pro-components';
import { Space, Form } from 'antd';
import { useRef, useState } from 'react';

const Demo = () => {
  const formRef = useRef();

  const columns = [
    {
      title: '序号',
      valueType: 'index',
      width: 60,
    },
    {
      title: '问题描述',
      dataIndex: 'decs',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
    },
  ];

  const handleFinish = async (values) => {
    const payload = {
      ...values,
    };
    console.log(payload);
  };

  return (
    <ProForm
      formRef={formRef}
      layout="horizontal"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 16 }}
      onFinish={handleFinish}
    >
      <EditableProTable
        rowKey="id"
        recordCreatorProps={{ record: () => ({ id: (Math.random() * 1000000).toFixed(0) }) }}
        name="table"
        columns={columns}
        editable={{
          type: 'multiple',
          actionRender: (row, config, defaultDom) => {
            return [defaultDom.delete];
          },
        }}
      />
    </ProForm>
  );
};

export default Demo;
