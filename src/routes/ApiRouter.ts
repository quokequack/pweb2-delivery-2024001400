import {Router} from "express";
import {Database} from "../database/Database.js";
import {EntregaRepository} from "../repositories/EntregaRepository.js";
import {EntregaService} from "../services/EntregaService.js";
import {EntregaController} from "../controllers/EntregaController.js";
import {EntregasRoute} from "./EntregasRoute.js";

export class ApiRouter {
    private router: Router;

    constructor() {
        this.router = Router();
        const database = new Database();
        const repository = new EntregaRepository(database);
        const service = new EntregaService(repository);
        const controller = new EntregaController(service);
        const entregaRoutes = new EntregasRoute(controller);

        this.router.use('/entregas', entregaRoutes.getRouter());
    }

    getRouter() : Router{
        return this.router;
    }

}