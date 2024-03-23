import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthAdminController } from './auth-admin.controller';
import { ENV } from 'src/constants';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: ENV.JWT_SECRET,
      signOptions: { expiresIn: ENV.JWT_EXPIRE_IN },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController, AuthAdminController],
  exports: [AuthService],
})
export class AuthModule { }
