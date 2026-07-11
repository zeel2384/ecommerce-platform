import { useEffect, useState } from "react";

const getWidth = () =>
  typeof window !== "undefined" ? window.innerWidth : 1024;

const useViewport = () => {
  const [width, setWidth] = useState(getWidth());

  useEffect(() => {
    const onResize = () => setWidth(getWidth());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    width,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
  };
};

export default useViewport;
