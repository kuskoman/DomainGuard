import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LOCAL_AUTH_STRATEGY } from '../strategies/local.const';

@Injectable()
export class LocalAuthGuard extends AuthGuard(LOCAL_AUTH_STRATEGY) {}
