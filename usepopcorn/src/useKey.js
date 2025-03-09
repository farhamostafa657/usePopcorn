import { useEffect } from "react";

export function useKey(key, callBack) {
  useEffect(() => {
    function callEvent(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        callBack();
      }
    }

    document.addEventListener("keydown", callEvent);

    return function () {
      document.removeEventListener("keydown", callEvent);
    };
  }, [key, callBack]);
}
