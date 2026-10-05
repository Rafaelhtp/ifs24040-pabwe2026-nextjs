import { useState, type ChangeEvent } from "react";

export function useInput(initialValue: string = "") {
  const [value, setValue] = useState(initialValue);

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | string
  ) => {
    if (typeof e === "string") {
      setValue(e);
    } else {
      setValue(e.target.value);
    }
  };

  return [value, onChange, setValue] as const;
}

export default useInput;
