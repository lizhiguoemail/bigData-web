import { Observable } from 'rxjs';

/**
 * 本地存储
 */
export class Store {
    /**
     * 设置对象
     * @param key 名称
     * @param value 值
     */
    static set( key: string, value: any ): void {
        localStorage.setItem(key, value);
    }

    /**
     * 获取对象
     * @param key 名称
     */
    static get( key: string ): string {
        return localStorage.getItem(key);
    }

    /**
     * 删除对象
     * @param key 名称
     */
    static remove( key: string ): void {
        localStorage.removeItem(key);
    }

    /**
     * 清空对象
     * @param message 消息
     */
    static clear(): void {
        localStorage.clear();
    }
}
