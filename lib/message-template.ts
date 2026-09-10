/**
 * BORRADOR — pendiente de revisión y aprobación del dueño del proyecto antes de lanzar.
 * (ver PROJECT_SPEC.md → "Plantilla de mensaje pre-escrito")
 *
 * El usuario edita el cuerpo (sin saludo) en un textarea. El saludo con el nombre
 * del representante se agrega al abrir el mail, así el mismo texto sirve para
 * cualquier destinatario.
 */
export const SUBJECT =
  "Preocupación ciudadana por los riesgos del desarrollo de IA de frontera";

export interface BodyContext {
  userName: string;
  countryName: string;
}

/** Cuerpo del mensaje, sin el saludo (el usuario ve y edita esto). */
export function buildBody(ctx: BodyContext): string {
  const name = ctx.userName || "[tu nombre]";
  return `Mi nombre es ${name} y le escribo como ciudadano/a de ${ctx.countryName} para expresar mi preocupación por los riesgos asociados al desarrollo acelerado de sistemas de inteligencia artificial de frontera.

Los principales laboratorios que construyen esta tecnología, junto con muchos de los investigadores más citados del campo, advierten públicamente que estos sistemas podrían escapar al control humano y que el riesgo es comparable al de las pandemias o la guerra nuclear. No se trata de ciencia ficción: es la posición expresa de las personas que lideran el desarrollo.

Creo que estos riesgos no son inevitables. La comunidad internacional ya demostró, con las armas nucleares, biológicas y químicas, que puede construir instituciones y tratados para gestionar tecnologías de destrucción masiva. Falta hacerlo con la IA.

Le pido concretamente que:

1. Impulse que ${ctx.countryName} desarrolle capacidad técnica estatal para entender y evaluar estos sistemas.
2. Apoye acuerdos internacionales de verificación y supervisión sobre el desarrollo de IA de frontera, del mismo modo en que existen para la tecnología nuclear.
3. Trate este tema como una prioridad de seguridad nacional y no sólo como una cuestión económica o de innovación.

Quedo a disposición para ampliar cualquier punto. Le agradezco su tiempo y su atención a este asunto.

Atentamente,
${name}`;
}

/** Saludo con el nombre del representante. Se antepone al cuerpo al abrir el mail. */
export function salutationFor(name: string): string {
  return `Estimado/a ${name},`;
}

/** Cuerpo final que va al mail / formulario, ya con el saludo del destinatario. */
export function fullBody(recipientName: string, body: string): string {
  return `${salutationFor(recipientName)}\n\n${body}`;
}
