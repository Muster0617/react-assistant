import { ProFormText, ProForm } from '@ant-design/pro-components';
import { useEffect, useRef } from 'react';
import { Form } from 'antd';
import BraftEditor from '@/components/BraftEditor';

export default () => {
  const formRef = useRef();

  useEffect(() => {
    formRef.current?.setFieldsValue({
      content: '<p>Hello <b>World!</b></p>',
    });
  }, []);

  const handleFinish = async (values) => {
    const payload = {
      ...values,
    };
    console.log(payload, 'payload');
  };

  const formConfig = {
    formRef: formRef,
    onFinish: handleFinish,
    layout: 'horizontal',
  };

  return (
    <ProForm {...formConfig}>
      <ProFormText
        // rules={[{ required: true }]}
        name="Text"
        label="Text"
        placeholder="请输入Text"
        fieldProps={{
          maxLength: 100,
        }}
      />
      <Form.Item
        label="活动内容"
        name="content"
        rules={[
          {
            required: true,
            validator: (_, value) => {
              if (value == '<p></p>') {
                return Promise.reject(`请输入活动内容`);
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <BraftEditor />
      </Form.Item>
    </ProForm>
  );
};
