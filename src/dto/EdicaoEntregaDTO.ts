import {IEntrega} from "../interfaces/IEntrega.js";
import {Evento} from "../../generated/prisma/client.js";

export type EdicaoEntregaDTO =
    Partial<Pick<
        IEntrega,
        "status" | "origem" | "destino" | "motorista_id" | "historico"
    >> & { alteracao: string; };