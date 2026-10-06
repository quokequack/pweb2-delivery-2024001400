import {Router} from "express";
import {MotoristaController} from "../controllers/MotoristaController.js";

export class MotoristasRoute {
    private router: Router;

    constructor(private controller: MotoristaController) {
        this.router = Router();
        this.configurarRotas();
    }

    private configurarRotas() : void {
        this.router.post('/', this.controller.criar);
    }

    public getRouter() : Router {
        return this.router;
    }
}