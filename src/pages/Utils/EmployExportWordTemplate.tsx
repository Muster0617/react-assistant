import { Button, Input, Space, message } from 'antd';
import exportWordTemplate from '@/utils/exportWordTemplate';
import { useState } from 'react';
import docx from '@/assets/word/wordTemplate.docx';

export default () => {
  const [title, setTitle] = useState('我是一个标题');
  const wordData = {
    title,
    list: [
      { time: '2022-09', name: '西瓜', title: '开发' },
      { time: '2022-10', name: '冬瓜', title: '吃饭' },
      { time: '2022-11', name: '南瓜', title: '睡觉' },
      { time: '2022-12', name: '北瓜', title: '研究' },
    ],
  };
  const handleExport = () => {
    exportWordTemplate(docx, wordData, '默认导出文件名').then(() => {
      message.success('导出成功');
    });
  };

  return (
    <Space>
      <Input placeholder="请输入标题" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Button onClick={handleExport}>点击导出</Button>
    </Space>
  );
};
