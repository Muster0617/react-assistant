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
    name: 'Demo',
    icon: 'InsertRowAboveOutlined',
    routes: [
      {
        path: '/demoManage/map',
        name: 'Map',
        component: './DemoManage/Map',
      }
    ]
  },
  {
    path: '/',
    redirect: '/hooks',
  },
  {
    component: './404',
  },
];
