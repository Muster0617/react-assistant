import { ProForm } from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import { Form, Card, Button } from 'antd';
import BraftEditor from '@/components/BraftEditor';
import styles from './index.less';

export default () => {
  const [form] = Form.useForm();
  const editorRef = useRef({});
  const [readonly, setReadonly] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      content: editorRef.current?.setFormBraftEditorImgSrc('<p>Hello <b>World!</b></p>', ''),
    });
  }, []);

  const handleFinish = async (values) => {
    const { content = '' } = values;
    const payload = {
      ...values,
      contentUrl: editorRef.current?.getFormBraftEditorRelativePath(content),
      content: editorRef.current?.removeFormBraftEditorImgSrc(content),
    };
    console.log(payload, 'payload');
  };

  const formConfig = {
    form: form,
    onFinish: handleFinish,
    layout: 'horizontal',
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 16,
    },
    submitter: {
      render: () => (
        <div className={styles.submitter_wrap}>
          <Button onClick={() => form.resetFields()} key="cancel" style={{ marginRight: '20px' }}>
            重置
          </Button>
          <Button type="primary" onClick={() => form.submit()} key="save">
            提交
          </Button>
        </div>
      ),
    },
  };

  return (
    <Card
      title="BraftEditor"
      extra={
        <Button onClick={() => setReadonly(!readonly)} key="save">
          切换只读
        </Button>
      }
    >
      <ProForm {...formConfig}>
        <Form.Item
          label="活动内容"
          name="content"
          {...(!readonly
            ? {
                rules: [
                  {
                    required: true,
                    validator: (_, value) => {
                      if (!value || value == '<p></p>') {
                        return Promise.reject(`请输入活动内容`);
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
    </Card>
  );
};
