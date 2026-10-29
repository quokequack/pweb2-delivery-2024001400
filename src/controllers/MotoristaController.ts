import {MotoristaService} from "../services/MotoristaService.js";
import {Request, Response} from "express";
import {MotoristaError} from "../errors/MotoristaError.js";
import {StatusEntrega} from "../../generated/prisma/enums.js";
import {EntregaError} from "../errors/EntregaError.js";

export class MotoristaController {
    constructor(private readonly motoristaService: MotoristaService) {}

    criar = async (req: Request, res: Response) => {
        const dados = {
            nome: req.body.nome ?? '',
            cpf: req.body.cpf ?? '',
            placaVeiculo: req.body.placaVeiculo || null
        };

        try {
            await this.motoristaService.criar(dados);

            req.flash(
                'success',
                'Motorista cadastrado com sucesso!'
            );

            return res.redirect(303, '/motoristas');

        } catch (erro) {
            if (erro instanceof MotoristaError) {
                return res.status(erro.statusCode).render(
                    'motoristas/novo',
                    {
                        titulo: 'Novo Motorista',
                        dados,
                        erros: [erro.message]
                    }
                );
            }

            return this.responderErro(res, erro);
        }
    };

    entregasPorMotorista = async (req: Request, res: Response) => {
        try {
            const idMotorista = Number(req.params.id);
            if (!Number.isInteger(idMotorista) || idMotorista <= 0) {
                throw new MotoristaError(400, "Identificador do motorista inválido");
            }

            const status = req.query.status;
            if (status !== undefined &&
                (typeof status !== "string" || !Object.values(StatusEntrega).includes(status as StatusEntrega))) {
                throw new MotoristaError(400, "Status inválido");
            }

            const entregas = await this.motoristaService.entregasPorMotorista(
                idMotorista,
                status as StatusEntrega | undefined,
            );
            return res.status(200).json(entregas.map((entrega) => ({
                ...entrega,
                motoristaId: entrega.motorista_id,
            })));
        } catch (error) {
            return this.responderErro(res, error);
        }
    }
    listarMotoristas = async (req: Request, res: Response) => {
        try{
            const motoristas = await this.motoristaService.motoristas();
            return res.status(200).render('motoristas/index', {
                titulo: 'Motoristas',
                motoristas
            });
        } catch (error) {
            this.responderErro(res, error);
        }
    }

    formularioNovo = (req: Request, res: Response) => {
        return res.status(200).render('motoristas/novo', {
            titulo: 'Novo Motorista',
            dados: {
                nome: '',
                cpf: '',
                placaVeiculo: ''
            },
            erros: []
        });
    };


    private responderErro(res: Response, erro: unknown) {
        if (erro instanceof MotoristaError) {
            const status = erro.statusCode;

            return res.status(status).render(
                status === 404
                    ? 'errors/404'
                    : 'errors/generico',
                {
                    titulo: `Erro ${status}`,
                    mensagem: erro.message
                }
            );
        }

        console.error(erro);

        return res.status(500).render('errors/generico', {
            titulo: 'Erro interno',
            mensagem: 'Ocorreu um erro inesperado.'
        });
    }

}
