import {Entrega} from "./entregas/Entrega.js";
import {Motorista} from "./motoristas/Motorista.js";

export class Database {
    entregas: Entrega[] = [];
    motoristas: Motorista[] = [];
    proximoIdEntrega: number = 1;
    proximoIdMotorista: number = 1;
}
