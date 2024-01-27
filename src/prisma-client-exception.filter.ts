// src/prisma-client-exception.filter.ts

import {
  HttpStatus,
  Catch,
  ConflictException,
  NotFoundException,
  BadGatewayException,
  BadRequestException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError) // 1
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError) {
    const { code, meta } = exception;
    switch (code) {
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        throw new NotFoundException({
          statusCode: status,
          message: 'Registro no existe',
        });
        break;
      }
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        throw new ConflictException({
          message: 'Registe ya existe con el atributo ' + meta.target,
          status: status,
        });

        break;
      }
      case 'P1000': {
        const status = HttpStatus.BAD_GATEWAY;

        throw new BadGatewayException({
          statusCode: status,
          message: 'Error de conexión con la base de datos',
        });
        break;
      }
      case 'P2000': {
        const status = HttpStatus.BAD_REQUEST;
        throw new ConflictException({
          statusCode: status,
          message:
            'El valor proporcionado para la columna es demasiado largo para el tipo de columna.',
        });
        break;
      }

      case 'P2001': {
        const status = HttpStatus.NOT_FOUND;
        throw new NotFoundException({
          statusCode: status,
          message: 'El registro buscado no existe',
        });
        break;
      }

      case 'P2003': {
        const status = HttpStatus.BAD_REQUEST;
        throw new BadRequestException({
          statusCode: status,
          message: 'La restricción de la Foreign Key no se cumple',
        });
        break;
      }

      case 'P2022': {
        const status = HttpStatus.BAD_GATEWAY;
        throw new BadGatewayException({
          statusCode: status,
          message: `La columna ${meta.column} no existe en la base de datos actual.`,
        });
        break;
      }
    }
  }
}
