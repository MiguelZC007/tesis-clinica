import { Prisma, PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
  await prisma.role.createMany({
    data: [
      { name: 'DOCTOR' },
      { name: 'CAJERO' },
      { name: 'ENFERMERA' },
      { name: 'ADMINISTRADOR' },
    ],
  });

  const password = hashSync('123456', Number(process.env.SALT_ROUND));
  await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      fullname: 'admin',
      birthdate: new Date().toISOString(),
      ci: '1234567',
      password: password,
      employee: {
        create: {
          roles: {
            connect: {
              name: "ADMINISTRADOR"
            }
          },

          hospital: {
            connectOrCreate: {
              create: {
                name: 'Hospital de Clínicas',
                address: 'Av. 14 de Septiembre',
                phone: '123456',
                email: "hospitalClinicas@gmail.com"
              },
              where: {
                name: 'Hospital de Clínicas'
              }
            }
          }
        }
      }
    },
  });
  await prisma.user.create({
    data: {
      email: 'patient@gmail.com',
      fullname: 'patient',
      birthdate: new Date().toISOString(),
      ci: '123456',
      password: password,
      patient: { create: { bloodType: "AB_NEGATIVE" } }
    },
  });
  console.error('seed end');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
