import { Request, Response } from "express";
import { StatusEnum } from "../database/StatusEnum.js";
import { EntregaError } from "../errors/EntregaError.js";
import { EntregaService } from "../services/EntregaService.js";

export class EntregaController {
    constructor(private service: EntregaService) {}

    criar = (req: Request, res: Response) => {
        try {
            const entrega = this.service.novaEntrega(req.body);
            return res.status(201).json(entrega);
        } catch (erro) {
            return this.responderErro(res, erro);
        }
    };

    listar = (req: Request, res: Response) => {
        try {
            const status = req.query.status;

            if (status === undefined) {
                return res.status(200).json(this.service.listarEntregas());
            }

            if (typeof status !== "string" || !Object.values(StatusEnum).includes(status as StatusEnum)) {
                return res.status(400).json({ erro: "Status inválido" });
            }

            return res.status(200).json(this.service.porStatus(status as StatusEnum));
        } catch (erro) {
            return this.responderErro(res, erro);
        }
    };

    buscarPorId = (req: Request, res: Response) => {
        try {
            const entrega = this.service.porId(this.obterId(req));

            if (!entrega) {
                return res.status(404).json({ erro: "Entrega não encontrada" });
            }

            return res.status(200).json(entrega);
        } catch (erro) {
            return this.responderErro(res, erro);
        }
    };

    avancar = (req: Request, res: Response) => {
        try {
            const entrega = this.service.avancarEntrega(this.obterId(req));

            if (!entrega) {
                return res.status(404).json({ erro: "Entrega não encontrada" });
            }

            return res.status(200).json(entrega);
        } catch (erro) {
            return this.responderErro(res, erro);
        }
    };

    cancelar = (req: Request, res: Response) => {
        try {
            const entrega = this.service.cancelarEntrega(this.obterId(req));

            if (!entrega) {
                return res.status(404).json({ erro: "Entrega não encontrada" });
            }

            return res.status(200).json(entrega);
        } catch (erro) {
            return this.responderErro(res, erro);
        }
    };

    buscarHistorico = (req: Request, res: Response) => {
        try {
            const historico = this.service.buscaHistorico(this.obterId(req));

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
}
