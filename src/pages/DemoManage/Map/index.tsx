import EChartsReact from 'echarts-for-react';
import * as echarts from 'echarts';
import china from '@/assets/MapJson/全国.json'; //默认引入全国地图
import { useRef } from 'react';
echarts.registerMap('map', china); //默认注册全国地图

export default () => {
  const curRef = useRef(null);

  const option = {
    title: {
      text: '全国地图',
      textStyle: {
        color: '#000',
      },
      left: 'center',
    },
    tooltip: {
      // 提示框
      trigger: 'item', // 触发类型
      formatter: function (params) {
        // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
        let { data = {} } = params; // 第一个参数 `params` 是 formatter 需要的数据集
        let { value = 0 } = data; // 传入的数据值
        // params.name 数据名，类目名
        return `${params.name}<br/>个数: ${value}`;
      },
    },
    series: [
      {
        name: '全国地图',
        type: 'map',
        mapType: 'map',
        scaleLimit: {
          //滚轮缩放的极限控制
          min: 0.8, //缩放最小大小
          max: 2, //缩放最大大小
        },
        data: [
          {
            name: '内蒙古',
            value: 1000,
            itemStyle: {
              normal: {
                areaColor: '#D1A60B',
              },
            },
          },
          { name: '北京', value: 700 },
          { name: '河北', value: 30 },
          { name: '江苏', value: 400 },
          { name: '西藏', value: 200 },
        ],
        // select: {
        //   disabled: true,
        // },

        label: {
          // 图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
          show: true, //显示省市名称
          position: [1, 100], // 相对的百分比
          fontSize: 12,
          color: '#fff',
          offset: [2, 0], // 是否对文字进行偏移。默认不偏移。例如：`[30, 40]` 表示文字在横向上偏移 `30`，纵向上偏移 `40`。
          align: 'left', // 文字水平对齐方式，默认自动。
        },
        itemStyle: {
          // 地图区域的多边形 图形样式
          // areaColor: "#fff", // 地图图形颜色
          borderColor: 'red', // 区域边框线
          borderWidth: 1,
          areaColor: {
            type: 'linear-gradient',
            x: 0,
            y: 1000,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 0.5,
                color: '#0D59C1', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#53C9C7', // 100% 处的颜色
              },
            ],
            global: true, // 缺省为 false
          },
        },
        roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 `'scale'` 或者 `'move'`。设置成 `true` 为都开启
        zoom: 1, // 当前视角的缩放比例
        emphasis: {
          // 高亮显示
          label: {
            color: 'black',
            fontSize: 12,
          },
          itemStyle: {
            areaColor: 'red', // 区域高亮颜色
          },
        },
      },
    ],
  };

  return (
    <EChartsReact
      option={option}
      ref={curRef}
      style={{ width: '100%', height: '100%' }}
      lazyUpdate={true}
      notMerge={true}
      onEvents={{
        click: (param: any) => {
          //echarts点击事件
          if (param.name) {
            //判断名称是否为空
            const echartInstance = curRef.current.getEchartsInstance(); //获取echarts实例
            const options = echartInstance.getOption(); //获取option

            let provinceJSON = null;
            try {
              provinceJSON = require(`@/assets/MapJson/${param.name}.json`); //根据点击的省名称查询Geojson地图数据（我是将地图数据全部保存在本地，可根据API获取地图json）
              echarts.registerMap('map', provinceJSON); //注册点击的省份地图

              options.title[0].text = param.name + '地图';
              options.series[0].name = param.name + '地图';

              // options.series[0].center = china.features.find(item => item.properties.name === param.name)?.properties?.center//修改点击后地图中心位置，不用会存在偏移，我使用下边null,默认全局居中
              options.series[0].center = null; //修改点击后地图中心位置，null默认全局居中
              echartInstance.setOption(options, true); //修改echarts option
            } catch (error) {
              //获取Geojson地图异常返回到全国地图，我只存在市级地图数据，所以点击市级行政区会返回到全国地图。
              options.title[0].text = '全国地图';
              echarts.registerMap('map', china);
              options.series[0].name = '全国地图';

              options.series[0].center = null;
              echartInstance.setOption(options, true);
            }
          }
        },
      }}
    />
  );
};
