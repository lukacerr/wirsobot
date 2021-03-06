import { MessageEmbed } from 'discord.js';

import { GetDateLocal, GetDateToString } from 'helpers/datetimeHelper';
import { GetDiscordCode, GetTempAttachment } from 'common/discordVars';
import { WriteToTemp } from 'helpers/fileHelper';

import traces from 'models/traces';
import detalles_por_trace from 'models/detallesPorTrace';

export const GetTracesQuery = (id: number) => `
SELECT * FROM traces WITH(nolock) 
LEFT JOIN detalles_por_trace 
ON traces.id = detalles_por_trace.trace 
WHERE traces.id = ${id}
`.trim();

// eslint-disable-next-line max-len
const GetDetailsMessage = (trace: traces) => `${trace.exception ? 'La excepci贸n' : 'El trace'} surgi贸 en el m贸dulo \`${trace.modulo}\` (aplicaci贸n \`${trace.aplicacion}\`, componente \`${trace.componente.split('.').slice(-3).join('.')}\`). Se registraron ${trace.detalles.length} detalle/s para este trace${trace.detalles.length ? `: ${trace.detalles.map((x) => `\`${x.clave}\``).join(' & ')}` : ''}. *Informe completo en el archivo \`.md\`*.`;

const getMarkdownDetails = (details: detalles_por_trace[]) => `${details.map((d) => `
- "${d.clave}" *(ID ${d.id})*
\`\`\`
${d.valor.replace('`', '\\`').trim()}
\`\`\`
`.trim()).join('\n\n')}`;

export const GetMarkdownText = (trace: traces) => `
# 馃啍 Trace ID ${trace.id} (excepci贸n: ${trace.exception ? 'SI' : 'NO'})

\`\`\` 
${trace.mensaje}
\`\`\`

- Fecha: **${GetDateToString(trace.fecha)}**
- Aplicaci贸n: ${trace.aplicacion}
- M贸dulo: ${trace.modulo}
- Componente: \`${trace.componente}\`

---

## 馃摎 Detalles (${trace.detalles.length} en total)

${
  trace.detalles.length
    ? getMarkdownDetails(trace.detalles)
    : 'No se han encontrado detalles para este trace. 馃檨'
}

--- 

## 馃挕 Query informativa

\`\`\`sql
${GetTracesQuery(trace.id)}
\`\`\`
`.trim();

export const GetEmbedMessage = (trace: traces) => new MessageEmbed()
  .setColor('#4074ac')
  .setAuthor({
    name: `En '${trace.componente.length >= 50
      ? `...${trace.componente.split('.').slice(-4).join('.')}`
      : trace.componente}'`,
  })
  .setTitle(`${trace.exception ? 'Nueva excepci贸n registrada' : 'Nuevo trace registrado'} (trace ID: ${trace.id})`)
  .setURL('https://wirtrack.com/v2/home/#!/')
  .setDescription(`鈿狅笍 **Mensaje de error** ${
    GetDiscordCode(
      `${trace.mensaje.substring(0, 199)}${trace.mensaje.length >= 200 ? '...' : ''}`,
      trace.mensaje.includes('sql') ? 'sql' : 'csharp',
    )
  }`)
  .addField('馃摎 Detalles (resumen)', GetDetailsMessage(trace))
  .addField('馃挕 SQL Query', GetDiscordCode(GetTracesQuery(trace.id), 'sql'))
  .setTimestamp(GetDateLocal(trace.fecha))
  .setFooter({ text: `Aplicaci贸n: ${trace.aplicacion}` });

export const GetMarkdownFile = (trace: traces, filename: string, fnName: string) => {
  WriteToTemp(filename, 'md', GetMarkdownText(trace), fnName);
  return GetTempAttachment(`${fnName}/${filename}.md`);
};

export const GetNotFoundMessage = (traceId: number) => `
:red_circle: No se ha encontrado el trace \`ID = ${traceId}\`.
*Verifique el estado del servidor y, si se necesita, ejecute la query directamente:*
${GetDiscordCode(GetTracesQuery(traceId), 'sql')}
`;
