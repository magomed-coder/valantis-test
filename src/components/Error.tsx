import React from "react";
type ErrorMessageProps = {
  message: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return <div>Error: {message}</div>;
};

export default ErrorMessage;
