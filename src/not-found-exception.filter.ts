import { ExceptionFilter, Catch, NotFoundException, Inject, ArgumentsHost } from '@nestjs/common'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const browser = require('browser-detect')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getClientIp } = require('@supercharge/request-ip')

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) { }
  file(req: any) {
    if (req.files && req.files.length) {
      let newFiles = []
      const files = req.files as Express.Multer.File[]
      try {
        newFiles = files.map((file) => {
          const newFile = file
          delete newFile.buffer
          return newFile
        })
      } catch (error) {
        newFiles = []
      }

      return newFiles
    }
    if (req.file) {
      const file = req.file
      delete file.buffer
      return file
    }

    return ''
  }
  async catch(_exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const req: Request = ctx.getRequest();
    const responseData: any = _exception.getResponse();
    const httpStatus = _exception.getStatus();
    const result = browser(req.headers['user-agent']);
    const ipAddresses = getClientIp(req);

    const method = req.method;
    this.logger.error({
      method: method,
      url: req.url,
      ip: ipAddresses,
      browser: result,
      httpStatus: httpStatus,
      timestamp: new Date().toISOString(),
      data: {
        ...req.body,
        files: this.file(req),
        response: responseData,
      },
    });

    if (responseData.message && responseData.message.includes('Cannot GET')) {
      const html = '<h1>Not Found</h1>';
      response.header('content-type', 'text/html');
      response.status(httpStatus).send(html);
    } else {
      response.status(httpStatus).send(responseData);
    }
  }
}
