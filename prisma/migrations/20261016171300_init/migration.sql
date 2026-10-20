-- CreateTable
CREATE TABLE "Motorista" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "placaVeiculo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVO'
);

-- CreateTable
CREATE TABLE "Entrega" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CRIADA',
    "motorista_id" INTEGER NOT NULL,
    CONSTRAINT "Entrega_motorista_id_fkey" FOREIGN KEY ("motorista_id") REFERENCES "Motorista" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Motorista_cpf_key" ON "Motorista"("cpf");
