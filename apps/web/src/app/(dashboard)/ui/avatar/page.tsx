'use client';

import Link from 'next/link';
import { Avatar, Card, Icon } from '@/components/ui';
import styles from '../showroom.module.css';

export default function AvatarShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Avatar</h1>
        <p className={styles.subtitle}>
          Avatars represent users or entities. They display images with fallback
          to initials.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sizes</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Avatar
                size="sm"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Felix"
              />
              <span className={styles.label}>sm</span>
            </div>
            <div className={styles.item}>
              <Avatar
                size="md"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
                alt="Aneka"
              />
              <span className={styles.label}>md</span>
            </div>
            <div className={styles.item}>
              <Avatar
                size="lg"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe"
                alt="Zoe"
              />
              <span className={styles.label}>lg</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Fallback</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Avatar size="md" alt="John Doe" />
              <span className={styles.label}>auto initial (J)</span>
            </div>
            <div className={styles.item}>
              <Avatar size="md" fallback="AB" />
              <span className={styles.label}>custom fallback</span>
            </div>
            <div className={styles.item}>
              <Avatar size="md" />
              <span className={styles.label}>no data (?)</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Usage Examples</h2>
        <Card className={styles.showcase}>
          <div className={styles.examples}>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>User list:</span>
              <Avatar
                size="sm"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=User1"
              />
              <Avatar
                size="sm"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=User2"
              />
              <Avatar
                size="sm"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=User3"
              />
              <Avatar size="sm" fallback="+5" />
            </div>
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
                  <code>size</code>
                </td>
                <td>
                  <code>'sm' | 'md' | 'lg'</code>
                </td>
                <td>
                  <code>'md'</code>
                </td>
                <td>The size of the avatar</td>
              </tr>
              <tr>
                <td>
                  <code>src</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>URL of the avatar image</td>
              </tr>
              <tr>
                <td>
                  <code>alt</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Alt text for the image (first letter used as fallback)</td>
              </tr>
              <tr>
                <td>
                  <code>fallback</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Custom fallback text when no image is provided</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
