# BridgLabs

Site institucional bilíngue da BridgLabs, construído com React, Vite e publicado como Cloudflare Worker só com Static Assets.

O Worker do site não tem script: a Cloudflare serve cada requisição direto dos
arquivos estáticos, que não são cobrados. Assim, nenhum volume de acessos, nem
um ataque, gera custo de execução.

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

O `npm run deploy` publica dois Workers:

- `bridglabs` (`wrangler.jsonc`), o site, só com assets:
  - `index.html` na raiz escolhe `/pt/` ou `/en/` no navegador, por cookie e
    idioma;
  - `html_handling` normaliza `/pt` e `/en` para a forma com barra final;
  - `public/_headers` define os headers de segurança e o cache imutável dos
    assets versionados;
  - `public/sitemap.xml` e `public/robots.txt` são arquivos estáticos.
- `bridglabs-stats` (`stats/wrangler.jsonc`), sem rotas, roda só no cron diário
  das 06:00 de São Paulo: lê os números dos produtos no PostHog e grava
  `stats.json` no bucket R2 `bridglabs-stats`, servido em
  `https://stats.bridglabs.com/stats.json`. A página parte de um snapshot
  embutido (`src/stats.ts`) e troca pelos números do arquivo quando ele chega.
  Precisa do secret `POSTHOG_API_KEY` (personal API key com escopo Query: Read):

  ```bash
  npx wrangler secret put POSTHOG_API_KEY -c stats/wrangler.jsonc
  ```

Configurado no painel da zona, fora do repositório:

- Redirect Rule `apex-to-www`: `bridglabs.com` → `www.bridglabs.com` com 301;
- Cache Rule `cache-stats`: cacheia `stats.bridglabs.com` ignorando a query
  string, para que nenhuma variação de URL chegue ao R2;
- Rate limiting rule `limit-site`: bloqueia por 10 s o IP que passar de 60
  requisições em 10 s nos três hosts.

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
