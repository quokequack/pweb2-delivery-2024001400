
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validarFormularioMotorista = [
    body('nome')
        .isString()
        .withMessage('Nome inválido')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('Nome é obrigatório'),

    body('cpf')
        .isString()
        .withMessage('CPF inválido')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('CPF é obrigatório'),

    (req: Request, res: Response, next: NextFunction) => {
        const resultado = validationResult(req);

        if (resultado.isEmpty()) {
            return next();
        }

        return res.status(400).render('motoristas/novo', {
            titulo: 'Novo Motorista',
            dados: {
                nome: req.body.nome ?? '',
                cpf: req.body.cpf ?? '',
                placaVeiculo: req.body.placaVeiculo ?? ''
            },
            erros: resultado.array().map(erro => erro.msg)
        });
    }
];
