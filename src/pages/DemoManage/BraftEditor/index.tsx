import { ProFormText, ProForm } from '@ant-design/pro-components';
import { useEffect, useRef } from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { Form } from 'antd';

export default () => {
  const formRef = useRef();

  const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link'];

  useEffect(() => {
    formRef.current?.setFieldsValue({
      content: BraftEditor.createEditorState('<p>Hello <b>World!</b></p>'),
    });
  }, []);

  const handleFinish = async (values) => {
    const { content } = values;
    console.log(formRef, 'formRef');
    const payload = {
      ...values,
      content: content.toHTML(),
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
        label="文章正文"
        name="content"
        rules={[
          {
            required: true,
            validator: (_, value, callback) => {
              console.log(value?.toText(), 'value');
              if (!value?.toText()) {
                return Promise.reject('请输入正文内容');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <BraftEditor className="my-editor" controls={controls} placeholder="请输入正文内容" />
      </Form.Item>
    </ProForm>
  );
};
