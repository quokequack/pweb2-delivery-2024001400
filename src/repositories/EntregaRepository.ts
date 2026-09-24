import {IEntregaRepository} from "../interfaces/IEntregaRepository";
import {Database} from "../database/Database";
import {Entrega} from "../database/Entrega";
import {IEntrega} from "../interfaces/IEntrega";
import {Evento} from "../database/Evento";
import {StatusEnum} from "../database/StatusEnum";

export class EntregaRepository implements IEntregaRepository {

    constructor(private database: Database) {}

    atualizar(entrega: Entrega, dados: Partial<IEntrega>) : Entrega {
        Object.assign(entrega, dados);
        return entrega;
    }

    criar(dadosEntrega: IEntrega): Entrega {
        const nova = new Entrega(this.database.proximoIdEntrega++, dadosEntrega);
        this.database.entregas.push(nova);
        return nova;
    }

    historico(idEntrega: number): Evento[] | undefined {
        const entrega = this.porId(idEntrega);
        return entrega?.historico;
    }

    listarEntregas(): Entrega[] {
        return this.database.entregas;
    }

    porId(idEntrega: number): Entrega | undefined {
        return this.database.entregas.find((entrega) => entrega.id === idEntrega);
    }

    porStatus(status: StatusEnum): Entrega[] {
        return this.database.entregas.filter((entrega) => entrega.status === status);
    }

    novoRegistroHistorico(entrega: Entrega, evento: Evento) : void{
        entrega.historico.push(evento);
    }

}

