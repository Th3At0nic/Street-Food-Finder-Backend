import { PrismaClient, UserRole } from '@prisma/client';
import config from '../config';
import bcrypt from 'bcrypt';

const seedAdmin = async () => {
  const prima = new PrismaClient();

  //when database is connected, we will check if there's any user who is admin
  const isAdminExits = await prima.user.findFirst({
    where: {
      role: UserRole.ADMIN,
    },
  });

  if (!isAdminExits) {
    const password = bcrypt.hashSync(
      config.admin_password as string,
      Number(config.bcrypt.bcryptSaltRounds),
    );
    const adminUser = {
      email: 'admin@gmail.com',
      password,
      role: UserRole.ADMIN,
    };

    await prima.$transaction(async (tx) => {
      const createdAdmin = await tx.user.create({
        data: {
          ...adminUser,
        },
      });

      await tx.userDetail.create({
        data: {
          userId: createdAdmin.id,
          name: 'admin',
        },
      });
    });
  }
};

export default seedAdmin;
