import {Entrega} from "./Entrega.js";
import {Motorista} from "./Motorista.js";

export class Database {
    entregas: Entrega[] = [];
    motoristas: Motorista[] = [];
    proximoIdEntrega: number = 1;
    proximoIdMotorista: number = 1;
}
