export default [
  {
    path: '/proTable',
    name: 'ProTable',
    component: './ProTable',
    icon: 'InsertRowAboveOutlined',
  },
  {
    path: '/demoManage',
    name: 'DemoManage',
    icon: 'HeatMapOutlined',
    routes: [
      {
        path: '/demoManage/module',
        name: 'ProTableModule',
        component: './DemoManage/Module',
      },
      {
        path: '/demoManage/braftEditor',
        name: 'BraftEditor',
        component: './DemoManage/BraftEditor',
      },
      {
        path: '/demoManage/antdTree',
        name: 'AntdTree',
        component: './DemoManage/AntdTree',
      },
    ],
  },
  {
    path: '/hooks',
    name: 'Hooks',
    component: './Hooks',
    icon: 'RedditOutlined',
  },
  {
    path: '/echarts',
    name: 'Echarts',
    component: './Echarts',
    icon: 'RadarChartOutlined',
  },
  {
    path: '/',
    redirect: '/hooks',
  },
  {
    component: './404',
  },
];
