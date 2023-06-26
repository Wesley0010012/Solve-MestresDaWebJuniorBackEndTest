import JWT from 'jsonwebtoken';
import { Decrypter, Encrypter } from '../../data';

export class JWTAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string){}

  async encrypt(plaintext: string): Promise<string> {
    return await JWT.sign({id: plaintext}, this.secret);
  }

  async decrypt(cyphertext: string): Promise<string> {
    return await JWT.verify(cyphertext, this.secret) as any;
  }
}