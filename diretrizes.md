# 📐 Diretrizes Oficiais de Design e Desenvolvimento — Phandshop

Bem-vindo(a) ao guia oficial de criação de temas para a **Phandshop**.  
Este documento garante que todos os temas publicados mantenham **padrão de qualidade, performance e identidade visual** condizente com a maior plataforma de e-commerce do Brasil.

Seguir estas diretrizes **aumenta suas chances de aprovação** e garante uma melhor experiência para o lojista e seus clientes.

---

## 1. Objetivo
Padronizar e alinhar o design e o código dos temas publicados na Phandshop, mantendo:
- Estética moderna e coerente.
- Performance de alto nível.
- Responsividade impecável.
- Acessibilidade para todos os usuários.

---

## 2. Padrões Visuais (Recomendados)

### 2.1 Paleta de Cores
- **Recomendação:** Priorize paletas com boa harmonia, usando no máximo 3 cores principais por página.
- **Exigência:** Cores devem atender a um contraste mínimo **WCAG AA** para garantir a legibilidade.
- O roxo da Phandshop (`#6b21a8`) não deve ser a cor principal dos temas, a menos que seja um tema da própria Phandshop.

### 2.2 Tipografia
- **Recomendação:** A fonte padrão do painel de controle e materiais oficiais é **Poppins**. Fique à vontade para usar outras fontes, desde que sejam legíveis e profissionais.
- **Exigência:** Não utilize mais de duas famílias tipográficas diferentes no mesmo tema para evitar poluição visual. O tamanho mínimo do texto deve ser de **16px no desktop** e **14px no mobile**.

### 2.3 Layout e Grid
- **Exigência:** O layout deve ser **mobile-first** (começar projetando no celular e expandir).
- Uso de grid consistente (12 colunas no desktop).
- Espaçamentos internos (padding) mínimos: **16px no mobile**, **24px no desktop**.
- Alinhamento centralizado ou justificado, evitando desalinhamentos visuais.

### 2.4 Imagens
- **Exigência:** Formatos aceitos: **WebP** (preferencial), PNG, JPG.
- Resolução mínima para banners: **1920x600 px**.
- Imagens devem ser otimizadas para carregamento rápido (compressão sem perda visível).
- Proporções consistentes em produtos (ex: 1:1 ou 4:5).

---

## 3. Experiência do Usuário (UX)
- Navegação clara e intuitiva.
- CTAs (botões de ação) visíveis e com texto objetivo.
- Hierarquia visual bem definida (o que é mais importante precisa “puxar o olho”).
- Evitar poluição visual ou excesso de elementos animados.
- Carregamento rápido: **Lighthouse Performance ≥ 90**.

---

## 4. Requisitos Técnicos

### 4.1 Estrutura do Código
- Compatível com **Next.js 15+** e **React 18+**.
- Uso de **CSS Modules** ou **Tailwind CSS** (quando aplicável).
- Sem dependências desnecessárias ou bibliotecas não utilizadas.
- Componentização clara e reaproveitável.

### 4.2 Performance
- Imagens com `next/image` ou equivalente.
- Lazy loading em imagens e componentes pesados.
- Evitar loops desnecessários e cálculos no render.
- Minificar CSS e JS.

### 4.3 SEO
- Uso correto de `<h1>`, `<h2>`... em ordem hierárquica.
- Meta tags relevantes.
- Atributos `alt` em todas as imagens.
- URLs amigáveis.

---

## 5. Acessibilidade
- Contraste mínimo **WCAG AA** em todos os textos e botões.
- Navegação por teclado funcional.
- Feedback visual em elementos interativos (hover, focus, active).
- Textos alternativos claros em imagens.

---

## 6. Boas Práticas de Entrega
- Estrutura de pastas:
```yaml
/components
/pages
/styles
/public/images
README.md