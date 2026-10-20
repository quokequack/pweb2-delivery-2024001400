import { Request, Response } from "express";
import {StatusEntrega} from "../../generated/prisma/enums.js";
import { EntregaError } from "../errors/EntregaError.js";
import { EntregaService } from "../services/EntregaService.js";

export class EntregaController {
    constructor(private service: EntregaService) {}

    criar = async (req: Request, res: Response) => {
        try {
            const entrega = await this.service.novaEntrega(req.body);
            return res.status(201).json(entrega);
        } catch (erro) {
            return this.responderErro(res, erro);
        }
    };

    listar = async (req: Request, res: Response) => {
        try {
            const status = req.query.status;

            if (status === undefined) {
                return res.status(200).json(await this.service.listarEntregas());
            }

            if (typeof status !== "string" || !Object.values(StatusEntrega).includes(status as StatusEntrega)) {
                return res.status(400).json({ erro: "Status inválido" });
            }

            return res.status(200).json(await this.service.porStatus(status as StatusEntrega));
        } catch (erro) {
            return this.responderErro(res, erro);
        }
    };

    buscarPorId = async (req: Request, res: Response) => {
        try {
            const entrega = await this.service.porId(this.obterId(req));

            if (!entrega) {
                return res.status(404).json({ erro: "Entrega não encontrada" });
            }

            return res.status(200).json(entrega);
        } catch (erro) {
            return this.responderErro(res, erro);
        }
    };

    avancar = async (req: Request, res: Response) => {
        try {
            const entrega = await this.service.avancarEntrega(this.obterId(req));

            if (!entrega) {
                return res.status(404).json({ erro: "Entrega não encontrada" });
            }

            return res.status(200).json(entrega);
        } catch (erro) {
            return this.responderErro(res, erro);
        }
    };

    cancelar = async (req: Request, res: Response) => {
        try {
            const entrega = await this.service.cancelarEntrega(this.obterId(req));

            if (!entrega) {
                return res.status(404).json({ erro: "Entrega não encontrada" });
            }

            return res.status(200).json(entrega);
        } catch (erro) {
            return this.responderErro(res, erro);
        }
    };

    buscarHistorico = async (req: Request, res: Response) => {
        try {
            const historico = await this.service.buscaHistorico(this.obterId(req));

            if (!historico) {
                return res.status(404).json({ erro: "Entrega não encontrada" });
            }

            return res.status(200).json(historico);
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
            return res.status(erro.statusCode).json({ erro: erro.message });
        }

        return res.status(500).json({ erro: "Erro interno do servidor" });
    }

    atribuir = async (req: Request, res: Response) => {
        try {
            const idEntrega = this.obterId(req);
            const idMotorista = Number(req.body?.motoristaId);

            if (!Number.isInteger(idMotorista) || idMotorista <= 0) {
                throw new EntregaError(400, "Identificador do motorista inválido");
            }

            const entrega = await this.service.atribuirMotorista(idEntrega, idMotorista);
            return res.status(200).json({ ...entrega, motoristaId: entrega.motorista_id });
        } catch(error){
            return this.responderErro(res, error);
        }
    }
}
