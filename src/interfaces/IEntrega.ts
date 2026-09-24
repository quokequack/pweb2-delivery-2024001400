import {StatusEnum} from "../database/StatusEnum.js";
import {Evento} from "../database/Evento.js";


export interface IEntrega {
    descricao: string,
    origem: string,
    destino: string,
    status: StatusEnum,
    motoristaId?: number
    historico: Evento[]
}