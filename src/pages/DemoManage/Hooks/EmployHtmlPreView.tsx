import { Button } from 'antd';
import useHtmlPreView from '@/hooks/useHtmlPreView';

export default () => {
  return (
    <>
      <Button
        type="primary"
        onClick={useHtmlPreView({
          htmlCode: '<p>Hello <b>World!</b></p>',
        })}
        style={{
          marginBottom: 24,
        }}
      >
        HTML代码预览
      </Button>
      <div
        dangerouslySetInnerHTML={{
          __html: '<p>Hello <b>World!</b></p>',
        }}
      />
    </>
  );
};
