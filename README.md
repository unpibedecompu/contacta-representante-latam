# Contacta a tu Representante — LatAm + España

Formulario web para que cualquier persona de Latinoamérica y España le mande un
email pre-escrito (editable) a sus representantes políticos sobre los riesgos del
desarrollo de IA de frontera.

Ver [`PROJECT_SPEC.md`](./PROJECT_SPEC.md) para el detalle de alcance y decisiones.
Idea basada en <https://controlai.org/take-action>.

## Estado

Fase 1 — MVP. Envío por `mailto:` (sin backend, costo cero). El usuario manda el
mail desde su propio cliente de correo.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- **Export estático** (`output: "export"` → carpeta `out/`). Sin servidor ni
  funciones por request → gratis y sin límites de tráfico en Cloudflare Pages.
- Analytics: Cloudflare Web Analytics (pageviews, gratis) + hooks vendor-agnósticos
  para eventos de embudo (`lib/analytics.ts`). **Nada** trackea el envío real.
- Datos de representantes: `data/representatives.json` estático (sin base de datos)

## Correr localmente

```bash
npm install
npm run dev        # http://localhost:3000
```

En dev se muestran también los representantes con `verified: false` para poder
probar la UI. En producción (`NODE_ENV=production`) sólo se sirven los
verificados.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | servidor de desarrollo (`localhost:3000`) |
| `npm run build` | build + export estático a `out/` |
| `npm run preview` | build y sirve `out/` localmente (`localhost:4173`) |
| `npm run lint` | ESLint (config de Next) |
| `npm run check:data` | valida `data/representatives.json` contra las reglas del spec |

## Flujo del usuario

1. **Paso 1** — elegí país (auto-sugerido por IP vía `/cdn-cgi/trace` de
   Cloudflare, editable), `provincia/estado`, nombre y (opcional) email →
   "Generar mi mensaje".
2. **Paso 2** — elegí a qué representante escribirle, revisá/editá asunto y
   cuerpo → "Abrir mi cliente de mail" (genera `mailto:` y lo abre).
   Si el cliente no abre, aparece un fallback para copiar el mensaje.
3. **Paso 3** — confirmación + botones para compartir (WhatsApp / X / Facebook).

## Datos de representantes

`data/representatives.json` es un array de objetos:

```jsonc
{
  "country": "AR",                       // ISO alpha-2
  "region": "Córdoba",                   // provincia/estado, o null si es cargo nacional
  "office": "diputado_nacional",         // ver PROJECT_SPEC para valores válidos
  "channel": "email",                    // "email" (default) | "form"
  "email": "email@hcdn.gob.ar",          // "" si channel es "form"
  "formUrl": "https://...",              // obligatorio si channel es "form"
  "name": "Nombre Apellido",
  "party": "Partido",                    // opcional, sólo para la UI
  "verified": false,                     // true SOLO si se chequeó contra la fuente oficial
  "source": "https://www.hcdn.gob.ar/..." // URL de la fuente oficial
}
```

- **`channel: "email"`** → se abre `mailto:`. **`channel: "form"`** → el usuario
  copia el mensaje y se le abre `formUrl` (para cargos que sólo tienen formulario
  web, ej. la Presidencia de México).
- Estado de carga y pendientes: **[`DATA_TODO.md`](./DATA_TODO.md)**. Hoy: AR y CO
  con datos oficiales (`verified: true`), MX cargado pero sin verificar (sitios
  geo-bloqueados) → no se muestra en producción todavía.

## Deploy — Cloudflare Pages (gratis, tráfico ilimitado)

El plan free de Cloudflare Pages sirve assets estáticos con **requests y ancho de
banda ilimitados** (único límite real: 500 builds/mes). Como el sitio es un
export estático que se sirve desde el CDN, aguanta picos virales sin costo.

**Setup (una vez):**

1. Cloudflare Dash → Workers & Pages → Create → Pages → Connect to Git → elegir
   este repo.
2. Build settings:
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Build output directory: `out`
   - Root directory: `strategy/contacta_representante_latam` (este subdirectorio)
3. (Opcional) Analytics: Cloudflare Dash → Web Analytics → Add a site → copiar el
   token → en Pages → Settings → Environment variables agregar
   `NEXT_PUBLIC_CF_BEACON_TOKEN = <token>`.
4. Conectar dominio propio (Pages → Custom domains) y actualizar `SHARE_URL` en
   `components/ContactForm.tsx`.

La detección de país usa `/cdn-cgi/trace`, que Cloudflare responde
automáticamente en cualquier sitio que aloje. En local ese endpoint no existe →
el país arranca sin preseleccionar y el usuario elige a mano.

**Deploy manual (alternativa, sin Git):**

```bash
npm run build
npx wrangler@latest pages deploy out --project-name contacta-representante
```

## Fuera de scope (fase 2, no implementar todavía)

Backend de envío (Resend/SES), base de datos, representantes provinciales/locales,
login, dashboard de analytics avanzado, Turnstile (agregar sólo si hay abuso de bots).
