-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entrega" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CRIADA',
    "motorista_id" INTEGER,
    CONSTRAINT "Entrega_motorista_id_fkey" FOREIGN KEY ("motorista_id") REFERENCES "Motorista" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Entrega" ("descricao", "destino", "id", "motorista_id", "origem", "status") SELECT "descricao", "destino", "id", "motorista_id", "origem", "status" FROM "Entrega";
DROP TABLE "Entrega";
ALTER TABLE "new_Entrega" RENAME TO "Entrega";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
