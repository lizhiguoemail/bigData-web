import { TemplateRef } from '@angular/core';
import { NzDrawerOptions, NzDrawerPlacement, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { IocHelper as ioc } from '../angular/ioc-helper';
import { isNumber, isUndefined, toNumber } from './helper';

/**
 * 抽屉层操作
 */
export class Drawer {
    private static drawerRef: NzDrawerRef;
    /**
     * 打开抽屉层
     * @param options 抽屉层配置
     */
    static open( options?: IDrawerOptions ) {
        options = options || {};
        if ( options.onBeforeOpen && options.onBeforeOpen() === false ) {
            return;
        }
        Drawer.initOptions( options );
        const drawer: NzDrawerService = Drawer.getModalService();
        Drawer.drawerRef = drawer.create( this.toOptions( options ) );
        Drawer.drawerRef.afterOpen.subscribe( () => options.onOpen && options.onOpen() );
        Drawer.drawerRef.afterClose.subscribe( ( result ) => options.onClose && options.onClose( result ) );
    }

    /**
     * 获取模态窗服务
     */
    private static getModalService() {
        return ioc.get( NzDrawerService );
    }

    /**
     * 初始化配置
     */
    private static initOptions( options: IDrawerOptions ) {
        if ( !options.data ) {
            options.data = {};
        }
    }

    /**
     * 转换配置
     */
    private static toOptions( options: IDrawerOptions ): NzDrawerOptions {
        return {
            nzTitle: options.title,
            nzContent: options.component || options.content,
            nzContentParams: options.data,
            nzClosable: isUndefined( options.showClose ) ? true : options.showClose,
            nzMaskClosable: !options.disableClose,
            nzMask: isUndefined( options.showMask ) ? true : options.showMask,
            nzKeyboard: !options.disableClose,
            nzWidth: options.width,
            nzPlacement: isUndefined(options.placement) ? 'right' : options.placement,
            nzOnCancel: options.onCancel
        };
    }

    /**
     * 关闭所有抽屉层
     */
    static closeAll() {
        Drawer.drawerRef.close();
    }

    /**
     * 关闭抽屉层
     * @param result 返回结果
     */
    static close( result?) {
        Drawer.drawerRef.close( result );
    }
}

/**
 * 抽屉层配置
 */
export interface IDrawerOptions {
    /**
     * 抽屉层组件，该组件应添加到当前模块 NgModule 的 entryComponents
     */
    component?;
    /**
     * 传入抽屉层组件中的参数
     */
    data?;
    /**
     * 标题
     */
    title?: string | TemplateRef<any>;
    /**
     * 内容
     */
    content?: string | TemplateRef<any>;
    /**
     * 是否显示右上角的关闭按钮，默认为 true
     */
    showClose?: boolean;
    /**
     * 是否显示遮罩，默认为 true
     */
    showMask?: boolean;
    /**
     * 是否禁用按下ESC键或点击屏幕关闭遮罩，默认 false
     */
    disableClose?: boolean;
    /**
     * 宽度
     */
    width?: string | number;
    /**
     * 方向
     */
    placement?: NzDrawerPlacement;
    /**
     * 点击取消按钮事件
     */
    onCancel?: () => Promise<any>;
    /**
     * 打开后事件
     */
    onOpen?: () => void;
    /**
     * 关闭后事件
     * @param result 返回结果
     */
    onClose?: ( result ) => void;
    /**
     * 打开前事件，返回 false 阻止弹出
     */
    onBeforeOpen?: () => boolean;
    /**
     * 关闭前事件，返回 false 阻止关闭
     */
    onBeforeClose?: ( result ) => ( false | void | {} ) | Promise<false | void | {}>;
}
