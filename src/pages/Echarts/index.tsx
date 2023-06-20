import { Row, Card, Col } from 'antd';
import Map from '@/components/Echarts/Map';
import LineChart from '@/components/Echarts/LineChart';
import styles from './index.less';

export default () => {
  return (
    <div className={styles.wrap}>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card title="地图">
            <Map />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="折线图">
            <LineChart
              xAxisData={['星期一', '星期二', '星期三', '星期四', '星期五']}
              series={{
                访问数: [123, 345, 676, 165, 456],
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
