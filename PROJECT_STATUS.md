# Estado del proyecto

Última actualización: 2026-09-11.

## Deploy

- **Live URL:** https://contacta-representante-latam.unpibedecompu.workers.dev/
- Hosteado en **Cloudflare Workers** (el dashboard nuevo de Cloudflare unificó
  Pages dentro de Workers — esto ya NO es un proyecto "Pages" clásico).
- Conectado por Git a `unpibedecompu/contacta-representante-latam`, branch
  `master` → build y deploy automático en cada push.
- Build command: `npm run build` · Deploy command: `npx wrangler deploy`.
- El repo tiene `wrangler.jsonc` (`assets.directory: "out"`) — **necesario**:
  sin él, `wrangler deploy` autodetecta "Next.js" e intenta migrar al
  adaptador OpenNext (para SSR), lo cual rompe porque este proyecto usa
  `output: "export"` (build estático). Si algún día se borra o se toca ese
  archivo y el deploy falla con `ENOENT: .../.next/standalone/.../pages-manifest.json`,
  es por esto.
- **Dominio propio conectado:** `noesinevitable.org` (comprado vía Cloudflare
  Registrar, agregado en Worker → Settings → Domains → Custom Domains,
  dominio raíz sin subdominio). `SHARE_URL` en `components/ContactForm.tsx`
  ya apunta ahí. El `workers.dev` sigue funcionando en paralelo.
- Nota de acceso: para pushear a este repo hace falta la cuenta de GitHub
  **`unpibedecompu`** (dueña del repo). La cuenta `grecsoc` (activa por
  default en esta máquina) no tiene permisos — da 403. Cambiar con
  `gh auth switch --user unpibedecompu` antes de pushear si hace falta.

## Alcance de países

- **Limitado a Argentina solamente** (decisión 2026-09-11, ver
  `lib/countries.ts`). El resto de los países de la fase 1 original
  (Bolivia, Brasil, Chile, Colombia, Costa Rica, Ecuador, El Salvador,
  España, Guatemala, Honduras, México, Nicaragua, Panamá, Paraguay,
  Rep. Dominicana, Uruguay) está comentado en ese archivo, no borrado —
  reactivar descomentando cuando haya datos verificados de más países.
- Como consecuencia, el selector de país en el paso 1 se auto-selecciona
  (un solo botón, sin necesidad de click) — ver `ContactForm.tsx`.
- Datos de representantes (`data/representatives.json`) igual tienen AR, CO
  y MX cargados; el filtro a un solo país pasa por `COUNTRIES`
  (`lib/countries.ts`), no por los datos. Ver `DATA_TODO.md` para el estado
  de carga/verificación de representantes por país.

## Analytics

- Los env vars de analytics (`NEXT_PUBLIC_CF_BEACON_TOKEN`,
  `NEXT_PUBLIC_UMAMI_WEBSITE_ID`) son build-time, no runtime — como el
  Worker es 100% static assets (`assets.directory`), **no** existe la
  sección "Runtime variables and secrets" de Settings para este proyecto
  (esa da error "cannot be added to a Worker that only has static
  assets"). Van en **Worker → Settings → Builds → Variables and
  secrets**, que es lo que consume el pipeline de Git-connected Builds al
  correr `npm run build`. Cualquier cambio ahí necesita un push nuevo
  (aunque sea un commit vacío) para tomar efecto, porque Next.js hornea
  esos valores en el HTML/JS estático en build time.
- **Cloudflare Web Analytics** (pageviews, gratis/ilimitado — confirmado
  en la doc oficial de Cloudflare, sin tope de eventos, solo un soft
  limit de 10 sitios por cuenta): **conectado y confirmado funcionando**
  desde 2026-09-11. Token `NEXT_PUBLIC_CF_BEACON_TOKEN` seteado en Builds.
- **Umami Cloud** (funnel: país elegido, mensaje generado, click en
  Gmail/Outlook, compartido): **conectado y confirmado funcionando** desde
  2026-09-11, en cuenta separada `lucasvitali001@gmail.com` (no
  `unpibedecompu@gmail.com`). Website "contacta-representante-latam",
  domain `contacta-representante-latam.unpibedecompu.workers.dev`.
  Website ID `948684fb-65ac-48d6-bd97-770b72bd8440`, seteado en
  `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (Builds → Variables and secrets).
  - Bug histórico (encontrado y arreglado 2026-09-11): el ID que estaba
    documentado acá antes (`693eaa79-33c9-4772-a9b1-37e21fd7c4e8`) **no
    era un website ID** — era el Account ID de la cuenta
    `unpibedecompu@gmail.com` en Umami, copiado por error. Por eso el
    tracking nunca funcionó pese a que el código y el env var estaban
    "seteados" — apuntaban a un sitio que no existía. Verificado con
    curl al HTML en vivo (sin script de Umami) y confirmado en el
    dashboard de Umami (la cuenta `unpibedecompu@gmail.com` nunca tuvo un
    sitio para este proyecto, solo "unpibedecompu links").
  - Se usa una cuenta de Umami separada (`lucasvitali001@gmail.com`)
    porque el plan free ("Hobby") de Umami permite **1 solo sitio por
    cuenta** (no 3 como se pensó inicialmente — dato incorrecto de una
    fuente no oficial), y la cuenta `unpibedecompu@gmail.com` ya tiene su
    slot ocupado por `unpibedecompu links` (unpibedecompu.github.io).
  - Riesgo conocido y aceptado por ahora: tope de **100.000 eventos/mes**
    en el plan Hobby de Umami (6 meses de retención). Si el sitio se
    viraliza (el objetivo del proyecto) podría taparse justo en el pico.
  - Evaluado 2026-09-11: **si se acerca al tope, pasar al plan Pro de
    Umami ($20/mes, 1M eventos/mes, hasta 20 sitios)** en vez de migrar a
    Cloudflare Analytics Engine. Analytics Engine hoy es gratis pero
    requiere que el sitio deje de ser un export estático puro y tenga un
    Worker con `fetch` handler real que llame `writeDataPoint()` — mucho
    mayor costo de ingeniería que pagar $20/mes. No hay acción pendiente
    por ahora, solo vigilar el dashboard de Umami si hay un pico de
    tráfico.
- El hook `trackFunnel` (`lib/analytics.ts`) es vendor-agnostic — dispara a
  `window.umami`, `window.plausible`, `window.gtag` o `window.fathom`, el
  que esté cargado. Hoy solo Umami está cargado.

## Pendientes / ideas sueltas para retomar

- [ ] Reactivar más países en `lib/countries.ts` cuando haya datos
      verificados (ver `DATA_TODO.md`).
- [ ] Backend real de envío de mails — explícitamente fuera de alcance por
      ahora (ver `PROJECT_SPEC.md`), solo si hay funding.
