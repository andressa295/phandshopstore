// app/(site)/diretrizes/page.tsx
import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import styles from './Diretrizes.module.css';

export default async function DiretrizesPage() {
  const markdownPath = path.join(process.cwd(), 'diretrizes.md');
  const markdownFile = await fs.readFile(markdownPath, 'utf-8');
  
  const result = await remark().use(html).process(markdownFile);
  const contentHtml = result.toString();

  return (
    <main className={styles.container}>
      <article
        className={styles.markdownContent}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </main>
  );
}