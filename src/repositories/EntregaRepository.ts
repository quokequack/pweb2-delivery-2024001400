import {IEntregaRepository} from "../interfaces/IEntregaRepository.js";
import {Database} from "../database/Database.js";
import {IEntrega} from "../interfaces/IEntrega.js";
import {StatusEnum} from "../database/entregas/StatusEnum.js";
import {Entregas} from "../database/entregas/Entrega.js";
import {prisma} from "../database/prisma.js";

export interface IFiltrosEntrega {
    status?: StatusEnum;
    origem?: string;
    destino?: string;
    motoristaId?: number;
}

export class EntregaRepository implements IEntregaRepository {

    constructor(private database: Database) {}

    async listarTodos(filtros?: IFiltrosEntrega): Promise<Entregas[]> {
        const entregas = await prisma.entrega.findMany();
        if(!filtros) {
            return entregas;
        }
        return this.filtraEntregas(entregas, filtros);

    }

    buscarPorId(idEntrega: number): Entregas | null {
        //TODO: atualizar pro prisma
    }

    criar(dadosEntrega: IEntrega): Entregas {
        const nova = new Entregas(this.database.proximoIdEntrega++, dadosEntrega);
        this.database.entregas.push(nova);
        return nova;
        //TODO: atualizar pro prisma
    }

    atualizar(idEntrega: number, dados: Partial<IEntrega>) : Entrega {
        const entrega = this.buscarPorId(idEntrega) as Entrega;
        Object.assign(entrega, dados);
        return entrega;
        //TODO: atualizar pro prisma
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

            if (filtros.motoristaId !== null && entrega.motoristaId != filtros.motoristaId) {
                return false;
            }
            return true;
            //TODO: atualizar pro prisma
        })
    }



}

