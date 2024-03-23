import { Injectable, UnauthorizedException, Inject } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { LoginInput } from './dto/login.input'
import { compareSync } from 'bcrypt'
import { Session } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

import { Cache } from 'cache-manager'
import { JwtService } from '@nestjs/jwt'
import { BrowserDetectInfo } from 'browser-detect/dist/types/browser-detect.interface'
import { AuthResponse } from './entities/auth.entity'
import { JWTPayload } from 'src/types/jtw-payload'
import { ENV } from 'src/constants'
import { ProfileEmployeeResponse } from './entities/profileEmployeeResponse'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
  ) { }

  async signIn(arg: LoginInput, browser: BrowserDetectInfo, isAdmin: boolean): Promise<AuthResponse> {
    const user = await this.prisma.user.findFirst({
      where: isAdmin
        ? {
          email: arg.email,
          NOT: {
            employee: null,
          },
        }
        : {
          email: arg.email,
          NOT: {
            patient: null,
          },
        },
    })
    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrecta')
    }
    const compare = compareSync(arg.password, user.password)
    if (!compare) {
      throw new UnauthorizedException('Usuario o contraseña incorrecta')
    }
    delete user.password
    const sessionId = uuidv4()
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      sessionId: sessionId
    }
    const access_token = await this.jwtService.signAsync(payload)
    await this.prisma.session.create({
      data: {
        id: sessionId,
        token: access_token,
        userId: user.id,
        browser: browser.browser,
        device: browser.isDesktop ? 'Desktop' : 'Mobile',
        platform: browser.platform,
        version: browser.version,
        os: browser.os,
        source: browser.source,
      },
    })
    return { ...user, jwtParams: { jwtToken: access_token, expiresIn: ENV.JWT_EXPIRE_IN } }
  }

  async getPatient(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: id },
      include: {
        patient: true,
      },
    })
  }

  async getEmployee(id: string): Promise<ProfileEmployeeResponse> {
    const data = await this.prisma.user.findUniqueOrThrow({
      where: { id: id },
      include: {
        employee: {
          include: {
            hospital: true,
            roles: true,
          },
        }
      },
    });
    const response: ProfileEmployeeResponse = {
      ...data,
      employee: {
        ...data.employee,
        roles: data.employee.roles.map((role) => ({ ...role })),
      },
      hospital: {
        ...data.employee.hospital,
      },
      createdAt: data.employee.createdAt,
      updatedAt: data.employee.updatedAt,
    }
    return response;
  }

  async validateToken(payload: JWTPayload): Promise<Session> {
    try {
      const cache: Session = await this.cacheManager.get(payload.sessionId)
      if (cache) {
        return cache
      } else {
        const session = await this.prisma.session.findFirst({
          where: { id: payload.sessionId },
          select: { id: true, active: true },
        })
        this.cacheManager.set(session.id, session, 3000)
        return session as Session
      }
    } catch (e) {
      return null
    }
  }
}
