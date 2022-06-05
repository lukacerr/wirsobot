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
const GetDetailsMessage = (trace: traces) => `${trace.exception ? 'La excepción' : 'El trace'} surgió en el módulo \`${trace.modulo}\` (aplicación \`${trace.aplicacion}\`, componente \`${trace.componente.split('.').slice(-3).join('.')}\`). Se registraron ${trace.detalles.length} detalle/s para este trace${trace.detalles.length ? `: ${trace.detalles.map((x) => `\`${x.clave}\``).join(' & ')}` : ''}. *Informe completo en el archivo \`.md\`*.`;

const getMarkdownDetails = (details: detalles_por_trace[]) => `${details.map((d) => `
- "${d.clave}" *(ID ${d.id})*
\`\`\`
${d.valor.replace('`', '\\`').trim()}
\`\`\`
`.trim()).join('\n\n')}`;

export const GetMarkdownText = (trace: traces) => `
# 🆔 Trace ID ${trace.id} (excepción: ${trace.exception ? 'SI' : 'NO'})

\`\`\` 
${trace.mensaje}
\`\`\`

- Fecha: **${GetDateToString(trace.fecha)}**
- Aplicación: ${trace.aplicacion}
- Módulo: ${trace.modulo}
- Componente: \`${trace.componente}\`

---

## 📚 Detalles (${trace.detalles.length} en total)

${
  trace.detalles.length
    ? getMarkdownDetails(trace.detalles)
    : 'No se han encontrado detalles para este trace. 🙁'
}

--- 

## 💡 Query informativa

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
  .setTitle(`${trace.exception ? 'Nueva excepción registrada' : 'Nuevo trace registrado'} (trace ID: ${trace.id})`)
  .setURL('https://wirtrack.com/v2/home/#!/')
  .setDescription(`⚠️ **Mensaje de error** ${
    GetDiscordCode(
      `${trace.mensaje.substring(0, 199)}${trace.mensaje.length >= 200 ? '...' : ''}`,
      trace.mensaje.includes('sql') ? 'sql' : 'csharp',
    )
  }`)
  .addField('📚 Detalles (resumen)', GetDetailsMessage(trace))
  .addField('💡 SQL Query', GetDiscordCode(GetTracesQuery(trace.id), 'sql'))
  .setTimestamp(GetDateLocal(trace.fecha))
  .setFooter({ text: `Aplicación: ${trace.aplicacion}` });

export const GetMarkdownFile = (trace: traces, filename: string, fnName: string) => {
  WriteToTemp(filename, 'md', GetMarkdownText(trace), fnName);
  return GetTempAttachment(`${fnName}/${filename}.md`);
};

export const GetNotFoundMessage = (traceId: number) => `
:red_circle: No se ha encontrado el trace \`ID = ${traceId}\`.
*Verifique el estado del servidor y, si se necesita, ejecute la query directamente:*
${GetDiscordCode(GetTracesQuery(traceId), 'sql')}
`;
