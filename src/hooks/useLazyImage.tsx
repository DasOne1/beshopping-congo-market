
import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseLazyImageOptions {
  src: string;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
  loading?: 'lazy' | 'eager';
}

export const useLazyImage = ({
  src,
  placeholder = '/shopping-cart-logo.svg',
  threshold = 0.1,
  rootMargin = '50px',
  loading = 'lazy',
}: UseLazyImageOptions) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && !imageLoaded && !error) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setImageLoaded(true);
        setError(false);
      };
      
      img.onerror = () => {
        setError(true);
        setImageSrc(placeholder);
      };
      
      img.src = src;
    }
  }, [inView, src, imageLoaded, error, placeholder]);

  return {
    ref,
    src: imageSrc,
    isLoaded: imageLoaded,
    isError: error,
    inView,
  };
};

export default useLazyImage;
