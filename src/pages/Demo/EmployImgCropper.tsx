import React, { useEffect, useRef, useState } from 'react';
import Cropper from 'react-cropper'; // 引入Cropper
import 'cropperjs/dist/cropper.css'; // 引入Cropper对应的css
import { Space, Button, Row, Col } from 'antd';

const Demo = () => {
  const ref = useRef<any>();
  const [imgSrc, setImgSrc] = useState(
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  );
  const [sourceSrc, setSourceSrc] = useState(
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  );
  const [isCropper, setIsCropper] = useState(false);
  const [cropBoxData, setCropBoxData] = useState({});

  const handleCropperReady = () => {
    ref.current.cropper.setCropBoxData(cropBoxData);
  };

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <Space>
          <Button
            onClick={() => {
              setIsCropper(!isCropper);
            }}
          >
            裁切
          </Button>
          <Button
            onClick={() => {
              ref.current.cropper.getCroppedCanvas().toBlob((blob: any) => {
                setImgSrc(URL.createObjectURL(blob));
                setIsCropper(false);
              });
            }}
          >
            替换
          </Button>
        </Space>
      </div>
      {isCropper ? (
        <Cropper
          src={sourceSrc} // 图片路径，即是base64的值
          ref={ref}
          style={{ height: 300, width: 300 }}
          viewMode={1} // 定义cropper的视图模式
          zoomable={true} // 是否允许放大图像
          guides={true} // 显示在裁剪框上方的虚线
          background={false} // 是否显示背景的马赛克
          rotatable={false} // 是否旋转
          // cropBoxResizable={false} // 默认true ,是否允许拖动 改变裁剪框大小
          // cropBoxMovable  // 是否可以拖拽裁剪框 默认true
          autoCropArea={0.8} // 默认值0.8（图片的80%）。--0-1之间的数值，定义自动剪裁区域的大小
          dragMode="move" // 拖动模式, 默认crop当鼠标 点击一处时根据这个点重新生成一个 裁剪框，move可以拖动图片，none:图片不能拖动
          center
          ready={handleCropperReady}
          cropmove={() => setCropBoxData(ref.current.cropper.getCropBoxData())}
        />
      ) : (
        <img src={imgSrc} style={{ maxWidth: 300, maxHeight: 300 }} />
      )}
    </>
  );
};

export default Demo;
