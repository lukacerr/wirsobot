import { CommandInteraction } from 'discord.js';

import { GetEmbedMessage, GetMarkdownFile, GetNotFoundMessage } from 'helpers/traceHelper';
import { FindTraceById } from 'data/tracesDao';

export default async (interaction: CommandInteraction) => {
  const traceId = interaction.options.getInteger('trace_id') as number;
  const trace = await FindTraceById(traceId);

  if (trace) {
    await interaction.reply({ embeds: [GetEmbedMessage(trace)] })
      .then(async () => (interaction.channel ?? interaction.user)
        .send({ files: [GetMarkdownFile(trace, `Trace ID ${trace.id}`, 'resend')] }));
  } else interaction.reply(GetNotFoundMessage(traceId));
};
