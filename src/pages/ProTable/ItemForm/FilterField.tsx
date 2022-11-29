import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormList,
  ProFormDependency,
  ProFormDigit,
} from '@ant-design/pro-components';
import ProCard from '@ant-design/pro-card';
import { filterValueTypeOptions } from '../constant';
import { Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import FormTitle from '@/components/FormTitle';

export default ({ formRef, index }) => {
  return (
    <>
      <FormTitle title="筛选配置" />
      <ProForm.Group>
        <ProFormSelect
          name="filterValueType"
          initialValue={'text'}
          label="筛选类型"
          width={120}
          fieldProps={{
            options: filterValueTypeOptions,
          }}
        />
        <ProFormText
          name="filterTitle"
          label="Title"
          width={180}
          rules={[{ required: true }]}
          placeholder="请输入Title"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDependency name={['filterValueType']}>
          {({ filterValueType }) => {
            if (filterValueType === 'text') {
              return (
                <ProForm.Group>
                  <ProFormDigit
                    label="MaxLength"
                    name="maxLength"
                    width={180}
                    placeholder="请输入MaxLength"
                  />
                </ProForm.Group>
              );
            }
          }}
        </ProFormDependency>
      </ProForm.Group>
    </>
  );
};
