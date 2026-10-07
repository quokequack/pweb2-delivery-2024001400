import { Motorista } from "../database/Motorista.js";
import { MotoristaDTO } from "../dto/MotoristaDTO.js";
import {IMotoristaRepository} from "../interfaces/IMotoristaRepository.js";
import {Database} from "../database/Database.js";
import {IMotorista} from "../interfaces/IMotorista.js";

export class MotoristaRepository implements IMotoristaRepository {
    constructor(private readonly database: Database) {
    }
    listarTodos(): Motorista[] {
        return this.database.motoristas;
    }
    buscarPorId(id: number): Motorista | null {
        return this.database.motoristas.find((motorista) => motorista.id == id) ?? null;
    }
    buscarPorCpf(cpf: string): Motorista | null {
        return this.database.motoristas.find((motorista) => motorista.cpf === cpf) ?? null;
    }
    criar(dados: IMotorista): Motorista {
        const motorista = new Motorista(this.database.proximoIdMotorista++, dados);
        this.database.motoristas.push(motorista);
        return motorista;
    }


}