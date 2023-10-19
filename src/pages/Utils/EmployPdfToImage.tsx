import { Upload, Button, Image, Space } from 'antd';
import pdfToImage from '@/utils/pdfToImage';
import { useState } from 'react';

export default () => {
  const [fileList, setFileList] = useState([]);
  const handleCustomRequest = async ({ file }: any) => {
    const list = await pdfToImage(file);
    setFileList(
      list?.map((item: any) => {
        return { url: URL.createObjectURL(item) };
      }),
    );
  };

  return (
    <Space direction="vertical">
      <Upload customRequest={handleCustomRequest} accept=".pdf" fileList={[]}>
        <Button>点击上传</Button>
      </Upload>
      <Space wrap>
        {fileList?.map((file: any) => (
          <Image style={{ height: 300 }} key={file.url} src={file.url} />
        ))}
      </Space>
    </Space>
  );
};
