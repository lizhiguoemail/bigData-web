import { Injectable } from '@angular/core';
import { util } from '@utils';

@Injectable()
export class TokenService {
    key = 'token';
    set(data: ITokenModel | null): boolean {
        sessionStorage.setItem(this.key, JSON.stringify(data));
        return true;
    }
    /**
     * 获取Token，形式包括：
     * - `get()` 获取 Simple Token
     * - `get<JWTTokenModel>(JWTTokenModel)` 获取 JWT Token
     */
    get(type?: any): ITokenModel | null{
        const data = sessionStorage.getItem(this.key) || '{}';
        return JSON.parse(data);
    }
    /**
     * Clean authorization data
     */
    clear(): void {
        sessionStorage.removeItem(this.key);
    }
}

export interface ITokenModel {
    id: string;
    name: string;
    token: string | null | undefined;
}
