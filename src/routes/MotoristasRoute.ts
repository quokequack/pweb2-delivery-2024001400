import {Router} from "express";
import {MotoristaController} from "../controllers/MotoristaController.js";
import { validarFormularioMotorista }
    from '../middlewares/validarFormularioMotorista.js';

export class MotoristasRoute {
    private router: Router;

    constructor(private controller: MotoristaController) {
        this.router = Router();
        this.configurarRotas();
    }

    private configurarRotas() : void {
        this.router.get('/', this.controller.listarMotoristas);
        this.router.post('/', validarFormularioMotorista, this.controller.criar);
        this.router.get('/:id/entregas', this.controller.entregasPorMotorista);
        this.router.get('/novo', this.controller.formularioNovo)
    }

    public getRouter() : Router {
        return this.router;
    }
}
