import {
  DrawerForm,
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
import { Button, message, Modal } from 'antd';
import { useMemo, useRef } from 'react';

const titleEnum = {
  info: '详情',
  edit: '编辑',
  add: '新增',
};

export default ({
  type,
  id,
  open,
  setOpen,
}: {
  type: string;
  id: string | number;
  open: boolean;
  setOpen: (value: boolean) => {};
}) => {
  const formRef = useRef();
  const actionRef = useRef();
  const title = useMemo(() => titleEnum[type], [type]);
  const operateMap = {
    edit: async (values) => await edit({ ...values, id }),
    add: async (values) => await add(values),
  };

  const showConfirm = () => {
    Modal.confirm({
      title: '提示',
      content: '内容没有保存，是否继续取消操作',
      cancelText: '我再想想',
      onOk() {
        setOpen(false);
      },
    });
  };

  const getFormData = async () => {
    const res = await queryById({ id });
    const { data: formData } = res;
    if (res?.success) {
      formRef?.current?.setFieldsValue({
        ...formData,
        // fileList: [{ url: res.data?.fileUrl, name: res.data?.fileName }],
      });
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (value) {
      //   if (['edit', 'info'].includes(type)) getFormData();
      setOpen(true);
    } else {
      if (type === 'info') setOpen(false);
      else showConfirm();
    }
  };

  const handleFinish = async (values) => {
    const payload = {
      ...values,
    };
    const res = await operateMap[type]({ payload });
    if (res.success) {
      message.success(type === 'edit' ? '修改成功' : '新增成功');
      setOpen(false);
    }
  };

  const renderSubmitter = () => [
    ...(type == 'info'
      ? []
      : [
          <Button onClick={showConfirm} key="cancel">
            取消
          </Button>,
          <Button type="primary" onClick={() => formRef?.current.submit()} key="save">
            提交
          </Button>,
        ]),
  ];

  return (
    <DrawerForm
      onOpenChange={handleOpenChange}
      visible={open}
      title={title}
      autoFocusFirstInput
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 18 }}
      drawerProps={{
        destroyOnClose: true,
        maskClosable: false,
        width: 650,
      }}
      formRef={formRef}
      layout="horizontal"
      submitTimeout={2000}
      submitter={{
        render: renderSubmitter,
      }}
      onFinish={handleFinish}
    ></DrawerForm>
  );
};
