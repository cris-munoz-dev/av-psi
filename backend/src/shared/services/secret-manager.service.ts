import { Injectable } from '@nestjs/common';

@Injectable()
export class SecretManagerService {
  /**
   * Retrieves a secret or environment variable.
   * According to CONSTITUTION.md, direct process.env access is forbidden outside this service.
   */
  get(key: string): string {
    const value = process.env[key];
    if (value === undefined) {
      throw new Error(`Secret or environment variable ${key} is missing`);
    }
    return value;
  }

  getOptional(key: string): string | undefined {
    return process.env[key];
  }
}
