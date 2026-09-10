# Estado de los datos de representantes

`data/representatives.json` — 781 filas. En producción sólo se sirven las
`verified: true` (618); las `verified: false` (163, todo México) sólo se ven en
`npm run dev`.

## Cobertura actual

| País | Cargo | Filas | verified | Fuente | Notas |
|---|---|---|---|---|---|
| 🇦🇷 AR | presidente | 1 | ✅ | casarosada.gob.ar | `audiencias@presidencia.gob.ar` (pedido de audiencia; es el único email de la Presidencia) |
| 🇦🇷 AR | vicepresidente | 1 | ✅ | senado.gob.ar | `presidencia@senado.gob.ar` (Presidencia del Senado) |
| 🇦🇷 AR | diputado_nacional | 257 | ✅ | hcdn.gob.ar | **roster completo** (257/257). Email `<slug>@hcdn.gob.ar` leído del `mailto:` de cada ficha oficial |
| 🇦🇷 AR | senador_nacional | 73 | ✅ | senado.gob.ar | 72 senadores individuales + 1 atención ciudadana. Extraídos del padrón oficial; sólo 3 cross-checeados a mano |
| 🇨🇴 CO | presidente | 1 | ✅ | presidencia.gov.co | `contacto@presidencia.gov.co` |
| 🇨🇴 CO | diputado_nacional | 182 | ✅ | camara.gov.co | roster completo Cámara de Representantes 2026-2027. Extraídos del directorio oficial; 5 cross-checeados |
| 🇨🇴 CO | senador_nacional | 103 | ✅ | app.senado.gov.co API | **roster completo** del Senado 2026-2030 (son 103 bancas, no 108: las 5 de Comunes/FARC expiraron). Emails del API oficial "Datos Abiertos", cross-checeados contra una captura de Wayback |
| 🇲🇽 MX | presidente | 1 | ❌ | — | `channel: form` → SIDAC (`sidac.presidencia.gob.mx`). La Presidencia no publica email |
| 🇲🇽 MX | senador_nacional | 126 | ❌ | senado.gob.mx open data | de un JSON oficial vía Wayback (jul-2026). **Sitios .gob.mx geo-bloqueados desde acá** |
| 🇲🇽 MX | diputado_nacional | 36 | ❌ | sitl.diputados.gob.mx | parcial (36 de 500), vía Wayback. Sin email institucional; patrón no reconstruible |

## Pendiente antes de lanzar

### Bloqueante
- [ ] **México: re-verificar desde una IP mexicana.** Las 163 filas MX salieron de capturas de Wayback porque los sitios `.gob.mx` bloquean este entorno. Abrir ~10 direcciones por cámara en un browser normal desde México y, si están bien, poner `verified: true`. El JSON del Senado (`senado.gob.mx/66/datosAbiertos/senadoresDatosAb.json`) es la fuente más confiable.
- [ ] **AR senadores + CO representantes: spot-check de los datos masivos.** Los 72 senadores AR y los 182 representantes CO se extrajeron de listados oficiales pero sólo se cross-checearon 3 y 5 respectivamente. Chequear ~10 más por cámara contra la ficha individual antes de un envío masivo. Ojo con los irregulares (sin punto, apellido compuesto). Los 257 diputados AR sí salieron uno por uno del `mailto:` de cada ficha oficial (patrón `<slug>@hcdn.gob.ar` sin excepciones).
- [ ] **Texto del mensaje** (`lib/message-template.ts`) — sigue siendo borrador, falta aprobación del dueño.

### Completar cobertura
- [x] AR: 257 diputados individuales — hecho.
- [x] CO: 103 senadores individuales — hecho.
- [ ] MX: 464 diputados restantes — iterar `sitl.diputados.gob.mx/LXVI_leg/curricula.php?dipt=<ID>` desde IP MX.
- [ ] Los otros 13 países de la fase 1 (Bolivia, Brasil, Chile, Costa Rica, Ecuador, El Salvador, España, Guatemala, Honduras, Nicaragua, Panamá, Paraguay, Rep. Dominicana, Uruguay).

### A evaluar (UX, no bloqueante)
- [ ] **Lista larga de senadores**: en CO (circunscripción nacional) y MX (32 de lista nacional) el usuario ve TODOS los senadores en el selector, sin poder filtrar por región. Un CO ve ~120 opciones (presidente + 103 senadores + representantes de su depto). Considerar: buscador en el selector, o poner senadores detrás de un "ver senadores" colapsable, o preseleccionar presidente + cámara baja.
- [ ] AR presidente: ¿usar el formulario de `contacto.casarosada.gob.ar` (`channel: form`) en vez del email de audiencias?
- [ ] MX senadores "Lista Nacional" (32 con `region: null`): quizás keyear por `estadoOrigen`.
- [ ] CO: nombres de `region` para circunscripciones especiales (CITREP, Afro, Indígena, Internacional, Oposición) — hoy son etiquetas descriptivas, no departamentos.

## Fuentes oficiales por país

| País | Cámara Baja | Cámara Alta |
|---|---|---|
| Bolivia | diputados.bo | senado.bo |
| Brasil | camara.leg.br | senado.leg.br |
| Chile | camara.cl | senado.cl |
| Costa Rica | asamblea.go.cr | — (unicameral) |
| Ecuador | asambleanacional.gob.ec | — (unicameral) |
| El Salvador | asamblea.gob.sv | — (unicameral) |
| España | congreso.es | senado.es |
| Guatemala | congreso.gob.gt | — (unicameral) |
| Honduras | congresonacional.hn | — (unicameral) |
| Nicaragua | asamblea.gob.ni | — (unicameral) |
| Panamá | asamblea.gob.pa | — (unicameral) |
| Paraguay | diputados.gov.py | senado.gov.py |
| Rep. Dominicana | camaradediputados.gob.do | senado.gob.do |
| Uruguay | parlamento.gub.uy | parlamento.gub.uy |

## Excluidos a propósito (no técnico)

- **Venezuela** — situación institucional excepcional.
- **Perú** — fuentes contradictorias sobre la presidencia; revisar más adelante.
- **Cuba** — partido único; "contactar representantes" no aplica igual.
