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
        render: (props, doms) => [
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
        ],
      }}
      onFinish={handleFinish}
    >
      <ProFormText
        readonly={type === 'info'}
        name="Text"
        label="Text"
        placeholder="请输入Text"
        rules={[{ required: !(type === 'info'), message: '请输入Text' }]}
        fieldProps={{
          maxLength: 100,
        }}
      />
      <ProFormSelect
        readonly={type === 'info'}
        name="Select"
        label="Select"
        placeholder="请选择Select"
        rules={[{ required: !(type === 'info'), message: '请选择Select' }]}
        // fieldProps={{
        //   mode: 'multiple',
        // }}
        // showSearch
        // transform={(value) => {
        //   const values = value.split(',');
        //   return { labelName: values[0], labelId: values[1] };
        // }}
        request={async () => {
          return [{ label: 'label', value: 1 }];
        }}
      />
      <ProFormRadio.Group
        name="Radio"
        readonly={type === 'info'}
        rules={[{ required: !(type === 'info'), message: '请选择Radio' }]}
        label="Radio"
        options={[
          {
            label: 'Radio',
            value: 1,
          },
        ]}
      />
      <ProFormDigit
        label="Digit"
        readonly={type === 'info'}
        rules={[{ required: !(type === 'info'), message: '请输入Digit' }]}
        name="Digit"
        placeholder="请输入Digit"
        fieldProps={{
          controls: false,
        }}
      />
      <ProFormTextArea
        readonly={type === 'info'}
        name="TextArea"
        label="TextArea"
        placeholder="请输入TextArea"
        rules={[{ required: !(type === 'info'), message: '请输入TextArea' }]}
        fieldProps={{
          maxLength: 300,
          showCount: true,
          autoSize: { minRows: 6, maxRows: 6 },
        }}
      />
      <ProFormUploadButton
        label="附件"
        name="fileList"
        rules={[{ required: !(type === 'info'), message: '请上传附件' }]}
        // 上传的文件路径
        action="your action"
        fieldProps={{
          name: 'file',
          // 上传文件格式限制
          accept: '.pptx,.pdf',
          headers: {
            // 填写token(必填)
            Authentication: 'your token',
          },
          // 允许上传的文件数量
          maxCount: 1,
          // 文件预览的逻辑
          // onPreview: async (file) => {},
          onChange(info) {
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
              message.success(`${info.file.name} 上传成功`);
            }
            if (info.file.status === 'error') {
              message.error(`${info.file.name} 上传失败.`);
            }
          },
          beforeUpload(file) {
            // 上传文件大小限制
            if (file.size > 50 * 1024 * 1000) {
              message.error(`上传文件大于50MB`);
              return false;
            }
            return true;
          },
        }}
        // 表单字段转化处理
        transform={(values) => {
          const flagData = [];
          for (const value of values) {
            const response = value.response;
            flagData.push({
              name: value?.name,
              url: response?.data,
            });
          }
          return { fileList: flagData };
        }}
      />
      <ProFormDependency name={['']}>
        {({}) => {
          return (
            <ProFormText
              readonly={type === 'info'}
              name="Dependency"
              label="Dependency"
              placeholder="请输入Dependency"
              rules={[
                {
                  required: !(type === 'info'),
                  message: '请输入Dependency',
                },
              ]}
              fieldProps={{
                maxLength: 100,
              }}
            />
          );
        }}
      </ProFormDependency>
      <ProFormList
        actionRef={actionRef}
        name="List"
        label="List"
        rules={[{ required: !(type === 'info'), message: '请输入List' }]}
        // copyIconProps={false}
        // deleteIconProps={{
        //   tooltipText: false,
        // }}
        creatorButtonProps={
          type === 'info'
            ? false
            : {
                creatorButtonText: '添加一行数据',
              }
        }
        itemRender={({ listDom, action }, { record, index }) => (
          <ProCard
            bordered
            extra={type === 'info' ? '' : <Space>{action}</Space>}
            title={record?.name}
            style={{
              marginBlockEnd: 8,
            }}
          >
            {listDom}
          </ProCard>
        )}
      ></ProFormList>
    </DrawerForm>
  );
};
