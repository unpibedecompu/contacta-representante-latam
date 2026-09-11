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
- No hay dominio propio conectado todavía (solo el subdominio `workers.dev`).
  Pendiente: conectar dominio propio (Worker → Settings → Domains & Routes) y
  actualizar `SHARE_URL` en `components/ContactForm.tsx`.
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

- **Cloudflare Web Analytics** (pageviews, gratis/ilimitado): soportado en
  el código (`app/layout.tsx`) pero **falta configurar** — hay que agregar
  la env var `NEXT_PUBLIC_CF_BEACON_TOKEN` en el Worker (Settings →
  Variables) con el token de Cloudflare Dash → Web Analytics → Add a site.
- **Umami Cloud** (funnel: país elegido, mensaje generado, click en
  Gmail/Outlook, compartido): **ya conectado**. Website ID
  `693eaa79-33c9-4772-a9b1-37e21fd7c4e8`, cuenta asociada a
  `unpibedecompu@gmail.com`. Env var `NEXT_PUBLIC_UMAMI_WEBSITE_ID` ya
  seteada en el Worker.
  - Riesgo conocido y aceptado por ahora: el free tier de Umami Cloud
    ("Hobby") tiene un tope de **100.000 eventos/mes** (3 sitios, retención
    6 meses); si el sitio se viraliza (el objetivo del proyecto) podría
    taparse justo en el pico.
  - Evaluado 2026-09-11: **si se acerca al tope, pasar al plan Pro de Umami
    ($20/mes, 1M eventos/mes)** en vez de migrar a Cloudflare Analytics
    Engine. Analytics Engine hoy es gratis pero requiere que el sitio deje
    de ser un export estático puro (`assets.directory`) y tenga un Worker
    con `fetch` handler real que llame `writeDataPoint()` — mucho mayor
    costo de ingeniería que pagar $20/mes. No hay acción pendiente por
    ahora, solo vigilar el dashboard de Umami si hay un pico de tráfico.
- El hook `trackFunnel` (`lib/analytics.ts`) es vendor-agnostic — dispara a
  `window.umami`, `window.plausible`, `window.gtag` o `window.fathom`, el
  que esté cargado. Hoy solo Umami está cargado.

## Pendientes / ideas sueltas para retomar

- [ ] Confirmar que `NEXT_PUBLIC_CF_BEACON_TOKEN` se agregó (si se quiere
      Cloudflare Web Analytics además de Umami). Pasos: Cloudflare Dash →
      Web Analytics → Add a site → copiar el token del snippet → pegarlo
      como env var en el Worker (Settings → Variables and Secrets) →
      redeploy (es un `NEXT_PUBLIC_` var, se hornea en el build estático,
      así que hace falta un build nuevo para que tome efecto).
- [ ] Dominio propio.
- [ ] Reactivar más países en `lib/countries.ts` cuando haya datos
      verificados (ver `DATA_TODO.md`).
- [ ] Backend real de envío de mails — explícitamente fuera de alcance por
      ahora (ver `PROJECT_SPEC.md`), solo si hay funding.
