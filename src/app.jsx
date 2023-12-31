import { Button } from 'antd';

const open = (url) => {
  window.open(url);
};

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState() {
  return {
    collapsed: false,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: false,
    disableContentMargin: false,
    collapsed: initialState.collapsed || false,
    onCollapse: (value) => {
      setInitialState({ ...initialState, collapsed: value });
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
    childrenRender: (children) => {
      return <>{children}</>;
    },
    ...initialState?.settings,
  };
};
