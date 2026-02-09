'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, ColorPicker, Icon } from '@/components/ui';
import styles from '../showroom.module.css';

export default function ColorPickerShowroomPage() {
  const [selectedColor1, setSelectedColor1] = useState('#3B82F6');
  const [selectedColor2, setSelectedColor2] = useState('#EF4444');
  const [selectedColor3, setSelectedColor3] = useState('#10B981');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>ColorPicker</h1>
        <p className={styles.subtitle}>
          Color selection component with preset swatches and optional custom
          color input for forms and settings.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Basic</h2>
        <Card className={styles.showcase}>
          <div className={styles.column}>
            <ColorPicker value={selectedColor1} onChange={setSelectedColor1} />
            <div className={styles.colorPreview}>
              <span className={styles.label}>Selected:</span>
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: selectedColor1 }}
              />
              <code>{selectedColor1}</code>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>With Label</h2>
        <Card className={styles.showcase}>
          <div className={styles.column}>
            <ColorPicker
              label="Brand Color"
              value={selectedColor2}
              onChange={setSelectedColor2}
            />
            <div className={styles.colorPreview}>
              <span className={styles.label}>Selected:</span>
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: selectedColor2 }}
              />
              <code>{selectedColor2}</code>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>With Custom Color</h2>
        <Card className={styles.showcase}>
          <div className={styles.column}>
            <ColorPicker
              label="Custom Color"
              value={selectedColor3}
              onChange={setSelectedColor3}
              allowCustom
            />
            <div className={styles.colorPreview}>
              <span className={styles.label}>Selected:</span>
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: selectedColor3 }}
              />
              <code>{selectedColor3}</code>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Disabled</h2>
        <Card className={styles.showcase}>
          <div className={styles.column}>
            <ColorPicker
              label="Disabled"
              value="#64748B"
              onChange={() => {}}
              disabled
            />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Custom Color Palette</h2>
        <Card className={styles.showcase}>
          <div className={styles.column}>
            <ColorPicker
              label="Pastel Colors"
              value="#FFB3BA"
              onChange={() => {}}
              colors={[
                '#FFB3BA',
                '#FFDFBA',
                '#FFFFBA',
                '#BAFFC9',
                '#BAE1FF',
                '#D4BAFF',
              ]}
            />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Props</h2>
        <Card className={styles.propsCard}>
          <table className={styles.propsTable}>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>value</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Currently selected color (hex format)</td>
              </tr>
              <tr>
                <td>
                  <code>onChange</code>
                </td>
                <td>
                  <code>(color: string) =&gt; void</code>
                </td>
                <td>—</td>
                <td>Callback when color is selected</td>
              </tr>
              <tr>
                <td>
                  <code>colors</code>
                </td>
                <td>
                  <code>string[]</code>
                </td>
                <td>12 preset colors</td>
                <td>Array of hex colors to display as swatches</td>
              </tr>
              <tr>
                <td>
                  <code>label</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Label text displayed above the color picker</td>
              </tr>
              <tr>
                <td>
                  <code>disabled</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>Disables color selection</td>
              </tr>
              <tr>
                <td>
                  <code>allowCustom</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>Enables custom color input with hex color picker</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Usage</h2>
        <Card className={styles.showcase}>
          <div className={styles.examples}>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Basic:</span>
              <code>{'<ColorPicker value={color} onChange={setColor} />'}</code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>With label:</span>
              <code>
                {
                  '<ColorPicker label="Brand Color" value={color} onChange={setColor} />'
                }
              </code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Custom colors:</span>
              <code>
                {
                  '<ColorPicker value={color} onChange={setColor} allowCustom />'
                }
              </code>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
