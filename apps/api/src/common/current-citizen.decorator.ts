import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CitizenProfile } from './types';

export const CurrentCitizen = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CitizenProfile => {
    const req = ctx.switchToHttp().getRequest();
    return req.citizen;
  },
);
