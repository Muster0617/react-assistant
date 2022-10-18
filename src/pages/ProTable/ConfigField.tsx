import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormList,
  ProFormDependency,
  ProFormRadio,
  ProFormDigit,
} from '@ant-design/pro-components';

export default () => {
  return (
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
  );
};
