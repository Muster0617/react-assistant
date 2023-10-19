export default [
  {
    path: '/proTable',
    name: 'ProTable',
    component: '@/pages/ProTable',
    icon: 'InsertRowAboveOutlined',
  },
  {
    path: '/demo',
    name: 'Demo',
    icon: 'HeatMapOutlined',
    component: '@/pages/Demo',
  },
  {
    path: '/echarts',
    name: 'Echarts',
    component: '@/pages/Echarts',
    icon: 'RadarChartOutlined',
  },
  {
    path: '/utils',
    name: 'Utils',
    component: '@/pages/Utils',
    icon: 'RedditOutlined',
  },
  {
    path: '/',
    redirect: '/proTable',
  },
  {
    component: './404',
  },
];
