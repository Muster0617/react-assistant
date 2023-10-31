import EChartsReact from 'echarts-for-react';
import * as echarts from 'echarts';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export default forwardRef(({ xAxisData = [], series = [] }: any, ref) => {
  const chartRef = useRef<any>(null);

  useImperativeHandle(ref, () => {
    return chartRef.current.getEchartsInstance();
  });

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: series?.map((item: any) => item?.name),
    },
    grid: {
      left: '1%',
      right: '1%',
      bottom: '6%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      // boundaryGap: false,
      data: xAxisData,
      axisLabel: {
        textStyle: {
          color: 'rgba(0,0,0,.38)',
        },
        margin: 15,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          margin: 10,
          color: 'rgba(0,0,0,.38)',
        },
        nameTextStyle: {
          color: 'rgba(0,0,0,.38)',
          // padding: [0, 0, 0, -10],
        },
        position: 'left',
        // name: '元/kWh',
      },
      {
        type: 'value',
        axisLabel: {
          margin: 10,
          color: 'rgba(0,0,0,.38)',
          formatter: '{value}%',
        },
        nameTextStyle: {
          color: 'rgba(0,0,0,.38)',
        },
        position: 'right',
      },
    ],
    series: series?.map((item: any) => {
      if (item.type == 'line') {
        item.symbol = 'circle';
        item.symbolSize = 6;
        item.itemStyle = {
          normal: {
            color: item?.color || 'rgb(250,167,90)',
            lineStyle: {
              color: item?.color || 'rgb(250,167,90)',
            },
          },
        };
      }
      if (item.type == 'bar') {
        item.itemStyle = {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: item?.color || 'rgb(127,207,170)' },
            { offset: 1, color: (item?.color?.slice(0, -1) || 'rgb(127,207,170') + ',0.5)' },
          ]),
        };
      }
      return item;
    }),
  };

  return (
    <EChartsReact
      ref={chartRef}
      option={option}
      style={{ width: '100%', height: '100%' }}
      lazyUpdate
      notMerge
    />
  );
});
