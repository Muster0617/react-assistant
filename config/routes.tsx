export default [
  {
    path: '/hooks',
    name: 'Hooks',
    component: './Hooks',
    icon: 'RedditOutlined',
  },
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
        path: '/demoManage/hooks',
        name: 'Hooks',
        component: './DemoManage/Hooks',
      },
      {
        path: '/demoManage/braftEditor',
        name: 'BraftEditor',
        component: './DemoManage/BraftEditor',
      },
      {
        path: '/demoManage/QRCodeModal',
        name: 'QRCodeModal',
        component: './DemoManage/QRCodeModal',
      },
    ],
  },
  {
    path: '/echarts',
    name: 'Echarts',
    component: './Echarts',
    icon: 'RadarChartOutlined',
  },
  {
    path: '/form',
    component: './DemoManage/Module/ProForm',
    hideInMenu: true,
  },
  {
    path: '/',
    redirect: '/hooks',
  },
  {
    component: './404',
  },
];
