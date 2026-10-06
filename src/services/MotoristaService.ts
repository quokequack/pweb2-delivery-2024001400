import {IMotoristaRepository} from "../interfaces/IMotoristaRepository.js";
import {MotoristaError} from "../errors/MotoristaError.js";
import {MotoristaDTO} from "../dto/MotoristaDTO.js";
import {IEntregaRepository} from "../interfaces/IEntregaRepository.js";
import {EntregaError} from "../errors/EntregaError.js";
import {StatusMotoristaEnum} from "../database/StatusMotoristaEnum.js";
import {Entrega} from "../database/Entrega.js";

export class MotoristaService {
    constructor(private repository: IMotoristaRepository, private entregaRepository: IEntregaRepository){}

    criar(dados: {nome: string, cpf: string, placaVeiculo: string | null}){
        if (!dados || !dados.nome?.trim() || !dados.cpf?.trim()) {
            throw new MotoristaError(400, "Nome e CPF são obrigatórios");
        }

        const dto = MotoristaDTO.porObjeto(dados);
        const existeMotoristaCPF = this.repository.buscarPorCpf(dados.cpf);

        if (existeMotoristaCPF !== null) {
            throw new MotoristaError(409, "Já existe um motorista ativo com os mesmos dados!");
        }

        return this.repository.criar(dto.paraMotorista());
    }

    entregasPorMotorista(idMotorista: number, status?: string) {
        const motorista = this.repository.buscarPorId(idMotorista);

        if(!motorista){
            throw new MotoristaError(404, "Motorista não encontrado!");
        }
        if(motorista.status === StatusMotoristaEnum.INATIVO){
            throw new MotoristaError(422, "Motorista inativo!");
        }

        return this.entregaRepository.listarTodos({motoristaId: idMotorista});

        // console.log(entregas);

    }
}