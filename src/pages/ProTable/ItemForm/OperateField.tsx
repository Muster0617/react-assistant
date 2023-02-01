import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormList,
  ProFormDependency,
  ProFormDigit,
} from '@ant-design/pro-components';
import ProCard from '@ant-design/pro-card';
import { Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import FormTitle from '@/components/FormTitle';

export default () => {
  const operateListActionRef = useRef();

  return (
    <>
      <FormTitle title="操作按钮配置" />
      <ProForm.Group>
        <ProFormDependency name={['isOperate']}>
          {({ isOperate }) => {
            if (isOperate) {
              return (
                <ProFormList
                  actionRef={operateListActionRef}
                  name="operateList"
                  creatorButtonProps={{
                    creatorButtonText: '添加操作按钮',
                  }}
                  rules={[{ required: true, message: '请配置操作按钮' }]}
                  itemRender={({ listDom, action }, { record, index }) => {
                    return (
                      <ProCard
                        bordered
                        extra={
                          <Space>
                            <ArrowUpOutlined
                              onClick={() => {
                                operateListActionRef.current.move(index, index - 1);
                              }}
                            />
                            <ArrowDownOutlined
                              onClick={() => {
                                operateListActionRef.current.move(index, index + 1);
                              }}
                            />
                            {action}
                          </Space>
                        }
                        style={{ marginBlockEnd: 8 }}
                      >
                        {listDom}
                      </ProCard>
                    );
                  }}
                >
                  <ProForm.Group>
                    {/* <ProFormSelect
                            name="buttonType"
                            initialValue={'default'}
                            label="按钮类型"
                            width={120}
                            fieldProps={{
                              options: buttonTypeOptions,
                            }}
                            placeholder="请输入按钮类型"
                          /> */}
                    <ProFormText
                      name="buttonName"
                      label="ButtonName"
                      width={180}
                      rules={[{ required: true }]}
                      placeholder="请输入ButtonName"
                    />
                    <ProFormText
                      name="buttonKey"
                      label="ButtonKey（唯一）"
                      width={180}
                      rules={[{ required: true }]}
                      placeholder="请输入ButtonKey"
                    />
                  </ProForm.Group>
                </ProFormList>
              );
            }
          }}
        </ProFormDependency>
      </ProForm.Group>
    </>
  );
};
