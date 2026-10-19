/*
  Warnings:

  - You are about to drop the column `placaVeiculo` on the `Motorista` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Evento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entrega_id" INTEGER NOT NULL,
    CONSTRAINT "Evento_entrega_id_fkey" FOREIGN KEY ("entrega_id") REFERENCES "Entrega" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Motorista" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "placa_veiculo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVO'
);
INSERT INTO "new_Motorista" ("cpf", "id", "nome", "status") SELECT "cpf", "id", "nome", "status" FROM "Motorista";
DROP TABLE "Motorista";
ALTER TABLE "new_Motorista" RENAME TO "Motorista";
CREATE UNIQUE INDEX "Motorista_cpf_key" ON "Motorista"("cpf");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
