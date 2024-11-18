import { useState } from "react";

const TextInput = ({ name, placeholder, onChange, id, children }) => {
  const [value, setValue] = useState()

  return (
    <>
      <label htmlFor={id}>{children}</label> <br />
      <input name={name} onChange={onChange} placeholder={placeholder} /> <br />
    </>
  );
};

export default TextInput;
