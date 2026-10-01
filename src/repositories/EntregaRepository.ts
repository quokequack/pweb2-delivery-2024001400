import {IEntregaRepository} from "../interfaces/IEntregaRepository.js";
import {Database} from "../database/Database.js";
import {Entrega} from "../database/Entrega.js";
import {IEntrega} from "../interfaces/IEntrega.js";
import {StatusEnum} from "../database/StatusEnum.js";

export interface IFiltrosEntrega {
    status?: StatusEnum;
    origem?: string;
    destino?: string;
    motoristaId?: number;
}

export class EntregaRepository implements IEntregaRepository {

    constructor(private database: Database) {}

    listarTodos(filtros?: IFiltrosEntrega): Entrega[] {
        const entregas = this.database.entregas;
        if(!filtros) {
            return entregas;
        }
        return this.filtraEntregas(entregas, filtros);

    }

    buscarPorId(idEntrega: number): Entrega | null {
        return this.database.entregas.find((entrega) => entrega.id === idEntrega) ?? null;
    }

    criar(dadosEntrega: IEntrega): Entrega {
        const nova = new Entrega(this.database.proximoIdEntrega++, dadosEntrega);
        this.database.entregas.push(nova);
        return nova;
    }

    atualizar(idEntrega: number, dados: Partial<IEntrega>) : Entrega {
        const entrega = this.buscarPorId(idEntrega) as Entrega;
        Object.assign(entrega, dados);
        return entrega;
    }

    private filtraEntregas(entregas: Entrega[], filtros: IFiltrosEntrega) {
        return entregas.filter((entrega) => {
            if (filtros.status && entrega.status !== filtros.status) {
                return false;
            }

            if (filtros.origem && entrega.origem !== filtros.origem) {
                return false;
            }

            if (filtros.destino && entrega.destino !== filtros.destino) {
                return false;
            }

            if (filtros.motoristaId !== null && entrega.motoristaId !== filtros.motoristaId) {
                return false;
            }
            return true;
        })
    }



}

