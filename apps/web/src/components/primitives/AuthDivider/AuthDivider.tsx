import styles from './AuthDivider.module.css';

export interface AuthDividerProps {
  text: string;
}

export const AuthDivider = ({ text }: AuthDividerProps) => {
  return (
    <div className={styles.divider}>
      <span>{text}</span>
    </div>
  );
};
