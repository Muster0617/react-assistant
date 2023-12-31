import { Row, Card, Col } from 'antd';
import EmployLazyLoadTree from './EmployLazyLoadTree';
import EmployBraftEditor from './EmployBraftEditor';
import EmployQRCode from './EmployQRCode';
import EmployImgCropper from './EmployImgCropper';
import EmployDragDrop from './EmployDragDrop';
import EmployMap from './EmployMap';

export default () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card title="高德地图">
          <EmployMap />
        </Card>
      </Col>
      <Col span={24}>
        <Card title="拖拽排序">
          <EmployDragDrop />
        </Card>
      </Col>
      <Col span={24}>
        <Card title="图片裁切">
          <EmployImgCropper />
        </Card>
      </Col>
      <Col span={24}>
        <Card title="BraftEditor富文本">
          <EmployBraftEditor />
        </Card>
      </Col>
      <Col span={24}>
        <Card title="Tree组件子节点异步加载和局部刷新">
          <EmployLazyLoadTree />
        </Card>
      </Col>
      <Col span={24}>
        <Card title="可下载和打印的二维码">
          <EmployQRCode value="我就是一个二维码" />
        </Card>
      </Col>
    </Row>
  );
};
