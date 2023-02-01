import { PageLoading } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from 'umi';
import { Button } from 'antd';
// import { history } from 'umi';

const open = (url: string) => {
  window.open(url);
};

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState() {
  return {
    collapsed: false,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: false,
    disableContentMargin: false,
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    // footerRender: () => <Footer />,
    // onPageChange: () => {
    // const { location } = history;
    // // 如果没有登录，重定向到 login
    // if (!initialState?.currentUser && location.pathname !== loginPath) {
    //   history.push(loginPath);
    // }
    // },
    collapsed: initialState.collapsed || false,
    onCollapse: (e) => {
      setInitialState({ ...initialState, collapsed: e });
    },
    links: !initialState.collapsed
      ? [
        <Button key="1" type="link" onClick={() => open('https://v3.umijs.org/zh-CN')}>
          <span>UmiJS</span>
        </Button>,
        <Button
          key="1"
          type="link"
          onClick={() => open('https://ant-design.antgroup.com/components/overview-cn/')}
        >
          <span>Ant Design</span>
        </Button>,
        <Button
          key="2"
          type="link"
          onClick={() =>
            open('https://procomponents.ant.design/components/table/?current=1&pageSize=5')
          }
        >
          <span>Pro Components</span>
        </Button>,
      ]
      : [],
    menuHeaderRender: undefined,
    // menuItemRender: (item, dom) => {
    //   return (
    //     <div
    //       onClick={() => {
    //         if (item?.path !== history?.location?.pathname) {
    //           window.localStorage.removeItem('pro_table_search_data');
    //         }
    //         history.push(item?.path);
    //       }}
    //     >
    //       {dom}
    //     </div>
    //   );
    // },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return <>{children}</>;
    },
    ...initialState?.settings,
  };
};
