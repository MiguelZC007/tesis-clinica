import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as helmet from 'helmet'
import { ENV } from './constants';
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const isDevelopment = process.env.NODE_ENV !== 'production'
const whitelist = process.env.ORIGIN ? process.env.ORIGIN.split(',') : []
let options: any = {}
if (!isDevelopment) {
  options = {
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  }
}

async function bootstrap() {
  const port = ENV.PORT || 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  // // Configuración de subida de archivos grandes con Multer
  // const storage = multer.memoryStorage()
  // const upload = multer({ storage: storage })
  // app.use(upload.any())
  app.enableVersioning({
    type: VersioningType.URI,
  })
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors(options)
  const config = new DocumentBuilder()
    .setTitle('Clínica')
    .setDescription('Documentación Swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  })
  if (!isDevelopment) {
    await app.use(helmet);
  }
  await app.listen(port, '0.0.0.0');
  console.log(`http://localhost:${port}`);
}
bootstrap()
