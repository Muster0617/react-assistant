import styles from './FormTitle.less';

export default ({ title = '' }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.line} />
      <div className={styles.text}>{title}</div>
    </div>
  );
};
