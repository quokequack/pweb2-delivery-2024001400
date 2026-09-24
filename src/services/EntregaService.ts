import {Entrega} from "../database/Entrega.js";
import {StatusEnum} from "../database/StatusEnum.js";
import {IEntregaRepository} from "../interfaces/IEntregaRepository.js";
import {Evento} from "../database/Evento.js";
import {EntregaDTO} from "../dto/EntregaDTO.js";
import {IEntrega} from "../interfaces/IEntrega.js";
import {EntregaError} from "../errors/EntregaError.js";


export class EntregaService {
    constructor(private repository: IEntregaRepository) {}


    novaEntrega(dados: {descricao: string, origem: string, destino: string }){
        if (!dados || !dados.descricao?.trim() || !dados.origem?.trim() || !dados.destino?.trim()) {
            throw new EntregaError(400, "Descrição, origem e destino são obrigatórios");
        }

        const dto = EntregaDTO.porObjeto(dados);
        if(dto.origem.trim() === dto.destino.trim()){
            throw new EntregaError(400, "Origem e destino não podem ser iguais");
        }

        const existeDuplicataAtiva = this.repository.listarEntregas().some((entrega) =>
            (entrega.status === StatusEnum.CRIADA || entrega.status === StatusEnum.EM_TRANSITO) &&
            entrega.descricao === dto.descricao &&
            entrega.origem === dto.origem &&
            entrega.destino === dto.destino,
        );

        if (existeDuplicataAtiva) {
            throw new EntregaError(409, "Já existe uma entrega ativa com os mesmos dados");
        }

        const novaEntrega = this.repository.criar(dto.paraEntrega());
        this.novoEvento(novaEntrega);
        return novaEntrega;
    }

    listarEntregas() : IEntrega[] {
        return this.repository.listarEntregas();
    }

    porId(idEntrega: number): IEntrega | undefined {
        return this.repository.porId(idEntrega);
    }

    porStatus(status: StatusEnum) : IEntrega[] {
        return this.repository.porStatus(status);
    }

    buscaHistorico(idEntrega: number): Evento[] | undefined {
        return this.repository.historico(idEntrega);
    }

    avancarEntrega(idEntrega: number): Entrega | undefined {
        const entrega = this.repository.porId(idEntrega);
        if(!this.entregaExiste(entrega)){
            return undefined;
        }

        switch (entrega.status) {
            case StatusEnum.CRIADA:
                return this.atualizar(entrega, StatusEnum.EM_TRANSITO);
            case StatusEnum.EM_TRANSITO:
                return this.atualizar(entrega, StatusEnum.ENTREGUE);
            default:
                throw new EntregaError(422, "A entrega não pode mais avançar");
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
            throw new EntregaError(422, "Transição de status inválida");
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
        if (novoStatus === StatusEnum.CANCELADA) {
            return entrega.status === StatusEnum.CRIADA ||
                entrega.status === StatusEnum.EM_TRANSITO;
        }

        return (entrega.status === StatusEnum.CRIADA && novoStatus === StatusEnum.EM_TRANSITO) ||
            (entrega.status === StatusEnum.EM_TRANSITO && novoStatus === StatusEnum.ENTREGUE);
    }

    private novoEvento(entrega: Entrega) : void {
        const evento = new Evento({
            data: new Date().toISOString(),
            descricao: entrega.status,
        });
        this.repository.novoRegistroHistorico(entrega, evento);
    }
}
