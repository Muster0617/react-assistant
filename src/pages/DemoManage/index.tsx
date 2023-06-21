import { Row, Card, Col } from 'antd';
import EmployAntdTree from './EmployAntdTree';
import EmployBraftEditor from './EmployBraftEditor';
import EmployQRCode from './EmployQRCode';
import styles from './index.less';

export default () => {
  return (
    <div className={styles.wrap}>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card title="BraftEditor富文本">
            <EmployBraftEditor />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Tree组件子节点异步加载和局部刷新">
            <EmployAntdTree />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="可下载和打印的二维码">
            <EmployQRCode value="我就是一个二维码" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
