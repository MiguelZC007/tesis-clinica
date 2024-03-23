import { Controller, Body, Post, Get, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './entities/auth.entity';
import { JWTPayload } from 'src/types/jtw-payload';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Auth } from '../guards/auth-guard';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const browser = require('browser-detect');

@ApiTags('PUBLIC-Autentificación')
@Controller({ version: '1', path: 'auth' })
export class AuthController {
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
    return await this.authService.signIn(createAuthInput, device, false);
  }

  @Auth()
  @ApiOperation({
    summary: 'Obtener el perfil de usuario logueado',
  })
  @ApiBearerAuth()
  @Get('/profile')
  async getProfile(@CurrentUser() currentUser: JWTPayload) {
    const user = await this.authService.getPatient(currentUser.sub);
    return user;
  }
}
