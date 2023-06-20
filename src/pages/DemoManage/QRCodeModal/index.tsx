import { Button } from 'antd';
import { useState } from 'react';
import Modal from './Modal';

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>生成二维码</Button>
      <Modal open={open} setOpen={setOpen} valie="valie" title="二维码" />
    </>
  );
};
