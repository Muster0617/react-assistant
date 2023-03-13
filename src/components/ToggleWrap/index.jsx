import classNames from 'classnames';
import React from 'react';

/**
 * 一个根据判断条件切换样式的组件
 *
 * @param {string} className - 类名
 * @param {stirng} isClassName - 条件为true时应用的类名
 * @param {stirng} noClassName - 条件为false时应用的类名
 * @param {boolean} condition - 判断条件
 * @param {component} children - 子组件
 * @param {function} onClick - 点击函数
 * @returns {htmlElement} 文档元素
 */

export default (props) => {
  const { className, isClassName, noClassName, condition, children, onClick } = props;
  return (
    <div className={classNames(className, condition ? isClassName : noClassName)} onClick={onClick}>
      {children}
    </div>
  );
};
