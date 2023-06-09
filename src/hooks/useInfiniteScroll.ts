import { useEffect, useState } from 'react';

const debounce = (func, delay) => {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
};

const useInfiniteScroll = (listRef, loadMore, isNorMore) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState(1);

  const hanldeLoadMore = async () => {
    setLoading(true);
    const res = await loadMore(current);
    setData([...data, ...res]);
    setLoading(false);
    setCurrent(current + 1);
  };

  const handleScroll = debounce(() => {
    const clientHeight = listRef.current.clientHeight;
    const scrollTop = listRef.current.scrollTop;
    const scrollHeight = listRef.current.scrollHeight;
    if (clientHeight + scrollTop >= scrollHeight) {
      !isNorMore && !loading && hanldeLoadMore();
    }
  }, 20);

  useEffect(() => {
    hanldeLoadMore();
  }, []);

  useEffect(() => {
    listRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      listRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [current]);

  return [data, loading];
};

export default useInfiniteScroll;
