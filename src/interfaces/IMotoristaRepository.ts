import {Motoristas} from "../database/motoristas/Motorista.js";
import {IMotorista} from "./IMotorista.js";

export interface IMotoristaRepository {
    /**
     * Lista todos os motoristas.
     */
    listarTodos() : Promise<Motoristas[]>
    /**
     * Busca um motorista pelo id informado, retorna null caso não encontre.
     */
    buscarPorId(id: number) : Promise<Motoristas | null>
    /**
     * Busca um motorista pelo cpf informado, retorna null caso não encontre.
     */
    buscarPorCpf(cpf: string) : Promise<Motoristas | null>
    /**
     * Cria um motorista novo com os dados do DTO.
     */
    criar(dados: IMotorista) : Promise<Motoristas>
}

