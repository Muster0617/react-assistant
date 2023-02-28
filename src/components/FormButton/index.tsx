import { Button } from 'antd';
import styles from './index.less';

export default ({
  buttonClick,
  buttonName,
  label,
  labelStyle,
  required,
  buttonProps,
}: {
  buttonClick: () => {};
  buttonName: string;
  label: string;
  labelStyle: object;
  required: boolean;
  buttonProps: object;
}) => {
  return (
    <div className={styles.form_item}>
      <div className={styles.form_item_label} style={{ ...labelStyle }}>
        {required && (
          <div
            style={{
              color: '#ff4d4f',
              marginRight: 4,
            }}
          >
            *
          </div>
        )}
        {label}
        <span style={{ marginLeft: 2, marginRight: 8 }}>:</span>
      </div>
      <Button onClick={buttonClick} {...buttonProps}>
        {buttonName}
      </Button>
    </div>
  );
};
