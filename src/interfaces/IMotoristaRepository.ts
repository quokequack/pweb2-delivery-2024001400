import {Motorista} from "../database/Motorista.js";
import {IMotorista} from "./IMotorista.js";

export interface IMotoristaRepository {
    /**
     * Lista todos os motoristas.
     */
    listarTodos() : Motorista[]
    /**
     * Busca um motorista pelo id informado, retorna null caso não encontre.
     */
    buscarPorId(id: number) : Motorista | null
    /**
     * Busca um motorista pelo cpf informado, retorna null caso não encontre.
     */
    buscarPorCpf(cpf: string) : Motorista | null
    /**
     * Cria um motorista novo com os dados do DTO.
     */
    criar(dados: IMotorista) : Motorista
}

