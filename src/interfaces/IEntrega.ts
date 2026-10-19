import {StatusEntrega} from "../../generated/prisma/enums.js";
import {Eventos} from "../database/entregas/Evento.js";


export interface IEntrega {
    descricao: string,
    origem: string,
    destino: string,
    status: StatusEntrega,
    motorista_id: number | null,
    historico?: Eventos[]
    alteracao?: string

}