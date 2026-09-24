import {IEntrega} from "../interfaces/IEntrega";
import {StatusEnum} from "./StatusEnum";
import {Evento} from "./Evento";


export class Entrega implements IEntrega {
    id: number;
    descricao: string;
    origem: string;
    destino: string;
    status: StatusEnum;
    motoristaId?: number;
    historico: Evento[];

    constructor(id: number, dados: IEntrega) {
        this.id = id;
        this.descricao = dados.descricao;
        this.origem = dados.origem;
        this.destino = dados.destino;
        this.status = dados.status;
        this.motoristaId = dados.motoristaId;
        this.historico = dados.historico;
    }

}