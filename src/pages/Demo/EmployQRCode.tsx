import { Button, Space } from 'antd';
import { useRef } from 'react';
import QRCode from '@/components/QRCode';

export default ({ value }: { value: string }) => {
  const codeActionRef = useRef<any>();

  const handleDownload = () => codeActionRef.current.downloadQRCode({ fileName: '二维码' });

  const handlePrint = () => {
    codeActionRef?.current?.printQRCode();
  };

  return (
    <>
      <QRCode
        value={value}
        ref={codeActionRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px 0px',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 24,
        }}
      >
        <Space>
          <Button type="primary" onClick={handleDownload}>
            下载
          </Button>
          <Button type="primary" onClick={handlePrint}>
            打印
          </Button>
        </Space>
      </div>
    </>
  );
};
