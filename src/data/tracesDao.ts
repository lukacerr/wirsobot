import { db } from 'core';
import traces from 'models/traces';
import { MoreThan } from 'typeorm';

export async function FindTraceById(traceId: number) {
  return db.findOne(traces, {
    where: { id: traceId },
    lock: { mode: 'dirty_read' },
    relations: { detalles: true },
  });
}

export async function FindTracesByDate(date: Date, exceptionOnly?: boolean, maxAmount?: number) {
  return db.find(traces, {
    where: { fecha: MoreThan(date), exception: exceptionOnly },
    take: maxAmount,
    lock: { mode: 'dirty_read' },
    relations: { detalles: true },
  });
}
