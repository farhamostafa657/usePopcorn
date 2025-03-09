import { useEffect, useState } from "react";

export function useLocaLStorageState(initialState, key) {
  const [value, setValue] = useState(() => {
    const sortedValue = localStorage.getItem(key);
    console.log(sortedValue);
    return initialState ? JSON.parse(sortedValue) : [];
  });

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
