// app/(site)/docs-api/page.tsx
import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import styles from './Docs.module.css';

export default async function DocsApiPage() {
  try {
    const markdownPath = path.join(process.cwd(), 'api-docs.md');
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
  } catch (error) {
    console.error("Erro ao ler ou renderizar o arquivo de documentação:", error);
    return (
      <main className={styles.container}>
        <div className={styles.errorMessage}>
          <h1>Erro 404</h1>
          <p>A documentação da API não foi encontrada.</p>
          <p>Por favor, certifique-se de que o arquivo <code>api-docs.md</code> existe na raiz do seu projeto.</p>
        </div>
      </main>
    );
  }
}