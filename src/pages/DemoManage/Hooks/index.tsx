import { Row, Card, Col } from 'antd';
import EmployInfiniteScroll from './EmployInfiniteScroll';
import EmployExportExcel from './EmployExportExcel';
import EmployHtmlPreView from './EmployHtmlPreView';
import EmployTableToPdf from './EmployTableToPdf';
import styles from './index.less';

export default () => {
  return (
    <div className={styles.wrap}>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card title="滚动懒加载：useInfiniteScroll">
            <EmployInfiniteScroll />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="表格导出PDF：useTableToPdf">
            <EmployTableToPdf />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="表格导出Excel：useExportExcel">
            <EmployExportExcel />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="HTML代码预览：useHtmlPreView">
            <EmployHtmlPreView />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
