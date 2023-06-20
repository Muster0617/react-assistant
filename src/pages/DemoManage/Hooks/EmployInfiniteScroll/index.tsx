import { useRef, useState } from 'react';
import styles from './index.less';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

const wait = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, time);
  });
};

export default () => {
  const [isNoMore, setIsNoMore] = useState(false);
  const listRef = useRef();

  const loadMore = async (value) => {
    console.log(value, 'value');
    await wait(1000);
    return [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  };

  const [data, loading] = useInfiniteScroll(listRef, loadMore, isNoMore);

  return (
    <>
      <div className={styles.wrapper} ref={listRef}>
        {data?.map((item: any, key: number) => (
          <div key={key}>{item}</div>
        ))}
      </div>
      {loading && <div>加载中....</div>}
    </>
  );
};
