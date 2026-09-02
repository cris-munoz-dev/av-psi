import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SecretManagerService } from '../shared/services/secret-manager.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(secretManager: SecretManagerService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretManager.get('SUPABASE_JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Supabase JWT puts the user id in `sub` and role in `role` (or user_metadata)
    // We will augment this payload when querying our own User DB if needed, 
    // but for now we trust the Supabase JWT.
    if (!payload) {
      throw new UnauthorizedException();
    }
    
    return {
      userId: payload.sub,
      email: payload.email,
      // Default to PATIENT if not set in metadata
      role: payload.user_metadata?.role || 'PATIENT',
    };
  }
}
