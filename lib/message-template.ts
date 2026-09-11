/**
 * BORRADOR — pendiente de revisión y aprobación del dueño del proyecto antes de lanzar.
 * (ver PROJECT_SPEC.md → "Plantilla de mensaje pre-escrito")
 *
 * El usuario edita el cuerpo (sin saludo) en un textarea. El saludo con el nombre
 * del representante se agrega al abrir el mail, así el mismo texto sirve para
 * cualquier destinatario.
 *
 * El texto sale de data/site-copy.json (editable sin tocar código).
 */
import siteCopy from "@/data/site-copy.json";

export const SUBJECT = siteCopy.subject;

export interface BodyContext {
  userName: string;
  countryName: string;
}

/** Cuerpo del mensaje, sin el saludo (el usuario ve y edita esto). */
export function buildBody(ctx: BodyContext): string {
  const name = ctx.userName || "[tu nombre]";
  return siteCopy.mailContent
    .replaceAll("{{nombre}}", name)
    .replaceAll("{{pais}}", ctx.countryName);
}

/** Saludo con el nombre del representante. Se antepone al cuerpo al abrir el mail. */
export function salutationFor(name: string): string {
  return `Estimado/a ${name},`;
}

/** Cuerpo final que va al mail / formulario, ya con el saludo del destinatario. */
export function fullBody(recipientName: string, body: string): string {
  return `${salutationFor(recipientName)}\n\n${body}`;
}
