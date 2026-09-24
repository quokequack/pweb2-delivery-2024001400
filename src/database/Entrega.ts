import {IEntrega} from "../interfaces/IEntrega.js";
import {StatusEnum} from "./StatusEnum.js";
import {Evento} from "./Evento.js";


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