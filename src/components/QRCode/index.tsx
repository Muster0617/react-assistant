import QRCode from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';
import { forwardRef, useImperativeHandle, useRef } from 'react';

const dataURLtoBlob = (dataurl: any) => {
  const arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export default forwardRef((props: any, ref) => {
  const { value, size = 200, style = {} } = props;
  const codeRef = useRef();

  const printQRCode = useReactToPrint({
    content: () => codeRef.current,
    copyStyles: false,
  });

  useImperativeHandle(ref, () => ({
    downloadQRCode: (imgName = '默认文件名') => {
      const Qr = document.getElementById('bill_qr_code_url');
      //把canvas的数据改成base64的格式
      const canvasUrl = Qr.toDataURL('image/png');
      const myBlob = dataURLtoBlob(canvasUrl);
      //创建blob下载地址
      const myUrl = URL.createObjectURL(myBlob);
      const a = document.createElement('a');
      a.setAttribute('href', myUrl);
      a.setAttribute('download', imgName);
      a.setAttribute('target', '_blank');
      a.click();
    },
    printQRCode,
  }));

  return (
    <div ref={codeRef} style={style}>
      <QRCode id="bill_qr_code_url" value={value} size={size} fgColor="#000000" />
    </div>
  );
});
