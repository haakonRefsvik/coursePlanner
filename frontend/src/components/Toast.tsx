import { useEffect, useState } from "react";
import "./Toast.scss";

type ToastProps = {
  message: string;
  duration?: number; // in ms
  onClose?: () => void;
};

export function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return visible && <div className="toast">{message}</div>;
}
