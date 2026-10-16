import {StatusEnum} from "../database/entregas/StatusEnum.js";
import {Evento} from "../database/entregas/Evento.js";


export interface IEntrega {
    descricao: string,
    origem: string,
    destino: string,
    status: StatusEnum,
    motoristaId: number | null,
    historico: Evento[]

}