import Link from 'next/link';

import styles from './Footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Link href="/ui" className={styles.link}>
        Design System
      </Link>
      <span className={styles.separator}>|</span>
      <p className={styles.copyright}>
        Designed and developed by{' '}
        <a
          href="https://www.pabloibanez.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Pablo Ibanez
        </a>{' '}
        &copy; {currentYear}
      </p>
    </footer>
  );
}
