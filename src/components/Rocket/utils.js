import { Tooltip, message } from 'antd';

/**
 * 判断是否是JSON数据类型
 *
 * @param {string} value - 要判断的值
 * @returns {boolean} true | false
 */
export const isJSON = value => {
  if (typeof value === 'string') {
    try {
      const obj = JSON.parse(value);
      if (typeof obj === 'object' && obj) {
        return true;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
};

/**
 * 获取localStorage里的值，区别是能判断是否后JSON数据并解析
 *
 * @param {string} key - key
 * @returns {any} 获取的数据
 */
export const getLocalStorage = key => {
  const data = window.localStorage.getItem(key);

  return isJSON(data) ? JSON.parse(data) : data;
};

/**
 * 设置localStorage，区别是能数据类型为对象或者数组的转换为JSON
 *
 * @param {string} key - key
 * @param {value} key - 值
 * @returns {} 无
 */
export const setLocalStorage = (key, value) => {
  const type = typeof value;
  if (type === 'object' || type === 'function') {
    window.localStorage.setItem(key, JSON.stringify(value));
  } else {
    window.localStorage.setItem(key, value);
  }
};

/**
 * 超过最大字数显示省略号处理，并添加鼠标移入显示全部内容效果
 *
 * @param {string | number} value - 文字内容
 * @param {number} width - 表格项宽度
 * @returns {string | component} Tooltip组件或者文字内容
 */
export const handleTextEllipsis = (value = '', width = 240) => {
  const text = String(value)

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
