import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormList,
  ProFormDependency,
  ProFormTextArea,
  ProFormUploadButton,
  ProFormRadio,
  ProFormDigit,
  ProCard,
} from '@ant-design/pro-components';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { message, Button, Space, Modal, Form } from 'antd';
import { useState, useRef, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import styles from './ProForm.less';
// import { edit, add, queryById } from '@/services/portrayal';
// import { history, useLocation } from 'umi';

export default ({ history, location }: any) => {
  const { id, type }: any = location?.query || {};
  const [form] = Form.useForm();
  const actionRef = useRef();
  const [formData, setFormData] = useState<any>({});
  const title = useMemo(() => {
    const titlEnum = {
      info: '详情',
      edit: '编辑',
      add: '新增',
    };
    return titlEnum[type];
  }, [type]);

  const showConfirmBack = () => {
    Modal.confirm({
      title: '提示',
      content: '编辑的内容没有保存，是否继续取消操作',
      cancelText: '我再想想',
      onOk() {
        history.goBack();
      },
    });
  };

  const getFormData = async () => {
    const res = await queryById({ id });
    const { data } = res;
    if (res?.success) {
      form.setFieldsValue({
        ...data,
        // fileList: [{ url: res.data?.fileUrl, name: res.data?.fileName }],
      });
      setFormData(data);
    }
  };

  useEffect(() => {
    // if (['edit', 'info'].includes(type)) getFormData();
  }, []);

  const handleFinish = async (values) => {
    const payload = {
      ...values,
    };
    const operateMap = {
      edit: async (loadData: any) => await edit({ ...loadData, id }),
      add: async (loadData: any) => await add(loadData),
    };
    const res = await operateMap[type](payload);
    if (res.success) {
      message.success(type === 'edit' ? '编辑成功' : '新建成功');
      // 提交表单后页面跳转
      history.push('/table');
    }
  };

  const renderSubmitter = () => (
    <div className={styles.submitter_wrap}>
      {type === 'info' ? (
        <Button type="primary" onClick={() => history.goBack()} key="back">
          返回
        </Button>
      ) : (
        <>
          <Button onClick={showConfirmBack} key="cancel" style={{ marginRight: '20px' }}>
            取消
          </Button>
          <Button type="primary" onClick={() => form.submit()} key="save">
            保存
          </Button>
        </>
      )}
    </div>
  );

  const formConfig = {
    form: form,
    onFinish: handleFinish,
    layout: 'horizontal',
    className: classNames(type === 'info' && styles.form_info),
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 16,
    },
    submitter: {
      render: renderSubmitter,
    },
  };

  return (
    <PageHeaderWrapper title={title}>
      <div className={styles.wrapper}>
        <ProForm {...formConfig}></ProForm>
      </div>
    </PageHeaderWrapper>
  );
};
