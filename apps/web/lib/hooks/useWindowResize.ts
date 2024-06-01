'use client';
import { useEffect } from "react";

const useWindowResize = (callBack: (e?: Event) => void, dep: React.DependencyList) => {
  useEffect(() => {
    callBack()
    window.addEventListener('resize', callBack);
    return () => window.removeEventListener('resize', callBack);
  }, dep);
};

export default useWindowResize;
