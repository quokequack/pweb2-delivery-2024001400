import {Entrega} from "../database/Entrega.js";
import {StatusEnum} from "../database/StatusEnum.js";
import {IEntrega} from "./IEntrega.js";
import {Evento} from "../database/Evento.js";


export interface IEntregaRepository {
    listarEntregas(): Entrega[];
    porId(idEntrega: number): Entrega | undefined;
    porStatus(status: StatusEnum) : Entrega[];
    criar(dadosEntrega: IEntrega): Entrega;
    atualizar(entrega: Entrega, dados: Partial<IEntrega>): Entrega;
    historico(idEntrega: number): Evento[] | undefined;
    novoRegistroHistorico(entrega: Entrega, evento: Evento) : void;
}