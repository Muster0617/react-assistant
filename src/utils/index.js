/* eslint-disable no-param-reassign */
import { Tooltip, message } from 'antd';
import Clipboard from 'clipboard';

/**
 * 已知子节点找到所有父节点
 *
 * @param {[]} tree - 树
 * @param {string | number} value - 目标节点值
 * @param {object} config - { childrenKey:子树的key, key:节点值的key }
 * @returns {[]} 包含所有父节点值和目标节点值的数组
 */
export const getAllParentNode = (tree, value, config) => {
  const { childrenKey = 'children', key = 'id' } = config;
  const flatTreeNode = (tree, parentValue) =>
    tree?.reduce((pre, node) => {
      const children = node[childrenKey];
      return [
        ...pre,
        { ...node, parentValue },
        ...((children && children?.length > 0 && flatTreeNode(children, node[key])) || []),
      ];
    }, []);
  const handleParentNode = (tree, value) => {
    const falgList = [];
    let flagNode = tree?.find((node) => node[key] === value);
    while (flagNode) {
      falgList.unshift(flagNode[key]);
      flagNode = tree?.find((node) => node[key] === flagNode.parentValue);
    }
    return falgList;
  };
  return handleParentNode(flatTreeNode(tree), value);
};

/**
 * 超过最大字数显示省略号处理，并添加鼠标移入显示全部内容效果
 *
 * @param {string} text - 文字内容
 * @param {width} value - 表格项宽度
 * @returns {string | component} Tooltip组件或者文字内容
 */
export const handleTextEllipsis = (text = '', width = 240) => {
  const textSize = Math.floor(width / 14) - 3;
  if (text?.length > textSize) {
    return (
      <Tooltip
        title={<div style={{ maxHeight: '330px', overflowY: 'auto' }}>{text}</div>}
        overlayStyle={{
          maxWidth: '550px',
        }}
      >
        <span>{`${text?.slice(0, textSize)}...`}</span>
      </Tooltip>
    );
  }
  return <span>{text || '-'}</span>;
};

/**
 * 文件流导出下载
 *
 * @param {blob} blob - 文件流
 * @param {stirng} fileName - 导出的文件名
 * @returns {void}
 */
export const downloadByBlob = (blob, fileName = '默认导出') => {
  message.loading({ content: '导出中...', key: 'export' });
  const newBlob = new Blob([blob]);
  const elink = document.createElement('a');
  elink.download = `${fileName}.xlsx`;
  elink.style.display = 'none';
  elink.href = URL.createObjectURL(newBlob);
  document.body.appendChild(elink);
  elink.click();
  message.success({ content: '导出成功', key: 'export', duration: 2 });
  URL.revokeObjectURL(elink.href);
  document.body.removeChild(elink);
};

/**
 * 文字内容关键字高亮
 *
 * @param {stirng} text - 文字
 * @param {stirng} keyword - 关键字
 * @returns {html}
 */
export const renderTextHeightLight = (text = '', keyword = '') => {
  const reg = new RegExp(keyword, 'ig');
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: text?.replace(reg, `<font color="#4D9DE3">${keyword}</font>`),
      }}
    />
  );
};

/**
 * 去除字符串中的html标签
 *
 * @param {stirng} stirng - 字符串
 * @returns {stirng} 清洗好的字符串
 */
export const removeHtmlTag = (string = '') => {
  //去掉所有的html标记
  let newString = string?.replace(/<[^>]+>/g, '');
  //去掉空字符串
  newString = newString.replace(/\s/gi, '');
  newString = newString.replace(/&nbsp;/gi, '');
  return newString;
};

/**
 * 复制
 *
 * @param {className} stirng - 类名
 * @param {text} stirng - 要复印的内容
 */
export const copyText = (className, text) => {
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
};
