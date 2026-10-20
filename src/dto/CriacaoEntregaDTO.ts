import {Eventos} from "../database/entregas/Evento.js";
import {IEntrega} from "../interfaces/IEntrega.js";
import {StatusEntrega} from "../../generated/prisma/enums.js";

export class CriacaoEntregaDTO implements IEntrega {
    descricao: string;
    origem: string;
    destino: string;
    motorista_id: number | null;
    status: StatusEntrega;
    historico: Eventos[];

    constructor(descricao: string, origem: string, destino: string) {
        this.descricao = descricao;
        this.origem = origem;
        this.destino = destino;
        this.motorista_id = null;
        this.status = StatusEntrega.CRIADA;
        this.historico = [];
    }

    static porObjeto(dados: {descricao: string, origem: string, destino: string }): CriacaoEntregaDTO {
        return new CriacaoEntregaDTO(dados['descricao'], dados['origem'], dados['destino']);
    }

    paraEntrega() : IEntrega {
        return {
            descricao: this.descricao,
            origem: this.origem,
            destino: this.destino,
            status: this.status,
            motorista_id: this.motorista_id,
            historico: this.historico,
        }
    }

}