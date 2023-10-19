import EChartsReact from 'echarts-for-react';

export default ({ data, unit }: any) => {
  const total = data?.reduce((pre: any, { value }: any) => pre + value, 0);

  const option: any = {
    title: {
      zlevel: 0,
      text: total + unit,
      top: 'center',
      left: '25%',
      textAlign: 'center',
      textStyle: {
        fontSize: 24,
        fontWeight: 700,
      },
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      type: 'scroll',
      left: '45%',
      y: 'center',
      icon: 'circle',
      itemGap: 30,
      formatter: (recordName: string) => {
        const item = data.find(({ name }: any) => recordName == name);
        return `{label|${recordName}}{vlaue|${item.value}${unit}}{ratio|${(
          (item.value / total) *
          100
        ).toFixed(2)}%}`;
      },
      textStyle: {
        rich: {
          label: {
            fontSize: 18,
            fontWeight: 500,
            color: '#363A44',
            width: 140,
          },
          vlaue: {
            fontSize: 18,
            fontWeight: 400,
            color: '#686B73',
            width: 110,
          },
          ratio: {
            fontSize: 18,
            fontWeight: 400,
            color: '#686B73',
          },
        },
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['55%', '70%'],
        center: ['25%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          show: false,
          disabled: true,
        },

        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
  };

  return (
    <EChartsReact option={option} style={{ width: '100%', height: '100%' }} lazyUpdate notMerge />
  );
};