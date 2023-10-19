import { Row, Card, Col } from 'antd';
import Map from '@/components/Echarts/Map';
import LineBarChart from '@/components/Echarts/LineBarChart';
import PieChart from '@/components/Echarts/PieChart';
import styles from './index.less';

export default () => {
  return (
    <div className={styles.wrap}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="地图">
            <Map />
          </Card>
        </Col>
        <Col span={24}>
          <Card title="折线图">
            <LineBarChart
              xAxisData={['0.00', '1.00', '2.00', '3.00', '4.00', '5.00']}
              series={[
                {
                  name: '准确率-现货策略',
                  data: [31, 26, 12, 0.34, 34, 23],
                  type: 'line',
                  yAxisIndex: 1,
                },
              ]}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card title="柱形图">
            <LineBarChart
              xAxisData={['0.00', '1.00', '2.00', '3.00', '4.00', '5.00']}
              series={[
                {
                  name: '结算价差均值（实时-日前）',
                  data: [0.31, 0.26, 0.12, 0.34, -0.21, 0.19],
                  type: 'bar',
                  yAxisIndex: 0,
                },
              ]}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card title="饼图">
            <PieChart
              unit="度"
              data={[
                { value: 1048, name: '照明用电' },
                { value: 735, name: '动力用电' },
                { value: 580, name: '商铺用电' },
                { value: 580, name: '商铺用电' },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
