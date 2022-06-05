/* eslint-disable import/no-cycle */
import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import traces from 'models/traces';

@Entity()
export default class detalles_por_trace {
  @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => traces, (x: traces) => x.detalles)
  @JoinColumn({ name: 'trace', referencedColumnName: 'id' })
    trace: traces;

  @Column({ length: 100 })
    clave: string;

  @Column({ length: 'MAX' })
    valor: string;
}
