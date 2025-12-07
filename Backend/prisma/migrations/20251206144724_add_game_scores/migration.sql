-- CreateTable
CREATE TABLE "GameScores" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "time_spent" INTEGER,
    "game_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameScores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameScores_user_id_game_id_idx" ON "GameScores"("user_id", "game_id");

-- CreateIndex
CREATE INDEX "GameScores_game_id_score_idx" ON "GameScores"("game_id", "score");

-- AddForeignKey
ALTER TABLE "GameScores" ADD CONSTRAINT "GameScores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameScores" ADD CONSTRAINT "GameScores_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
