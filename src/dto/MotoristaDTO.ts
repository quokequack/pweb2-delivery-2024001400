import {IMotorista} from "../interfaces/IMotorista.js";
import {StatusMotoristaEnum} from "../database/StatusMotoristaEnum.js";

export class MotoristaDTO implements IMotorista {
    cpf: string;
    nome: string;
    placaVeiculo: string | null;
    status: StatusMotoristaEnum;

    constructor(cpf: string, nome: string, placaVeiculo: string | null) {
        this.cpf = cpf;
        this.nome = nome;
        this.placaVeiculo = placaVeiculo;
        this.status = StatusMotoristaEnum.ATIVO;
    }

    static porObjeto(dados: {nome: string, cpf: string, placaVeiculo: string | null}) : MotoristaDTO {
        return new MotoristaDTO(dados["cpf"], dados["nome"], dados["placaVeiculo"]);
    }

    paraMotorista() : IMotorista {
        return {
            cpf: this.cpf,
            nome: this.nome,
            placaVeiculo: this.placaVeiculo,
            status: this.status
        }
    }

}