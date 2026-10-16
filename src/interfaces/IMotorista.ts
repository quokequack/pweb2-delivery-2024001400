import {StatusMotoristaEnum} from "../database/motoristas/StatusMotoristaEnum.js";

export interface IMotorista {
    nome: string;
    cpf: string;
    placaVeiculo: string | null;
    status: StatusMotoristaEnum;
}