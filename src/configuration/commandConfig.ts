import { SlashCommandBuilder } from '@discordjs/builders';

import resend from 'commands/resendCommand';
import pdf, { pdfPreExecution } from 'commands/pdfCommand';

export default [
  {
    name: 'pdf',
    builder: new SlashCommandBuilder()
      .setName('pdf')
      .setDescription('Manda un trace y sus detalles como PDF.')
      .addIntegerOption((option) => option.setName('trace_id')
        .setDescription('La ID del trace para reportar.')
        .setRequired(true)),
    useTemp: true,
    preExecution: pdfPreExecution,
    fn: pdf,
  },
  {
    name: 'resend',
    builder: new SlashCommandBuilder()
      .setName('resend')
      .setDescription('Re-envía un trace con el mismo formato de alerta.')
      .addIntegerOption((option) => option.setName('trace_id')
        .setDescription('La ID del trace para re-enviar.')
        .setRequired(true)),
    useTemp: true,
    preExecution: null,
    fn: resend,
  },
];
