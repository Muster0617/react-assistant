export default [
  {
    path: '/proTable',
    name: 'ProTable',
    component: '@/pages/ProTable',
    icon: 'InsertRowAboveOutlined',
  },
  {
    path: '/demoManage',
    name: 'DemoManage',
    icon: 'HeatMapOutlined',
    component: '@/pages/DemoManage',
  },
  {
    path: '/echarts',
    name: 'Echarts',
    component: '@/pages/Echarts',
    icon: 'RadarChartOutlined',
  },
  {
    path: '/',
    redirect: '/proTable',
  },
  {
    component: './404',
  },
];
