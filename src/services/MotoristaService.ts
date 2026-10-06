import {IMotoristaRepository} from "../interfaces/IMotoristaRepository.js";
import {MotoristaError} from "../errors/MotoristaError.js";
import {MotoristaDTO} from "../dto/MotoristaDTO.js";

export class MotoristaService {
    constructor(private repository: IMotoristaRepository){}

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
}