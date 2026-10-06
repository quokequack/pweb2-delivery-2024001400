import {Router} from "express";
import {Database} from "../database/Database.js";
import {EntregaRepository} from "../repositories/EntregaRepository.js";
import {EntregaService} from "../services/EntregaService.js";
import {EntregaController} from "../controllers/EntregaController.js";
import {EntregasRoute} from "./EntregasRoute.js";
import {MotoristaRepository} from "../repositories/MotoristaRepository.js";
import {MotoristaService} from "../services/MotoristaService.js";
import {MotoristaController} from "../controllers/MotoristaController.js";
import {MotoristasRoute} from "./MotoristasRoute.js";

export class ApiRouter {
    private router: Router;

    constructor() {
        this.router = Router();
        const database = new Database();
        const repository = new EntregaRepository(database);

        const motoristaRepository = new MotoristaRepository(database);
        const service = new EntregaService(repository, motoristaRepository);
        const controller = new EntregaController(service);
        const entregaRoutes = new EntregasRoute(controller);

        const motoristaService = new MotoristaService(motoristaRepository);
        const motoristaController = new MotoristaController(motoristaService);
        const motoristaRoutes = new MotoristasRoute(motoristaController);


        this.router.use('/entregas', entregaRoutes.getRouter());
        this.router.use('/motoristas', motoristaRoutes.getRouter());
    }

    getRouter() : Router{
        return this.router;
    }

}