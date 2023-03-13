import {
  ProForm,
  BetaSchemaForm,
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
import { message, Button, Space, Modal } from 'antd';
import { useRef, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import styles from './ProForm.less';
// import { edit, add, queryById } from '@/services/';
// import { history, useLocation } from 'umi';

const titleEnum = {
  info: '详情',
  edit: '编辑',
  add: '新增',
};

export default ({ history, location }) => {
  const { id, type } = location?.query || {};
  const formRef = useRef();
  const actionRef = useRef();
  const title = useMemo(() => titleEnum[type], [type]);
  const operateMap = {
    edit: async (values) => await edit({ ...values, id }),
    add: async (values) => await add(values),
  };

  const columns = [
    {
      title: 'text',
      dataIndex: 'text',
      //   readonly: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createName',
      valueType: 'date',
    },
  ];

  const getFormData = async () => {
    const res = await queryById({ id });
    const { data: formData } = res;
    if (res?.success) {
      formRef?.current?.setFieldsValue({
        ...formData,
        // fileList: [{ url: formData?.fileUrl, name: formData?.fileName }],
      });
    }
  };

  useEffect(() => {
    // if (['edit', 'info'].includes(type)) getFormData();
  }, []);

  const showConfirm = () => {
    Modal.confirm({
      title: '提示',
      content: '编辑的内容没有保存，是否继续取消操作',
      cancelText: '我再想想',
      onOk() {
        history.goBack();
      },
    });
  };

  const handleFinish = async (values) => {
    const payload = {
      ...values,
    };
    const res = await operateMap[type]({ payload });
    if (res.success) {
      message.success(type === 'edit' ? '修改成功' : '新建成功');
      // 提交表单后页面跳转
      history.push('/table');
    }
  };

  return (
    <PageHeaderWrapper title={title}>
      <div className={styles.wrapper}>
        <ProForm
          className={classnames(type === 'info' && styles.form_info)}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          formRef={formRef}
          layout="horizontal"
          onFinish={handleFinish}
          submitter={{
            render: (props, doms) => (
              <div className={styles.submitter_wrap}>
                {type === 'info' ? (
                  <Button type="primary" onClick={() => history.goBack()} key="back">
                    返回
                  </Button>
                ) : (
                  <>
                    <Button onClick={showConfirm} key="cancel" style={{ marginRight: '20px' }}>
                      取消
                    </Button>
                    <Button type="primary" onClick={() => formRef.current.submit()} key="save">
                      保存
                    </Button>
                  </>
                )}
              </div>
            ),
          }}
        >
          <BetaSchemaForm shouldUpdate={false} layoutType="Embed" columns={columns} />
        </ProForm>
      </div>
    </PageHeaderWrapper>
  );
};
