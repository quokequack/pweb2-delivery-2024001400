import {Entrega} from "../database/Entrega";
import {StatusEnum} from "../database/StatusEnum";
import {IEntregaRepository} from "../interfaces/IEntregaRepository";
import {Evento} from "../database/Evento";


export class EntregaService {

    constructor(private repository: IEntregaRepository) {}

    avancarEntrega(idEntrega: number): Entrega | undefined {
        const entrega = this.repository.porId(idEntrega);
        if(!this.entregaExiste(entrega)){
            return undefined;
        }
        switch (entrega.status) {
            case StatusEnum.CRIADA:
                return this.atualizar(entrega, StatusEnum.EM_TRANSITO)
            case StatusEnum.EM_TRANSITO:
                return this.atualizar(entrega, StatusEnum.ENTREGUE)
        }

    }

    cancelarEntrega(idEntrega: number): Entrega | undefined {
        const entrega = this.repository.porId(idEntrega);
        if(!this.entregaExiste(entrega)){
            return undefined;
        }

        return this.atualizar(entrega, StatusEnum.CANCELADA);

    }

    private atualizar(entrega: Entrega, status: StatusEnum): Entrega | undefined {
        if(!this.validaStatus(entrega, status)){
            return undefined;
        }

        const entregaAtualizada = this.repository.atualizar(entrega, {
            status: status,
        });
        this.novoEvento(entregaAtualizada);
        return entregaAtualizada;
    }

    private entregaExiste(entrega: Entrega | undefined) : entrega is Entrega {
        if(!entrega) {
            return false;
        }
        return true;
    }

    private validaStatus(entrega: Entrega, novoStatus: StatusEnum){
        if(entrega.status === novoStatus) {
            return false;
        }

        if(entrega.status === StatusEnum.CANCELADA) {
            return false;
        }

        if(entrega.status === StatusEnum.ENTREGUE) {
            return false;
        }
        return true;
    }

    private novoEvento(entrega: Entrega) : void {
        const evento = new Evento({
            data: new Date().toISOString(),
            descricao: entrega.status,
        });
        this.repository.novoRegistroHistorico(entrega, evento);
    }



}