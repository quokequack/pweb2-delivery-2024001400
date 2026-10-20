import {Entregas} from "../database/entregas/Entrega.js";
import {StatusEntrega} from "../../generated/prisma/enums.js";
import {IEntregaRepository} from "../interfaces/IEntregaRepository.js";
import {Eventos} from "../database/entregas/Evento.js";
import {CriacaoEntregaDTO} from "../dto/CriacaoEntregaDTO.js";
import {IEntrega} from "../interfaces/IEntrega.js";
import {EntregaError} from "../errors/EntregaError.js";
import {IMotoristaRepository} from "../interfaces/IMotoristaRepository.js";
import {StatusMotoristaEnum} from "../database/motoristas/StatusMotoristaEnum.js";
import {EdicaoEntregaDTO} from "../dto/EdicaoEntregaDTO.js";


export class EntregaService {
    constructor(private repository: IEntregaRepository, private motoristaRepository: IMotoristaRepository) {}


    async novaEntrega(dados: {descricao: string, origem: string, destino: string, historico: Eventos[]}){
        if (!dados || !dados.descricao?.trim() || !dados.origem?.trim() || !dados.destino?.trim()) {
            throw new EntregaError(400, "Descrição, origem e destino são obrigatórios");
        }

        const dto = CriacaoEntregaDTO.porObjeto(dados);
        if(dto.origem.trim() === dto.destino.trim()){
            throw new EntregaError(400, "Origem e destino não podem ser iguais");
        }

        const entregas = await this.repository.listarTodos();
        const existeDuplicataAtiva = entregas.some((entrega) =>
            (entrega.status === StatusEntrega.CRIADA || entrega.status === StatusEntrega.EM_TRANSITO) &&
            entrega.descricao === dto.descricao &&
            entrega.origem === dto.origem &&
            entrega.destino === dto.destino,
        );

        if (existeDuplicataAtiva) {
            throw new EntregaError(409, "Já existe uma entrega ativa com os mesmos dados");
        }

        return this.repository.criar(dto.paraEntrega());
    }

    async listarEntregas() : Promise<IEntrega[]> {
        return await this.repository.listarTodos();
    }

    async porId(idEntrega: number): Promise<IEntrega> {
        const entrega = await this.repository.buscarPorId(idEntrega);
        if(!entrega){
            throw new EntregaError(404, "Entrega não encontrada!");
        }
        return entrega;
    }

    async porStatus(statusBusca: StatusEntrega) : Promise<Entregas[]> {
        return await this.repository.listarTodos({status: statusBusca});
    }

    async buscaHistorico(idEntrega: number): Promise<Eventos[]> {
        const entrega = await this.porId(idEntrega);
        return entrega.historico ?? [];

    }

    async avancarEntrega(idEntrega: number): Promise<Entregas | undefined> {
        const entrega = await this.porId(idEntrega);

        switch (entrega.status) {
            case StatusEntrega.CRIADA:
                return this.atualizar(idEntrega, {status: StatusEntrega.EM_TRANSITO, alteracao: 'Entrega em andamento!'});
            case StatusEntrega.EM_TRANSITO:
                return this.atualizar(idEntrega, {status: StatusEntrega.ENTREGUE, alteracao: 'Entrega finalizada!'});
            default:
                throw new EntregaError(422, "A entrega não pode mais avançar");
        }
    }

    async cancelarEntrega(idEntrega: number): Promise<Entregas> {
        return await this.atualizar(idEntrega, {status: StatusEntrega.CANCELADA, alteracao: 'Entrega cancelada!'});
    }

    async atribuirMotorista(idEntrega: number, idMotorista: number) : Promise<Entregas> {
        const motorista = await this.motoristaRepository.buscarPorId(idMotorista);
        const entrega = await this.repository.buscarPorId(idEntrega);

        if(!motorista){
            throw new EntregaError(404, "Motorista não encontrado!");
        }
        if(motorista.status === StatusMotoristaEnum.INATIVO){
            throw new EntregaError(422, "Motorista inativo!");
        }

        if(!entrega){
            throw new EntregaError(404, "Entrega não encontrada!")
        }

        if(entrega.status !== StatusEntrega.CRIADA){
            throw new EntregaError(422, "Entrega com status inválido!");
        }

        return await this.atualizar(idEntrega, {motorista_id: idMotorista, alteracao: `Motorista ${motorista.nome} atribuído!`})

    }

    private async atualizar(idEntrega: number, dados: EdicaoEntregaDTO): Promise<Entregas> {
        if(dados.status){
            if(!await this.validaStatus(idEntrega, dados.status)){
                throw new EntregaError(422, "Transição de status inválida");
            }
        }
        const entregaAtualizada = await this.repository.atualizar(idEntrega, dados);
        return entregaAtualizada;
    }

    private async validaStatus(idEntrega: number, novoStatus: StatusEntrega){
        const entrega = await this.repository.buscarPorId(idEntrega);

        if (novoStatus === StatusEntrega.CANCELADA) {
            return entrega.status === StatusEntrega.CRIADA || entrega.status === StatusEntrega.EM_TRANSITO;
        }

        return (entrega.status === StatusEntrega.CRIADA && novoStatus === StatusEntrega.EM_TRANSITO) ||
            (entrega.status === StatusEntrega.EM_TRANSITO && novoStatus === StatusEntrega.ENTREGUE);
    }
}
