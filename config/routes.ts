export default [
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
