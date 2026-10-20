import {MotoristaService} from "../services/MotoristaService.js";
import {Request, Response} from "express";
import {MotoristaError} from "../errors/MotoristaError.js";
import {StatusEntrega} from "../../generated/prisma/enums.js";

export class MotoristaController {
    constructor(private readonly motoristaService: MotoristaService) {}

    criar = async (req: Request, res: Response) => {
        try {
            const motorista = await this.motoristaService.criar(req.body);
            res.status(201).send(motorista);
        } catch (error) {
            this.responderErro(res, error);
        }
    }

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

    private responderErro(res: Response, erro: unknown) {
        if (erro instanceof MotoristaError) {
            return res.status(erro.statusCode).json({ erro: erro.message });
        }

        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
}
