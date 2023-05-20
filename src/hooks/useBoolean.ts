import { useState, useCallback } from "react";
const useBoolean = (
  initValue = false
): [value: boolean, open: () => void, close: () => void] => {
  const [value, setValue] = useState<boolean>(initValue);
  const open = useCallback(() => {
    setValue((value) => true);
  }, []);
  const close = useCallback(() => {
    setValue((value) => false);
  }, []);

  return [value, open, close];
};
export default useBoolean;
