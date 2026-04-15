import type { AlertType } from "../App";

type CustomAlertProps = {
  message: string;
  type?: AlertType;
};

function CustomAlert({ message, type = "info" }: CustomAlertProps) {
  return <div className={`custom-alert ${type}`}>{message}</div>;
}

export default CustomAlert;