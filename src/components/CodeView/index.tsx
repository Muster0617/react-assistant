import { Divider, Button, Space } from 'antd';
import styles from './index.less';
import { useEffect } from 'react';
import { copyText } from '@/utils/index';
import Highlight, { defaultProps } from 'prism-react-renderer';
import lightCodeTheme from './theme';

export default (props) => {
  const { codes } = props;

  //   useEffect(() => {
  //     hljs.configure({
  //       // 忽略未经转义的 HTML 字符
  //       ignoreUnescapedHTML: true,
  //       languages: ['typescript'],
  //     });
  //     // 获取到内容中所有的code标签
  //     const codesDom = document.querySelectorAll('pre code');
  //     console.log(codesDom, 'jsx');
  //     codesDom.forEach((el) => {
  //       // 让code进行高亮
  //       hljs.highlightBlock(el as HTMLElement);
  //     });
  //   }, [codes]);

  return (
    <div className={styles.code_wrapper}>
      <div>
        <Space style={{ display: 'flex', justifyContent: 'end' }}>
          <Button className="code-copy" type="link" onClick={() => copyText('.code-copy', codes)}>
            Copy
          </Button>
        </Space>
      </div>
      <div className={styles.code_container}>
        <h2>代码：</h2>
        <Highlight {...defaultProps} code={codes} language="tsx" theme={lightCodeTheme}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })} key={i}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} key={key} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
};
