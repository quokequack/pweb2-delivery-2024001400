import {Router} from "express";
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
        const entregaRepository = new EntregaRepository();

        const motoristaRepository = new MotoristaRepository();
        const entregaService = new EntregaService(entregaRepository, motoristaRepository);
        const entregaController = new EntregaController(entregaService);
        const entregaRoutes = new EntregasRoute(entregaController);

        const motoristaService = new MotoristaService(motoristaRepository, entregaRepository);
        const motoristaController = new MotoristaController(motoristaService);
        const motoristaRoutes = new MotoristasRoute(motoristaController);

        this.router.use('/entregas', entregaRoutes.getRouter());
        this.router.use('/motoristas', motoristaRoutes.getRouter());
    }

    getRouter() : Router{
        return this.router;
    }

}