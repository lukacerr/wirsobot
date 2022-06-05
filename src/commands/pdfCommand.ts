import { CommandInteraction, MessageAttachment } from 'discord.js';

import mdToPdf from 'md-to-pdf';

import { GetTemporalDirectory, WriteToTempAsync } from 'helpers/fileHelper';
import { GetMarkdownText, GetNotFoundMessage } from 'helpers/traceHelper';
import { FindTraceById } from 'data/tracesDao';

export async function pdfPreExecution() {
  WriteToTempAsync('f', 'pdf', '', 'pdf');
}

export default async (interaction: CommandInteraction) => {
  const traceId = interaction.options.getInteger('trace_id') as number;
  const trace = await FindTraceById(traceId);

  if (trace) {
    await mdToPdf({ content: GetMarkdownText(trace) }, { dest: GetTemporalDirectory('pdf/f.pdf') })
      .then((f) => interaction.reply({
        files: [new MessageAttachment(f.filename as string, `TRACE ID ${traceId}.pdf`)],
      }));
  } else interaction.reply(GetNotFoundMessage(traceId));
};
