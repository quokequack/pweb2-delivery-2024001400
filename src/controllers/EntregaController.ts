import { Request, Response } from "express";
import {StatusEntrega} from "../../generated/prisma/enums.js";
import { EntregaError } from "../errors/EntregaError.js";
import { EntregaService } from "../services/EntregaService.js";
import { MotoristaService } from '../services/MotoristaService.js';

export class EntregaController {
    constructor(private service: EntregaService, private motoristaService: MotoristaService) {}

    criar = async (req: Request, res: Response) => {
        const dados = {
            descricao: req.body.descricao ?? '',
            origem: req.body.origem ?? '',
            destino: req.body.destino ?? '',
        }

        try {
            const entrega = await this.service.novaEntrega({...dados, historico: []});
            req.flash('success', 'Entrega criada com sucesso!');
            return res.redirect(303, `/entregas/${entrega.id}`)
        } catch (erro) {
            const status = erro instanceof EntregaError
                ? erro.statusCode
                : 500;

            if (status >= 500) {
                return this.responderErro(res, erro);
            }

            return res.status(status).render('entregas/nova', {
                titulo: 'Nova Entrega',
                dados,
                erros: [
                    erro instanceof Error
                        ? erro.message
                        : 'Erro ao criar entrega'
                ]
            });
        }
    };

    formularioNova = (req: Request, res: Response) => {
        return res.render('entregas/nova', {
            titulo: 'Nova Entrega',
            erros: [],
            dados: {
                descricao: '',
                origem: '',
                destino: ''
            }
        });
    }

    listar = async (req: Request, res: Response) => {
        try {
            const status = req.query.status;
            let entregas;

            if (status === undefined || status === "") {
                entregas = await this.service.listarEntregas();
            } else {
                if (
                    typeof status !== 'string' ||
                    !Object.values(StatusEntrega)
                        .includes(status as StatusEntrega)
                ) {
                    return res.status(400).render('errors/404', {
                        titulo: 'Filtro inválido'
                    });
                }

                entregas = await this.service.porStatus(
                    status as StatusEntrega
                );

            }

            return res.render('entregas/index', {
                titulo: 'Entregas',
                entregas,
                statusSelecionado: status ?? ''
            });
        } catch (erro) {
            return this.responderErro(res, erro);
        }
    };


    buscarPorId = async (req: Request, res: Response) => {
        try {
            const id = this.obterId(req);

            const entrega = await this.service.porId(id);
            const historico =
                await this.service.buscaHistorico(id);

            const motoristas =
                await this.motoristaService.motoristas();

            return res.status(200).render(
                'entregas/detalhe',
                {
                    titulo: `Entrega #${id}`,
                    entrega,
                    historico,
                    motoristas
                }
            );

        } catch (erro) {
            return this.responderErro(res, erro);
        }
    };


    avancar = async (req: Request, res: Response) => {
        try {
            const id = this.obterId(req);
            const entrega = await this.service.avancarEntrega(id);

            if (!entrega) {
                return res.status(404).render('errors/404', {
                    titulo: 'Entrega não encontrada',
                    mensagem: 'A entrega solicitada não existe.'
                });
            }

            req.flash('success', 'Status atualizado!');
            return res.redirect(303, `/entregas/${id}`);
        } catch (erro) {
            return this.responderErro(res, erro);
        }
    };

    cancelar = async (req: Request, res: Response) => {
        try {
            const id = this.obterId(req);
            const entrega = await this.service.cancelarEntrega(id);

            if (!entrega) {
                return res.status(404).render('errors/404', {
                    titulo: 'Entrega não encontrada',
                    mensagem: 'A entrega solicitada não existe.'
                });
            }

            req.flash('success', 'Status atualizado!');
            return res.redirect(303, `/entregas/${id}`);
        } catch (erro) {
            return this.responderErro(res, erro);
        }
    };

    buscarHistorico = async (req: Request, res: Response) => {
        try {
            const id = this.obterId(req);
            const historico = await this.service.buscaHistorico(id);

            if (!historico) {
                return res.status(404).render('errors/404', {
                    titulo: 'Entrega não encontrada',
                    mensagem: 'A entrega solicitada não existe.'
                });
            }

            return res.render('entregas/detalhe', {
                titulo: `Histórico da entrega #${id}`,
                historico
            })
        } catch (erro) {
            return this.responderErro(res, erro);
        }
    };

    private obterId(req: Request): number {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            throw new EntregaError(400, "Identificador da entrega inválido");
        }

        return id;
    }


    private responderErro(res: Response, erro: unknown) {
        if (erro instanceof EntregaError) {
            return res.status(erro.statusCode).render(
                'errors/generico',
                {
                    titulo: 'Erro',
                    mensagem: erro.message
                }
            );
        }

        console.error(erro);

        return res.status(500).render('errors/generico', {
            titulo: 'Erro interno',
            mensagem: 'Ocorreu um erro inesperado'
        });
    }


    atribuir = async (req: Request, res: Response) => {
        try {
            const idEntrega = this.obterId(req);
            const idMotorista = Number(req.body?.motoristaId);

            if (!Number.isInteger(idMotorista) || idMotorista <= 0) {
                throw new EntregaError(400, "Identificador do motorista inválido");
            }

            await this.service.atribuirMotorista(idEntrega, idMotorista);

            req.flash('success', 'Status atualizado!');
            return res.redirect(303, `/entregas/${idEntrega}`);
        } catch(error){
            return this.responderErro(res, error);
        }
    }
}
