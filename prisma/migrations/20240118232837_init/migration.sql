-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "lastname" TEXT,
    "mother_lastname" TEXT,
    "search" TEXT,
    "birthdate" TIMESTAMP(3),
    "cellphone" TEXT,
    "email" TEXT,
    "ci" TEXT,
    "simec_salesman_id" TEXT,
    "simec_user_id" TEXT,
    "nit" TEXT,
    "business_name" TEXT,
    "extension" TEXT,
    "expedition" TEXT,
    "address" TEXT,
    "zone" TEXT,
    "state" TEXT,
    "city" TEXT,
    "country" TEXT,
    "password" TEXT,
    "contact_name" TEXT,
    "contact_phone" TEXT,
    "relationship" TEXT,
    "odoo_user_id" INTEGER,
    "registration_age" TEXT,
    "observations" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_ci_key" ON "User"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "User_simec_salesman_id_key" ON "User"("simec_salesman_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_simec_user_id_key" ON "User"("simec_user_id");
