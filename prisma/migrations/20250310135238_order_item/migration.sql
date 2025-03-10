/*
  Warnings:

  - You are about to drop the `_OrderFruits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrderFruits" DROP CONSTRAINT "_OrderFruits_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderFruits" DROP CONSTRAINT "_OrderFruits_B_fkey";

-- DropTable
DROP TABLE "_OrderFruits";

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "fruitId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_fruitId_fkey" FOREIGN KEY ("fruitId") REFERENCES "Fruit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
