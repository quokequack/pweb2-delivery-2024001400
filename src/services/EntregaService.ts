import {Entrega} from "../database/Entrega.js";
import {StatusEnum} from "../database/StatusEnum.js";
import {IEntregaRepository} from "../interfaces/IEntregaRepository.js";
import {Evento} from "../database/Evento.js";
import {EntregaDTO} from "../dto/EntregaDTO.js";
import {IEntrega} from "../interfaces/IEntrega.js";
import {EntregaError} from "../errors/EntregaError.js";


export class EntregaService {
    constructor(private repository: IEntregaRepository) {}


    novaEntrega(dados: {descricao: string, origem: string, destino: string, historico: Evento[]}){
        if (!dados || !dados.descricao?.trim() || !dados.origem?.trim() || !dados.destino?.trim()) {
            throw new EntregaError(400, "Descrição, origem e destino são obrigatórios");
        }

        const dto = EntregaDTO.porObjeto(dados);
        if(dto.origem.trim() === dto.destino.trim()){
            throw new EntregaError(400, "Origem e destino não podem ser iguais");
        }

        const existeDuplicataAtiva = this.repository.listarTodos().some((entrega) =>
            (entrega.status === StatusEnum.CRIADA || entrega.status === StatusEnum.EM_TRANSITO) &&
            entrega.descricao === dto.descricao &&
            entrega.origem === dto.origem &&
            entrega.destino === dto.destino,
        );

        if (existeDuplicataAtiva) {
            throw new EntregaError(409, "Já existe uma entrega ativa com os mesmos dados");
        }

        const novaEntrega = this.repository.criar(dto.paraEntrega());
        return novaEntrega;
    }

    listarEntregas() : IEntrega[] {
        return this.repository.listarTodos();
    }

    porId(idEntrega: number): IEntrega {
        const entrega = this.repository.buscarPorId(idEntrega);
        if(!entrega){
            throw new EntregaError(404, "Entrega não encontrada!");
        }
        return entrega;
    }

    porStatus(statusBusca: StatusEnum) : Entrega[] {
        return this.repository.listarTodos({status: statusBusca});
    }

    buscaHistorico(idEntrega: number): Evento[] {
        const entrega = this.porId(idEntrega);
        return entrega.historico ?? [];

    }

    avancarEntrega(idEntrega: number): Entrega | undefined {
        const entrega = this.porId(idEntrega);

        switch (entrega.status) {
            case StatusEnum.CRIADA:
                return this.atualizar(idEntrega, {status: StatusEnum.EM_TRANSITO});
            case StatusEnum.EM_TRANSITO:
                return this.atualizar(idEntrega, {status: StatusEnum.ENTREGUE});
            default:
                throw new EntregaError(422, "A entrega não pode mais avançar");
        }
    }

    cancelarEntrega(idEntrega: number): Entrega {
        return this.atualizar(idEntrega, {status: StatusEnum.CANCELADA});
    }

    private atualizar(idEntrega: number, dados: Partial<IEntrega>): Entrega {
        const entrega = this.porId(idEntrega);
        if(dados.status){
            if(!this.validaStatus(idEntrega, dados.status)){
                throw new EntregaError(422, "Transição de status inválida");
            }
            const evento = this.adicionaEvento(dados.status);

            dados.historico = [...(entrega.historico ?? []), evento];
        }
        const entregaAtualizada = this.repository.atualizar(idEntrega, dados);
        return entregaAtualizada;
    }

    private validaStatus(idEntrega: number, novoStatus: StatusEnum){
        const entrega = this.porId(idEntrega);

        if (novoStatus === StatusEnum.CANCELADA) {
            return entrega.status === StatusEnum.CRIADA ||
                entrega.status === StatusEnum.EM_TRANSITO;
        }

        return (entrega.status === StatusEnum.CRIADA && novoStatus === StatusEnum.EM_TRANSITO) ||
            (entrega.status === StatusEnum.EM_TRANSITO && novoStatus === StatusEnum.ENTREGUE);
    }

    private adicionaEvento(novoStatus: StatusEnum) : Evento {
        return new Evento({
            data: new Date().toISOString(),
            descricao: novoStatus
        })
    }
}
