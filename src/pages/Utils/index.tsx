import { Row, Card, Col } from 'antd';
import EmployExcelExport from './EmployExcelExport';
import EmployTableToPdf from './EmployTableToPdf';
import EmployPdfToImage from './EmployPdfToImage';

export default () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card title="表格导出PDF：@/utils/excelExport">
          <EmployTableToPdf />
        </Card>
      </Col>
      <Col span={24}>
        <Card title="表格导出Excel：@/utils/excelExport">
          <EmployExcelExport />
        </Card>
      </Col>
      <Col span={24}>
        <Card title="PDF转图片：@/utils/pdfToImage">
          <EmployPdfToImage />
        </Card>
      </Col>
    </Row>
  );
};
