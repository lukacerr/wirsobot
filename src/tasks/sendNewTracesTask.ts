import { GetMultipleChannels } from 'common/discordVars';
import { GetDateUTC } from 'helpers/datetimeHelper';
import { GetEmbedMessage, GetMarkdownFile } from 'helpers/traceHelper';
import { FindTracesByDate } from 'data/tracesDao';

let LAST_RUN = GetDateUTC();

export default async function sendNewTraces(params: {
  tracesChannels: string[],
  getOnlyAmount?: number,
  exceptionOnly?: boolean,
}) {
  for (const trace of await FindTracesByDate(LAST_RUN, params.exceptionOnly, params.getOnlyAmount)) {
    for (const channel of await GetMultipleChannels(params.tracesChannels)) {
      await channel.send({ embeds: [GetEmbedMessage(trace)] })
        .then(async () => channel.send({ files: [GetMarkdownFile(trace, `Trace ID ${trace.id}`, 'sendNewTraces')] }));
    }
  }

  LAST_RUN = GetDateUTC();
}
