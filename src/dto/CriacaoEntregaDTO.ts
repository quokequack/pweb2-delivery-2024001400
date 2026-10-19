import {Evento} from "../database/entregas/Evento.js";
import {IEntrega} from "../interfaces/IEntrega.js";
import {StatusEntrega} from "../database/entregas/StatusEntrega.js";

export class EntregaDTO implements IEntrega {
    descricao: string;
    origem: string;
    destino: string;
    motoristaId: number | null;
    status: StatusEntrega;
    historico: Evento[];

    constructor(descricao: string, origem: string, destino: string) {
        this.descricao = descricao;
        this.origem = origem;
        this.destino = destino;
        this.motoristaId = null;
        this.status = StatusEntrega.CRIADA;
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
            motoristaId: this.motoristaId,
            historico: this.historico,
        }
    }

}