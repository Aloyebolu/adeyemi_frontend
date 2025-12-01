import { useEffect, useState } from "react";

export const useSticky = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef) {
        const rect = elementRef.getBoundingClientRect();
        setIsSticky(rect.top <= 24);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementRef]);

  return [setElementRef, isSticky] as const;
};