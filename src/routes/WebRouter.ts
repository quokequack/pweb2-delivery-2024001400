import {Router} from "express";
import {EntregaRepository} from "../repositories/EntregaRepository.js";
import {EntregaService} from "../services/EntregaService.js";
import {EntregaController} from "../controllers/EntregaController.js";
import {EntregasRoute} from "./EntregasRoute.js";
import {MotoristaRepository} from "../repositories/MotoristaRepository.js";
import {MotoristaService} from "../services/MotoristaService.js";
import {MotoristaController} from "../controllers/MotoristaController.js";
import {MotoristasRoute} from "./MotoristasRoute.js";

export class WebRouter {
    private router: Router;

    constructor() {
        this.router = Router();
        const entregaRepository = new EntregaRepository();
        const motoristaRepository = new MotoristaRepository();

        const entregaService = new EntregaService(
            entregaRepository,
            motoristaRepository
        );

        const motoristaService = new MotoristaService(
            motoristaRepository,
            entregaRepository
        );

        const entregaController = new EntregaController(
            entregaService,
            motoristaService
        );

        const motoristaController = new MotoristaController(
            motoristaService
        );

        const entregaRoutes = new EntregasRoute(entregaController);
        const motoristaRoutes = new MotoristasRoute(motoristaController);

        this.router.use('/entregas', entregaRoutes.getRouter());
        this.router.use('/motoristas', motoristaRoutes.getRouter());
    }

    getRouter() : Router{
        return this.router;
    }

}