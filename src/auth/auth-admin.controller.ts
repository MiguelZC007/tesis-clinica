import { Controller, Body, Post, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './entities/auth.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Auth } from '../guards/auth-guard';
import { Request } from 'express';
import { JWTPayload } from 'src/types/jtw-payload';
import { ProfileEmployeeResponse } from './entities/profileEmployeeResponse';
import { Type } from 'class-transformer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const browser = require('browser-detect');


@ApiTags('ADMIN-Autentificación')
@Controller({ version: '1', path: 'admin/auth' })
export class AuthAdminController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({
    summary: 'Inicio de session',
  })
  @Post('/login')
  async signIn(
    @Body() createAuthInput: LoginInput,
    @Req() req: Request,
  ): Promise<AuthResponse> {
    const device = browser(req.headers['user-agent']);
    return await this.authService.signIn(createAuthInput, device, true);
  }

  @Auth()
  @ApiOperation({
    summary: 'Obtener usuario logueado',
  })
  @ApiBearerAuth()
  @Get('/current-user')
  async getCurrentUser(@CurrentUser() currentUser: JWTPayload): Promise<ProfileEmployeeResponse> {
    return this.authService.getEmployee(currentUser.sub);
  }

}
