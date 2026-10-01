import {Entrega} from "../database/Entrega.js";
import {IEntrega} from "./IEntrega.js";
import {IFiltrosEntrega} from "../repositories/EntregaRepository.js";


export interface IEntregaRepository {

    /**
     * Lista todas as entregas, podendo aplicar filtros opcionais
     */
    listarTodos(filtros?: IFiltrosEntrega) : Entrega[];

    /**
     * Busca a entrega que possui esse id
     */
    buscarPorId(idEntrega: number): Entrega | null;

    /**
     * Cria uma nova entrega
     */
    criar(dadosEntrega: IEntrega): Entrega;

    /**
     * Atualiza uma entrega com base em seu id
     */
    atualizar(idEntrega: number, dados: Partial<IEntrega>): Entrega;
}