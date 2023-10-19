import { ProForm } from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import { Form, Space, Button } from 'antd';
import BraftEditor from '@/components/BraftEditor';

export default () => {
  const [form] = Form.useForm();
  const editorRef = useRef<any>({});
  const [readonly, setReadonly] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      content: editorRef.current?.setFormBraftEditorImgSrc(
        '<p>插入图片需更换实际OSS上传地址</p>',
        '',
      ),
    });
  }, []);

  const handleFinish = async (values: { content: string }) => {
    const { content = '' } = values;
    const payload = {
      ...values,
      contentUrl: editorRef.current?.getFormBraftEditorRelativePath(content),
      content: editorRef.current?.removeFormBraftEditorImgSrc(content),
    };
    console.log(payload, 'payload');
  };

  const formConfig: any = {
    form: form,
    onFinish: handleFinish,
    submitter: false,
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
        }}
      >
        <Space>
          <Button onClick={() => setReadonly(!readonly)} key="cancel">
            只读切换
          </Button>
          <Button onClick={() => form.submit()} key="save">
            控制台输出
          </Button>
        </Space>
      </div>
      <ProForm {...formConfig}>
        <Form.Item
          label="富文本内容"
          name="content"
          {...(!readonly
            ? {
                rules: [
                  {
                    required: true,
                    validator: (_, value) => {
                      if (!value || value == '<p></p>') {
                        return Promise.reject(`请输入富文本内容`);
                      }
                      return Promise.resolve();
                    },
                  },
                ],
              }
            : {})}
        >
          <BraftEditor ref={editorRef} readonly={readonly} />
        </Form.Item>
      </ProForm>
    </div>
  );
};
