import EChartsReact from 'echarts-for-react';

export default ({
  xAxisData = [],
  series = {},
  chartOption = {
    legend: true,
  },
}: any) => {
  const keys = Object.keys(series) || [];

  const data = keys?.map((key) => ({
    name: key,
    data: series?.[key] || [],
    type: 'line',
  }));

  const option: any = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: chartOption?.legend ? keys : [],
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '4%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      // axisLine: {
      //   show: false,
      // },
    },
    yAxis: {
      type: 'value',
    },
    series: data,
  };

  return (
    <EChartsReact
      option={option}
      style={{ width: '100%', height: '100%' }}
      lazyUpdate={true}
      notMerge={true}
    />
  );
};
