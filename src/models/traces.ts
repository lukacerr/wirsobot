/* eslint-disable import/no-cycle */
import {
  Column, Entity, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import detalles_por_trace from 'models/detallesPorTrace';

@Entity()
export default class traces {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    fecha: Date;

  @Column({ length: 100 })
    aplicacion: string;

  @Column({ length: 100 })
    modulo: string;

  @Column({ length: 200 })
    componente: string;

  @Column()
    exception: Boolean;

  @Column({ length: 'MAX' })
    mensaje: string;

  @OneToMany(() => detalles_por_trace, (x: detalles_por_trace) => x.trace)
    detalles: detalles_por_trace[];
}
