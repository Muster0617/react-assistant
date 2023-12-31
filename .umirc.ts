import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  layout: {
    locale: false,
    siderWidth: 208,
    navTheme: 'light',
    primaryColor: '#1890ff',
    layout: 'mix',
    contentWidth: 'Fluid',
    fixedHeader: false,
    fixSiderbar: true,
    colorWeak: false,
    title: 'React开发助手',
    pwa: false,
    logo: false,
    iconfontUrl: '',
  },
  chainWebpack(config, { env, webpack, createCSSRule }) {
    config.module
      .rule('docx')
      .test(/\.(docx)(\?.*)?$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'))
      .tap((options) => ({
        ...options,
        name: 'static' + '/[name].[ext]',
      }));
  },
  routes: [
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
      redirect: '/demo',
    },
  ],
  fastRefresh: {},
});
