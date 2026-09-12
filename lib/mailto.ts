export type MailProvider = "gmail" | "outlook" | "mailto";

export interface ComposeParams {
  to: string;
  subject: string;
  body: string;
}

/** URLSearchParams usa "+" para los espacios; muchos clientes lo toman literal. */
const qs = (params: Record<string, string>) =>
  new URLSearchParams(params).toString().replace(/\+/g, "%20");

/**
 * Link `mailto:` — abre el cliente de correo del sistema operativo.
 * Fase 1: no hay backend de envío — el usuario manda el mail desde su propio cliente.
 */
export function buildMailto(params: ComposeParams): string {
  return `mailto:${encodeURIComponent(params.to)}?${qs({
    subject: params.subject,
    body: params.body,
  })}`;
}

/** Compositor web de Gmail, pre-cargado. Abre en una pestaña nueva (desktop). */
export function buildGmailCompose(params: ComposeParams): string {
  return `https://mail.google.com/mail/?${qs({
    view: "cm",
    fs: "1",
    to: params.to,
    su: params.subject,
    body: params.body,
  })}`;
}

/** Compositor web de Outlook, pre-cargado. Abre en una pestaña nueva (desktop). */
export function buildOutlookCompose(params: ComposeParams): string {
  return `https://outlook.office.com/mail/deeplink/compose?${qs({
    to: params.to,
    subject: params.subject,
    body: params.body,
  })}`;
}

/**
 * Deep link a la app de Gmail (iOS/Android), esquema no oficial pero
 * ampliamente usado (`googlegmail:///co`). Si la app no está instalada,
 * el navegador no navega a ningún lado — por eso siempre queda como red
 * de contención el fallback "¿No se abrió? Copiá el mensaje".
 */
export function buildGmailAppCompose(params: ComposeParams): string {
  return `googlegmail:///co?${qs({
    to: params.to,
    subject: params.subject,
    body: params.body,
  })}`;
}

/**
 * Deep link a la app de Outlook (iOS/Android), esquema no oficial
 * (`ms-outlook://compose`). Misma salvedad que `buildGmailAppCompose`.
 */
export function buildOutlookAppCompose(params: ComposeParams): string {
  return `ms-outlook://compose?${qs({
    to: params.to,
    subject: params.subject,
    body: params.body,
  })}`;
}

/** Devuelve el link de envío según el proveedor elegido por el usuario. */
export function buildComposeUrl(
  provider: MailProvider,
  params: ComposeParams,
): string {
  if (provider === "gmail") return buildGmailCompose(params);
  if (provider === "outlook") return buildOutlookCompose(params);
  return buildMailto(params);
}

/** Link de "compartir en X/Twitter". */
export function buildShareX(text: string, url: string): string {
  const q = new URLSearchParams({ text, url });
  return `https://twitter.com/intent/tweet?${q.toString()}`;
}

/** Link de "compartir en Facebook". */
export function buildShareFacebook(url: string): string {
  const q = new URLSearchParams({ u: url });
  return `https://www.facebook.com/sharer/sharer.php?${q.toString()}`;
}

/** Link de "compartir en WhatsApp" (clave en LatAm, sobre todo mobile). */
export function buildShareWhatsApp(text: string): string {
  const q = new URLSearchParams({ text });
  return `https://wa.me/?${q.toString()}`;
}
