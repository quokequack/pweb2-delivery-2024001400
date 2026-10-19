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
            const idMotorista = req.params.id as unknown as number;
            if(req.query.status){
                const status = req.query.status as StatusEntrega;
                res.status(200).json(this.motoristaService.entregasPorMotorista(idMotorista, status));
            }
            const entregas  = await this.motoristaService.entregasPorMotorista(idMotorista);
            res.status(200).json(entregas);
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