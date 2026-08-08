# BridgLabs

Site institucional bilíngue da BridgLabs, construído com React, Vite e publicado como Cloudflare Worker com Static Assets.

O Worker é necessário porque a publicação também precisa controlar o host
canônico, a escolha de idioma na raiz e os headers de segurança. O build
estático preserva o conteúdo e os metadados das rotas `/pt/` e `/en/` sem
manter runtime de Next.js ou dependência de hosting da Vercel.

## Desenvolvimento

```bash
npm install
npm run dev
```

O site fica disponível em `http://127.0.0.1:3100`.

## Verificações

```bash
npm run lint
npm run build
npm run verify
```

## Publicação

```bash
npm run deploy
```

O Worker:

- redireciona `bridglabs.com` para `www.bridglabs.com` com 301;
- escolhe `/pt/` ou `/en/` na raiz por cookie e `Accept-Language`;
- normaliza `/pt` e `/en` para a forma com barra final;
- injeta headers de segurança e cache imutável nos assets versionados;
- serve o sitemap diretamente pelo Worker e mantém `robots.txt` sob o controle
  gerenciado do Cloudflare (incluindo content signals para crawlers).

As rotas localizadas mantêm canonical, Open Graph, `hreflang`, título,
descrição e o conteúdo bilíngue do site anterior. O site não tinha variáveis de
ambiente, API ou formulário server-side para migrar: o contato continua sendo
um link `mailto:`.

## Rollback

O deploy deve permanecer versionado no Cloudflare. Antes do cutover, mantenha
o projeto anterior disponível durante a janela de observação. Se uma versão
precisar ser revertida, promova a versão anterior no Cloudflare Dashboard ou
com `wrangler versions list`/`wrangler versions deploy <version-id>`; depois
repita os smoke tests de host, redirects e rotas localizadas. O DNS só deve ser
alterado de volta como último recurso, preservando os registros de e-mail.
