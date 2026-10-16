interface IEvento {
    data: string;
    descricao: string;
}

export class Evento{
    data: string;
    descricao: string;

    constructor(data: IEvento){
        this.data = data.data;
        this.descricao = data.descricao;
    }

}