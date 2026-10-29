import {IMotoristaRepository} from "../interfaces/IMotoristaRepository.js";
import {MotoristaError} from "../errors/MotoristaError.js";
import {MotoristaDTO} from "../dto/MotoristaDTO.js";
import {IEntregaRepository} from "../interfaces/IEntregaRepository.js";
import {StatusMotoristaEnum} from "../database/motoristas/StatusMotoristaEnum.js";
import {StatusEntrega} from "../../generated/prisma/enums.js";

export class MotoristaService {
    constructor(private repository: IMotoristaRepository, private entregaRepository: IEntregaRepository){}

    async criar(dados: {nome: string, cpf: string, placaVeiculo: string | null}){
        if (!dados || !dados.nome?.trim() || !dados.cpf?.trim()) {
            throw new MotoristaError(400, "Nome e CPF são obrigatórios");
        }

        const dto = MotoristaDTO.porObjeto(dados);
        const existeMotoristaCPF = await this.repository.buscarPorCpf(dados.cpf);

        if (existeMotoristaCPF !== null) {
            throw new MotoristaError(409, "Já existe um motorista ativo com os mesmos dados!");
        }

        return await this.repository.criar(dto.paraMotorista());
    }

    async porId(id: number){
        const motorista = await this.repository.buscarPorId(id);
        if(!motorista){
            throw new MotoristaError(404, "Motorista não encontrado!");
        }
        return motorista;
    }

    async porCpf(cpf: string){
        const motorista = await this.repository.buscarPorCpf(cpf);
        if(!motorista){
            throw new MotoristaError(404, "Motorista não encontrado!");
        }
        return motorista;
    }

    async motoristas() {
        return await this.repository.listarTodos();
    }

    async entregasPorMotorista(idMotorista: number, status?: StatusEntrega) {
        const motorista = await this.repository.buscarPorId(idMotorista);
        if (!motorista) {
            throw new MotoristaError(404, "Motorista não encontrado!");
        }
        if(motorista.status === StatusMotoristaEnum.INATIVO){
            throw new MotoristaError(422, "Motorista inativo!");
        }

        if(status){
            return await this.entregaRepository.listarTodos({motoristaId: idMotorista, status: status})
        }

        return await this.entregaRepository.listarTodos({motoristaId: idMotorista});

    }
}
