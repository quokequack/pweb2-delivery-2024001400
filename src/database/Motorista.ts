import {IMotorista} from "../interfaces/IMotorista.js";
import {StatusMotoristaEnum} from "./StatusMotoristaEnum.js";

export class Motorista implements IMotorista {
    id: number;
    nome: string;
    cpf: string;
    placaVeiculo: string | null;
    status: StatusMotoristaEnum;

    constructor(id: number, dados: IMotorista) {
        this.id = id;
        this.nome = dados.nome;
        this.cpf = dados.cpf;
        this.placaVeiculo = dados.placaVeiculo;
        this.status = StatusMotoristaEnum.ATIVO;
    }

}