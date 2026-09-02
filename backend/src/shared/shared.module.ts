import { Module, Global } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { SecretManagerService } from './services/secret-manager.service';
import { CryptoService } from './services/crypto.service';
import { PrismaService } from './services/prisma.service';

@Global()
@Module({
  providers: [
    LoggerService,
    SecretManagerService,
    CryptoService,
    PrismaService,
  ],
  exports: [LoggerService, SecretManagerService, CryptoService, PrismaService],
})
export class SharedModule {}
