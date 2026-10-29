
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validarFormularioEntrega = [
    body('descricao')
        .isString()
        .withMessage('Descrição inválida')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('Descrição é obrigatória'),

    body('origem')
        .isString()
        .withMessage('Origem inválida')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('Origem é obrigatória'),

    body('destino')
        .isString()
        .withMessage('Destino inválido')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('Destino é obrigatório'),

    (req: Request, res: Response, next: NextFunction) => {
        const resultado = validationResult(req);

        if (resultado.isEmpty()) {
            return next();
        }

        return res.status(400).render('entregas/nova', {
            titulo: 'Nova Entrega',
            dados: {
                descricao: req.body.descricao ?? '',
                origem: req.body.origem ?? '',
                destino: req.body.destino ?? ''
            },
            erros: resultado.array().map(erro => erro.msg)
        });
    }
];
