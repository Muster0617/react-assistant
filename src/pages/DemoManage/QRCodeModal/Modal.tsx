import { Modal, Button } from 'antd';
import { useRef } from 'react';
import QRCode from '@/components/QRCode';

export default ({
  open,
  setOpen,
  id,
  title,
}: {
  id: string;
  title: string;
  open: boolean;
  setOpen: () => {};
}) => {
  const codeActionRef = useRef();
  const handleCancel = () => {
    setOpen(false);
  };
  const handleDownload = () => codeActionRef?.current?.downloadQRCode('活动二维码');

  const handlePrint = () => {
    codeActionRef?.current?.printQRCode();
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleCancel}
      width={650}
      style={{
        top: '5vh',
      }}
      destroyOnClose
      footer={[
        <Button type="primary" onClick={handleDownload}>
          下载
        </Button>,
        <Button type="primary" onClick={handlePrint}>
          打印
        </Button>,
      ]}
    >
      <QRCode
        value={`{"activityId":"${id}"}`}
        ref={codeActionRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px 0px',
        }}
      />
    </Modal>
  );
};
