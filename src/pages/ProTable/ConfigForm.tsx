import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormList,
  ProFormDependency,
  ProFormRadio,
  ProFormDigit,
} from '@ant-design/pro-components';
import { useRef } from 'react';

export default (props) => {
  const { onFinish, onReset } = props;
  const formRef = useRef();

  return (
    <ProForm
      formRef={formRef}
      autoFocusFirstInput
      onFinish={onFinish}
      submitter={{
        searchConfig: {
          resetText: '重置',
          submitText: '生成表格',
        },
        onReset,
      }}
    >
      <ProForm.Group title="表格配置">
        <ProFormRadio.Group
          name="isSelect"
          initialValue={false}
          label="是否可多选"
          options={[
            {
              label: '是',
              value: true,
            },
            {
              label: '否',
              value: false,
            },
          ]}
          transform={(value) => ({ config: { isSelect: value } })}
        />
      </ProForm.Group>
    </ProForm>
  );
};
