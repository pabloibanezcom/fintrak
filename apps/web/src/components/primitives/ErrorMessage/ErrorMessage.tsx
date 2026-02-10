import styles from './ErrorMessage.module.css';

export interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;

  return <div className={styles.error}>{message}</div>;
};
