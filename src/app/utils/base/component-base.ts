import { Injector, Input } from '@angular/core';
import { Util as util } from '../util';

/**
 * 组件
 */
export class ComponentBase {
    /**
     * 数据
     */
    @Input() data;
    /**
     * 初始化组件
     * @param injector 注入器
     */
    constructor(injector: Injector) {
        util.ioc.componentInjector = injector;
    }

    /**
     * 操作库
     */
    protected util = util;
    /**
     * 打开创建页面弹出框
     */
    openDialog(options?: {
        component?,
        title?,
        data?
        width?,
        style?,
        beforeOpen?: () => boolean;
        beforeClose?: (value) => boolean;
        close?: (value) => void;

    }) {
        options = options || {};
        util.dialog.open({
            component: options.component,
            title: options.title,
            data: { data: options.data },
            width: options.width,
            style: options.style,
            disableClose: true,
            showFooter: false,
            onBeforeOpen: () => {
                if (options.beforeOpen) {
                    return options.beforeOpen();
                }
            },
            onBeforeClose: result => {
                if (options.beforeClose) {
                    return options.beforeClose(result);
                }
            },
            onClose: result => {
                if (options.close) {
                    options.close(result);
                }
            }
        });
    }
}
