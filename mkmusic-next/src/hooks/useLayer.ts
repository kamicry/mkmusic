import { useCallback } from 'react';

declare global {
  interface Window {
    layer: any;
  }
}

export const useLayer = () => {
  const msg = useCallback((content: string, options?: any) => {
    if (typeof window !== 'undefined' && window.layer) {
      return window.layer.msg(content, options);
    }
    console.log('Layer msg:', content);
  }, []);

  const open = useCallback((options: any) => {
    if (typeof window !== 'undefined' && window.layer) {
      return window.layer.open(options);
    }
    console.log('Layer open:', options);
  }, []);

  const closeAll = useCallback((type?: string) => {
    if (typeof window !== 'undefined' && window.layer) {
      return window.layer.closeAll(type);
    }
  }, []);

  const close = useCallback((index: number) => {
    if (typeof window !== 'undefined' && window.layer) {
      return window.layer.close(index);
    }
  }, []);

  return { msg, open, closeAll, close };
};
