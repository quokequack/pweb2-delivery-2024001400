import {StatusMotoristaEnum} from "../database/StatusMotoristaEnum.js";

export interface IMotorista {
    nome: string;
    cpf: string;
    placaVeiculo: string | null;
    status: StatusMotoristaEnum;
}