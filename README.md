# Bottons do Lucas — app

Sistema de custo, preços e vendas dos Bottons do Lucas.
React + Vite + Tailwind, com PWA (instala no celular e funciona offline).

## Rodar local

Precisa do Node 18+ (recomendado 20+).

```bash
npm install
npm run dev
```

Abre em http://localhost:5173

## Gerar a versão de produção

```bash
npm run build      # gera a pasta dist/
npm run preview    # testa o build localmente
```

## Publicar de graça

### GitHub Pages

> **Importante:** o GitHub Pages serve só arquivos estáticos. Não dá pra subir o código-fonte e apontar o Pages pra ele — ele não roda o Vite. É preciso **buildar** (`npm run build`) e publicar a pasta **`dist`**. O `base` já está relativo, então funciona em qualquer nome de repositório, sem configurar nada.

**Jeito automático (recomendado):** o projeto já vem com um GitHub Action em `.github/workflows/deploy.yml`.
1. Suba o projeto num repositório (branch `main`).
2. Em **Settings → Pages**, no "Source", escolha **GitHub Actions**.
3. Cada push no `main` builda e publica sozinho. O app fica em `https://SEU_USUARIO.github.io/NOME_DO_REPO/`.

> O "Source" **precisa** estar em **GitHub Actions** (se estiver em "Deploy from a branch", ele serve o branch cru e dá tela branca). Se aparecer "Canceling… higher priority… pages build and deployment", é normal: o GitHub descarta deploys antigos e mantém só o mais recente — espere a última execução ficar verde na aba **Actions**.

**Jeito manual:** com o remoto `origin` configurado, rode `npm run deploy` (builda e publica a `dist` no branch `gh-pages`) e em **Settings → Pages** aponte pro branch `gh-pages`.

### Netlify ou Vercel

Build command: `npm run build` · Publish directory: `dist`. O `base` relativo funciona igual.

## Instalar no celular (PWA)

Depois de abrir o site publicado uma vez:

- **Android/Chrome:** menu (⋮) → "Instalar app" / "Adicionar à tela inicial".
- **iPhone/Safari:** Compartilhar → "Adicionar à Tela de Início".

Instalado, abre como app e funciona offline.

## Instalar como app Android (APK)

Feito com Capacitor: o app roda numa WebView com os arquivos embutidos, então funciona offline sem precisar de servidor. Dentro do app, gerar PDF/imagem/backup abre a **folha de compartilhamento do Android** — dá pra mandar direto pro WhatsApp/Instagram ou salvar no aparelho. Os ícones e a splash já vêm gerados a partir do logo.

Precisa do **Android Studio** (com Android SDK e JDK 17).

1. `npm install`
2. Gerar o app e abrir no Android Studio:

   ```bash
   npm run android:open
   ```

   Isso faz o build web do app, roda o `cap sync` e abre o projeto `android/`.
   No Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
   O APK sai em `android/app/build/outputs/apk/debug/app-debug.apk`.

   Ou por linha de comando (com o SDK configurado):

   ```bash
   npm run android:sync
   cd android && ./gradlew assembleDebug
   ```

3. Passe o `app-debug.apk` pro celular e instale (precisa permitir "instalar apps de fontes desconhecidas").

- App id: `dev.bodao.bottons` (mude em `capacitor.config.json` se quiser; depois rode `npx cap sync android`).
- Sempre que mexer no código, rode `npm run android:sync` de novo antes de gerar o APK.

### Publicar na Play Store (opcional)

Gere um AAB assinado: no Android Studio, **Build → Generate Signed Bundle / APK → Android App Bundle**, criando/usando uma keystore. Ou `./gradlew bundleRelease` com a assinatura configurada.

## Dados e backup (importante)

Os dados ficam salvos **no localStorage do navegador/aparelho**. Ou seja:

- São por dispositivo (o celular e o PC têm dados separados).
- Se você limpar os dados do site/navegador, some tudo.

Por isso existe **Relatórios → Backup dos dados**: "Exportar" baixa um `.json` com tudo, e "Importar" carrega de volta (também serve pra levar os dados de um aparelho pro outro). Faça backup de vez em quando.

## O que a aba Relatórios gera

- Tabela de preços pro cliente: PDF (A4) + imagem story (9:16) + imagem feed (4:5).
- Tabela de custos (interna): PDF.
- Backup: exportar/importar `.json`.

## Estrutura

```
index.html
vite.config.js        # base do deploy + config do PWA
capacitor.config.json # config do app Android (Capacitor)
tailwind.config.js
postcss.config.js
public/               # ícones do PWA e favicon
android/              # projeto nativo Android (abre no Android Studio)
src/
  main.jsx            # ponto de entrada
  App.jsx             # o app inteiro
  index.css           # Tailwind + fontes + estilos base
  storage.js          # persistência no localStorage
```

## Observações

- Contato do rodapé, aviso de desconto (10 un = 15%) e as faixas da Shopee estão no código, onde você já tinha definido.
- Fontes (Space Grotesk / Inter / Space Mono) carregam do Google Fonts.
