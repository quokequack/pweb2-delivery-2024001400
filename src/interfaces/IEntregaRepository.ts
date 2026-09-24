import {Entrega} from "../database/Entrega";
import {StatusEnum} from "../database/StatusEnum";
import {IEntrega} from "./IEntrega";
import {Evento} from "../database/Evento";


export interface IEntregaRepository {
    listarEntregas(): Entrega[];
    porId(idEntrega: number): Entrega | undefined;
    porStatus(status: StatusEnum) : Entrega[];
    criar(dadosEntrega: IEntrega): Entrega;
    atualizar(entrega: Entrega, dados: Partial<IEntrega>): Entrega;
    historico(idEntrega: number): Evento[] | undefined;
    novoRegistroHistorico(entrega: Entrega, evento: Evento) : void;
}