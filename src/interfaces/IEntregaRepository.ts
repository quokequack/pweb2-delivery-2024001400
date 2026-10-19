import {IEntrega} from "./IEntrega.js";
import {IFiltrosEntrega} from "../repositories/EntregaRepository.js";
import {EdicaoEntregaDTO} from "../dto/EdicaoEntregaDTO.js";
import {Entregas} from "../database/entregas/Entrega.js";

export interface IEntregaRepository {

    /**
     * Lista todas as entregas, podendo aplicar filtros opcionais
     */
    listarTodos(filtros?: IFiltrosEntrega) : Promise<Entregas[]>;

    /**
     * Busca a entrega que possui esse id
     */
    buscarPorId(idEntrega: number): Promise<Entregas | null>;

    /**
     * Cria uma nova entrega
     */
    criar(dadosEntrega: IEntrega): Promise<Entregas>;

    /**
     * Atualiza uma entrega com base em seu id
     */
    atualizar(idEntrega: number, dados: Partial<EdicaoEntregaDTO>): Promise<Entregas>;
}