import {MotoristaService} from "../services/MotoristaService.js";
import {Request, Response} from "express";
import {EntregaError} from "../errors/EntregaError.js";
import {MotoristaError} from "../errors/MotoristaError.js";

export class MotoristaController {
    constructor(private readonly motoristaService: MotoristaService) {}

    criar = async (req: Request, res: Response) => {
        try {
            const motorista = this.motoristaService.criar(req.body);
            res.status(201).send(motorista);
        } catch (error) {
            this.responderErro(res, error);
        }
    }

    private responderErro(res: Response, erro: unknown) {
        if (erro instanceof MotoristaError) {
            return res.status(erro.statusCode).json({ erro: erro.message });
        }

        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
}