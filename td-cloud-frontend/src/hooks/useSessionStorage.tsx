import { useEffect, useState } from "react";

const useSessionStorage = (key: string, initialValue: string) => {
  const [value, setValue] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(key) || initialValue;
    }
    return JSON.stringify(initialValue);
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, value);
    }
  }, [key, value]);

  return [value, setValue] as const;
};

export default useSessionStorage;
