import React from "react";

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  required,
  ...props
}) => (
  <input
    {...props}
    className={`border p-2 rounded-md ${className ?? ""}`}
    {...(required ? { required: true } : {})}
  />
);

export default Input;
