import {StatusEnum} from "../database/StatusEnum";
import {Evento} from "../database/Evento";


export interface IEntrega {
    descricao: string,
    origem: string,
    destino: string,
    status: StatusEnum,
    motoristaId?: number
    historico: Evento[]
}