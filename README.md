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

## Imagem de compartilhamento

`public/og.png` (1200×630) é a imagem que aparece quando o link do site é
compartilhado. Ela é capturada de `og.html`, uma página só de desenvolvimento
que monta a mesma cena 3D da abertura com o nome por cima; essa página não
entra no build. Para gerar de novo, com `npm run dev` rodando:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --enable-unsafe-swiftshader --use-angle=swiftshader --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --virtual-time-budget=9000 --screenshot=public/og.png \
  http://127.0.0.1:3100/og.html
```

O Chrome grava o arquivo e pode ficar aberto depois; encerre com Ctrl+C.

## Publicação

Todo push na `main` publica sozinho: o workflow `.github/workflows/ci.yml`
roda `npm run verify` e, se passar, `npm run deploy`. Pull requests rodam só a
verificação. O deploy usa o ambiente `production` do GitHub, que precisa dos
secrets `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`.

Como só o que está no Git é publicado, arquivos locais fora do controle de
versão em `public/` não vão para o ar por esse caminho.

Para publicar à mão, a partir da sua máquina:

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
