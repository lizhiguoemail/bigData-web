import { AppConfig } from '../app.config';
import { EventHelper } from './angular/event-helper';
import { HttpHelper } from './angular/http-helper';
import { IocHelper } from './angular/ioc-helper';
import { RouterHelper } from './angular/router-helper';
import { Dialog } from './common/dialog';
import { Drawer } from './common/drawer';
import { Form } from './common/form';
import * as helper from './common/helper';
import { Message } from './common/message';
import { Store } from './common/store';
import { WebApi } from './common/webapi';
/**
 * 操作库
 */
export class Util {
    /**
     * 公共操作
     */
    static helper = helper;
    /**
     * Ioc操作
     */
    static ioc = IocHelper;
    /**
     * Http操作
     */
    static http = HttpHelper;
    /**
     * 事件操作
     */
    static event = EventHelper;
    /**
     * WebApi操作,与服务端返回的标准result对象交互
     */
    static webapi = WebApi;
    /**
     * 路由操作
     */
    static router = RouterHelper;
    /**
     * 消息操作
     */
    static message = Message;
    /**
     * 表单操作
     */
    static form = new Form();
    /**
     * 弹出层操作
     */
    static dialog = Dialog;
    /**
     * 参数配置
     */
    static config = AppConfig;
    /**
     * 存储
     */
    static store = Store;
    /**
     * 抽屉层操作
     */
    static drawer = Drawer;
}
