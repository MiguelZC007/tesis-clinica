/* eslint-disable @typescript-eslint/no-unused-vars */

import { HttpStatus, Catch, NotFoundException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientValidationError)
export class PrismaClientValidationErrorFilter extends BaseExceptionFilter {
  catch(_exception) {
    const status = HttpStatus.BAD_GATEWAY;
    throw new NotFoundException({
      statusCode: status,
      message: `Uno o mas datos ingresados son incorrectos`,
    });
  }
}
