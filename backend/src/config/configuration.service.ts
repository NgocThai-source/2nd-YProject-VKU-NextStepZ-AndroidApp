import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  get database() {
    return {
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      name: this.configService.get('DB_NAME'),
    };
  }

  get jwt() {
    return {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION', '7d'),
    };
  }

  get app() {
    return {
      port: this.configService.get('PORT', 3001),
      name: this.configService.get('APP_NAME'),
      version: this.configService.get('APP_VERSION'),
      nodeEnv: this.configService.get('NODE_ENV', 'development'),
    };
  }

  get cors() {
    return {
      origin: this.configService.get('CORS_ORIGIN', 'http://localhost:3000'),
    };
  }
}
