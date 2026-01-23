'use client';

import Link from 'next/link';
import { Card, Icon } from '@/components/ui';
import styles from '../showroom.module.css';
import typoStyles from './page.module.css';

const fontSizes = [
  { name: 'xs', variable: '--font-size-xs', value: '0.75rem (12px)' },
  { name: 'sm', variable: '--font-size-sm', value: '0.875rem (14px)' },
  { name: 'base', variable: '--font-size-base', value: '1rem (16px)' },
  { name: 'lg', variable: '--font-size-lg', value: '1.125rem (18px)' },
  { name: 'xl', variable: '--font-size-xl', value: '1.25rem (20px)' },
  { name: '2xl', variable: '--font-size-2xl', value: '1.5rem (24px)' },
  { name: '3xl', variable: '--font-size-3xl', value: '1.875rem (30px)' },
  { name: '4xl', variable: '--font-size-4xl', value: '2.25rem (36px)' },
  { name: '5xl', variable: '--font-size-5xl', value: '2.75rem (44px)' },
];

const fontWeights = [
  { name: 'Normal', variable: '--font-weight-normal', value: '400' },
  { name: 'Medium', variable: '--font-weight-medium', value: '500' },
  { name: 'Semibold', variable: '--font-weight-semibold', value: '600' },
  { name: 'Bold', variable: '--font-weight-bold', value: '700' },
];

const lineHeights = [
  { name: 'Tight', variable: '--line-height-tight', value: '1.25' },
  { name: 'Normal', variable: '--line-height-normal', value: '1.5' },
  { name: 'Relaxed', variable: '--line-height-relaxed', value: '1.625' },
];

export default function TypographyShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Typography</h1>
        <p className={styles.subtitle}>
          The typography system uses Plus Jakarta Sans as the primary font with
          a modular scale for consistent sizing.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Font Family</h2>
        <Card className={styles.showcase}>
          <div className={typoStyles.fontFamilies}>
            <div className={typoStyles.fontFamily}>
              <span className={typoStyles.fontFamilySample}>
                Plus Jakarta Sans
              </span>
              <code className={typoStyles.fontFamilyVariable}>
                --font-family-sans
              </code>
            </div>
            <div className={typoStyles.fontFamily}>
              <span
                className={typoStyles.fontFamilySample}
                style={{ fontFamily: 'var(--font-mono, monospace)' }}
              >
                JetBrains Mono
              </span>
              <code className={typoStyles.fontFamilyVariable}>
                --font-family-mono
              </code>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Headings</h2>
        <Card className={styles.showcase}>
          <div className={typoStyles.headings}>
            <div className={typoStyles.headingRow}>
              <span className={typoStyles.h1}>Heading 1</span>
              <span className={typoStyles.headingMeta}>4xl / Bold / Tight</span>
            </div>
            <div className={typoStyles.headingRow}>
              <span className={typoStyles.h2}>Heading 2</span>
              <span className={typoStyles.headingMeta}>3xl / Bold / Tight</span>
            </div>
            <div className={typoStyles.headingRow}>
              <span className={typoStyles.h3}>Heading 3</span>
              <span className={typoStyles.headingMeta}>
                2xl / Semibold / Tight
              </span>
            </div>
            <div className={typoStyles.headingRow}>
              <span className={typoStyles.h4}>Heading 4</span>
              <span className={typoStyles.headingMeta}>
                xl / Semibold / Tight
              </span>
            </div>
            <div className={typoStyles.headingRow}>
              <span className={typoStyles.h5}>Heading 5</span>
              <span className={typoStyles.headingMeta}>
                lg / Medium / Normal
              </span>
            </div>
            <div className={typoStyles.headingRow}>
              <span className={typoStyles.h6}>Heading 6</span>
              <span className={typoStyles.headingMeta}>
                base / Medium / Normal
              </span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Body Text</h2>
        <Card className={styles.showcase}>
          <div className={typoStyles.bodyTexts}>
            <div className={typoStyles.bodyRow}>
              <p className={typoStyles.bodyLg}>
                Body Large - Used for prominent paragraphs and lead text.
              </p>
              <span className={typoStyles.bodyMeta}>lg / Relaxed</span>
            </div>
            <div className={typoStyles.bodyRow}>
              <p className={typoStyles.body}>
                Body - The default text style for most content throughout the
                application.
              </p>
              <span className={typoStyles.bodyMeta}>base / Normal</span>
            </div>
            <div className={typoStyles.bodyRow}>
              <p className={typoStyles.bodySm}>
                Body Small - Used for secondary information and supporting text.
              </p>
              <span className={typoStyles.bodyMeta}>sm / Normal</span>
            </div>
            <div className={typoStyles.bodyRow}>
              <p className={typoStyles.bodyXs}>
                Body Extra Small - Used for captions, timestamps, and metadata.
              </p>
              <span className={typoStyles.bodyMeta}>xs / Normal</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Font Sizes</h2>
        <Card className={styles.propsCard}>
          <table className={styles.propsTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Variable</th>
                <th>Value</th>
                <th>Preview</th>
              </tr>
            </thead>
            <tbody>
              {fontSizes.map((size) => (
                <tr key={size.name}>
                  <td>
                    <code>{size.name}</code>
                  </td>
                  <td>
                    <code>{size.variable}</code>
                  </td>
                  <td>{size.value}</td>
                  <td style={{ fontSize: `var(${size.variable})` }}>Aa</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Font Weights</h2>
        <Card className={styles.showcase}>
          <div className={typoStyles.weights}>
            {fontWeights.map((weight) => (
              <div key={weight.name} className={typoStyles.weightItem}>
                <span
                  className={typoStyles.weightSample}
                  style={{ fontWeight: `var(${weight.variable})` }}
                >
                  {weight.name}
                </span>
                <span className={typoStyles.weightValue}>{weight.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Line Heights</h2>
        <Card className={styles.showcase}>
          <div className={typoStyles.lineHeights}>
            {lineHeights.map((lh) => (
              <div key={lh.name} className={typoStyles.lineHeightItem}>
                <div className={typoStyles.lineHeightInfo}>
                  <span className={typoStyles.lineHeightName}>{lh.name}</span>
                  <code className={typoStyles.lineHeightVariable}>
                    {lh.variable}
                  </code>
                </div>
                <p
                  className={typoStyles.lineHeightSample}
                  style={{ lineHeight: `var(${lh.variable})` }}
                >
                  The quick brown fox jumps over the lazy dog. This sample text
                  demonstrates the line height.
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Money / Numbers</h2>
        <Card className={styles.showcase}>
          <div className={typoStyles.moneyExamples}>
            <div className={typoStyles.moneyRow}>
              <span className={typoStyles.moneyLg}>$12,345.67</span>
              <span className={typoStyles.moneyMeta}>money-lg</span>
            </div>
            <div className={typoStyles.moneyRow}>
              <span className={typoStyles.money}>$12,345.67</span>
              <span className={typoStyles.moneyMeta}>money</span>
            </div>
            <div className={typoStyles.moneyRow}>
              <span className={typoStyles.moneySm}>$12,345.67</span>
              <span className={typoStyles.moneyMeta}>money-sm</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
