import { useEffect, useRef, useState } from 'react';

export default () => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef();

  useEffect(() => {

    ref.current?.addEventListener('mouseover', () => {
      setIsHovered(true);
    });

    ref.current?.addEventListener('mouseout', () => {
      setIsHovered(false);
    });
  }, []);

  return [ref, isHovered];
};
