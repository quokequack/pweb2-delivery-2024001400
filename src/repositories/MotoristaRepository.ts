import { Motoristas } from "../database/motoristas/Motorista.js";
import {IMotoristaRepository} from "../interfaces/IMotoristaRepository.js";
import {IMotorista} from "../interfaces/IMotorista.js";
import {prisma} from "../database/prisma.js";

export class MotoristaRepository implements IMotoristaRepository {
    constructor() {
    }
    async listarTodos(): Promise<Motoristas[]> {
        return prisma.motorista.findMany();
    }
    async buscarPorId(id: number): Promise<Motoristas | null> {
        return prisma.motorista.findUnique({
            where: {
                id: id
            }
        });
    }

    async buscarPorCpf(cpf: string): Promise<Motoristas | null> {
        return prisma.motorista.findUnique({
            where: {
                cpf: cpf
            }
        });

    }

    async criar(dados: IMotorista): Promise<Motoristas> {
        return prisma.motorista.create({
            data: {
                nome: dados.nome,
                cpf: dados.cpf,
                placa_veiculo: dados.placaVeiculo,
                status: dados.status,
            }
        })
    }


}