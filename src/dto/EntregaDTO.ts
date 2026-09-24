import {Evento} from "../database/Evento";
import {IEntrega} from "../interfaces/IEntrega";
import {StatusEnum} from "../database/StatusEnum";

export class EntregaDTO {
    id: number | null;
    descricao: string;
    origem: string;
    destino: string;
    motoristaId: number | null;
    status: StatusEnum;
    historico: Evento[];

    constructor(descricao: string, origem: string, destino: string) {
        this.id = null;
        this.descricao = descricao;
        this.origem = origem;
        this.destino = destino;
        this.motoristaId = null;
        this.status = StatusEnum.CRIADA;
        this.historico = [];
    }

    static porObjeto(dados: {descricao: string, origem: string, destino: string }): EntregaDTO {
        return new EntregaDTO(dados['descricao'], dados['origem'], dados['destino']);
    }

    paraEntrega() : IEntrega {
        return {
            descricao: this.descricao,
            origem: this.origem,
            destino: this.destino,
            status: this.status,
            historico: this.historico,
        }
    }

}