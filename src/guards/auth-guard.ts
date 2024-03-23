import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { LocalGuard } from './local-guard';

export const Auth = (args = [], mix = false) => {
  return applyDecorators(
    SetMetadata('roles', [mix, ...args]),
    UseGuards(LocalGuard),
  );
};
