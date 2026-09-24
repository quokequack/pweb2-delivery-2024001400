import {Router} from "express";
import {EntregaController} from "../controllers/EntregaController.js";

export class EntregasRoute {
    private router: Router;

    constructor(private controller: EntregaController) {
        this.router = Router();
        this.configurarRotas();
    }

    private configurarRotas() : void {
        this.router.get('/', this.controller.listar);
        this.router.post('/', this.controller.criar);
        this.router.patch('/:id/avancar', this.controller.avancar);
        this.router.patch('/:id/cancelar', this.controller.cancelar);
        this.router.get('/:id/historico', this.controller.buscarHistorico);
        this.router.get('/:id', this.controller.buscarPorId);
    }

    public getRouter() : Router {
        return this.router;
    }
}
