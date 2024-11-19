import { useEffect, useState } from "react";

export const useDebounce = (text: string, delay = 1000): string => {
  const [debouncedText, setDebouncedText] = useState("");

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setDebouncedText(text);
    }, delay);

    return () => clearInterval(timeoutID);
  }, [text]);

  return debouncedText;
};
