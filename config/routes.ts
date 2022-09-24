export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/hooks',
    name: 'Hooks',
    icon: 'smile',
    component: './Hooks',
  },
  {
    path: '/proTable',
    name: 'ProTable',
    icon: 'smile',
    component: './ProTable',
  },
  {
    path: '/',
    redirect: '/hooks',
  },
  {
    component: './404',
  },
];
