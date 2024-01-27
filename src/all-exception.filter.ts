import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof HttpException) {
      const responseData = exception.getResponse();
      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      if (typeof responseData === 'string') {
        response.status(httpStatus).json({ message: responseData });
      } else {
        response.status(httpStatus).json(responseData);
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const { code, meta } = exception;
      switch (code) {
        case 'P2025': {
          //  throw new NotFoundException('Registro no existe');
          const status = HttpStatus.NOT_FOUND;
          response.status(status).json({
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
          response.status(status).json({
            statusCode: status,
            message: 'Error de conexión con la base de datos',
          });
          break;
        }
        case 'P2000': {
          const status = HttpStatus.BAD_REQUEST;
          response.status(status).json({
            statusCode: status,
            message:
              'El valor proporcionado para la columna es demasiado largo para el tipo de columna.',
          });
          break;
        }

        case 'P2001': {
          const status = HttpStatus.NOT_FOUND;
          response.status(status).json({
            statusCode: status,
            message: 'El registro buscado no existe',
          });
          break;
        }

        case 'P2003': {
          const status = HttpStatus.BAD_REQUEST;
          response.status(status).json({
            statusCode: status,
            message: 'La restricción de la Foreign Key no se cumple',
          });
          break;
        }

        case 'P2022': {
          const status = HttpStatus.BAD_GATEWAY;
          response.status(status).json({
            statusCode: status,
            message: `La columna ${meta.column} no existe en la base de datos actual.`,
          });
          break;
        }
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      const status = HttpStatus.BAD_GATEWAY;
      response.status(status).json({
        statusCode: status,
        message: `Uno o mas datos ingresados son incorrectos`,
      });
    } else {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      response.status(status).json({
        statusCode: status,
        message: exception.message ?? 'Ocurrió un error desconocido',
        error: exception,
      });
    }
  }
}
