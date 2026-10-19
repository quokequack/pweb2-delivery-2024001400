import {IEntregaRepository} from "../interfaces/IEntregaRepository.js";
import {IEntrega} from "../interfaces/IEntrega.js";
import {StatusEntrega} from "../../generated/prisma/enums.js";
import {Entregas} from "../database/entregas/Entrega.js";
import {prisma} from "../database/prisma.js";
import {EdicaoEntregaDTO} from "../dto/EdicaoEntregaDTO.js";

export interface IFiltrosEntrega {
    status?: StatusEntrega;
    origem?: string;
    destino?: string;
    motoristaId?: number;
}

export class EntregaRepository implements IEntregaRepository {

    constructor() {}

    async listarTodos(filtros?: IFiltrosEntrega): Promise<Entregas[]> {
        const entregas = await prisma.entrega.findMany({
            where: {
                ...(filtros?.status && {
                    status: filtros.status
                }),
                ...(filtros?.origem && {
                    origem: filtros.origem
                }),
                ...(filtros?.destino && {
                    destino: filtros.destino
                }),
                ...(filtros?.motoristaId  != null && {
                    motorista_id: filtros.motoristaId
                }),
            },
            include: {
                historico: true,
            }
        });
        return entregas;

    }

    async buscarPorId(idEntrega: number): Promise<Entregas|null> {
        return prisma.entrega.findUnique({
            where: {
                id: idEntrega
            },
            include: {
                historico: true,
            }
        });
    }

    async criar(dadosEntrega: IEntrega): Promise<Entregas> {
        const nova = await prisma.entrega.create({
            data: {
                descricao: dadosEntrega.descricao,
                origem: dadosEntrega.origem,
                destino: dadosEntrega.destino,
                status: dadosEntrega.status,

                historico: {
                    create: {
                        descricao: "CRIADA",
                        data: new Date()
                    }
                },
            },
            include: {
                historico: true,
            }
        });

        return nova;
    }

    async atualizar(idEntrega: number, dados: EdicaoEntregaDTO) : Promise<Entregas> {
        const entrega = await prisma.entrega.update({
            where: {
                id: idEntrega
            },

            data: {
                ...(dados?.status && {
                    status: dados.status,
                }),
                ...(dados?.origem && {
                    origem: dados.origem,
                }),
                ...(dados?.destino && {
                    destino: dados.destino,
                }),
                ...(dados?.motorista_id && {
                    motorista_id: dados.motorista_id,
                }),

                historico: {
                    create: {
                        descricao: dados.alteracao,
                        data: new Date()
                    }
                }
            },
            include: {
                historico: true,
            }
        })

        return entrega;
    }

}

