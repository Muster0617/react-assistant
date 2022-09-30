export default [
  {
    path: '/hooks',
    name: 'Hooks',
    component: './Hooks',
  },
  {
    path: '/proTable',
    name: 'ProTable',
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
