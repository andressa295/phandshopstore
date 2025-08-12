# 📚 Documentação da API — Phandshop

Bem-vindo(a) à documentação oficial da API da **Phandshop**. Nossa API permite que desenvolvedores criem aplicativos e integrações para milhares de lojistas.

---

## 1. Introdução

A API da Phandshop é uma RESTful API que usa JSON para enviar e receber dados. Todos os dados são transmitidos com segurança via HTTPS.

---

## 2. Autenticação

Para acessar os endpoints da API, você deve usar uma chave de API que pode ser gerada no Painel de Desenvolvedores.

Todas as requisições devem incluir o cabeçalho `Authorization` com o token no formato `Bearer`:

```bash
Authorization: Bearer <SUA_CHAVE_DE_API>