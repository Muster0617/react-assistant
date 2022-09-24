import Clipboard from 'clipboard';
import { message } from 'antd';

export function handleClipboard(className, text) {
  const clipboard = new Clipboard(className, {
    text: () => text,
  });
  clipboard.on('success', () => {
    message.success('复制成功');
    clipboard.destroy();
  });
  clipboard.on('error', () => {
    message.success('复制失败');
    clipboard.destroy();
  });
}
