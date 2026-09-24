import {IEvento} from "../interfaces/IEvento";

export class Evento implements IEvento{
    data: string;
    descricao: string;

    constructor(data: IEvento){
        this.data = data.data;
        this.descricao = data.descricao;
    }

}