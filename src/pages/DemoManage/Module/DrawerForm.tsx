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
import { Button, message, Modal, Form } from 'antd';
import { useMemo } from 'react';

export default ({ type, id, open, setOpen }: any) => {
  const [form] = Form.useForm();
  const title = useMemo(() => {
    const titleEnum: any = {
      info: '详情',
      edit: '编辑',
      add: '新增',
    };
    return titleEnum[type];
  }, [type]);

  const showConfirmCancel = () => {
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
      form?.setFieldsValue({
        ...formData,
        // fileList: [{ url: res.data?.fileUrl, name: res.data?.fileName }],
      });
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (value) {
      //   if (['edit', 'info'].includes(type)) getFormData();
    }
  };

  const handleFinish = async (values) => {
    const payload = {
      ...values,
    };
    const operateMap: any = {
      edit: async (loadData: any) => await edit({ ...loadData, id }),
      add: async (loadData: any) => await add(loadData),
    };
    const res = await operateMap[type](payload);
    if (res.success) {
      message.success(type === 'edit' ? '编辑成功' : '新增成功');
      setOpen(false);
    }
  };

  const renderSubmitter = () => [
    ...(type == 'info'
      ? []
      : [
          <Button onClick={showConfirmCancel} key="cancel">
            取消
          </Button>,
          <Button type="primary" onClick={() => form?.submit()} key="save">
            提交
          </Button>,
        ]),
  ];

  const formConfig = {
    visible: open,
    title: title,
    form: form,
    onOpenChange: handleOpenChange,
    onFinish: handleFinish,
    layout: 'horizontal',
    autoFocusFirstInput: true,
    submitTimeout: 2000,
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
    drawerProps: {
      destroyOnClose: true,
      maskClosable: false,
      width: 650,
      onClose: () => setOpen(false),
    },
    submitter: {
      render: renderSubmitter,
    },
  };

  return <DrawerForm {...formConfig}></DrawerForm>;
};
