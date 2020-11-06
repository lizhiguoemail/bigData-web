import { AfterViewInit, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { uuid } from 'src/app/utils/common/helper';
import { Util as util } from '../../../utils/util';

/**
 * 控件包装器
 */
export class ChartWrapperBase implements OnInit, AfterViewInit, OnDestroy {
    /**
     * 操作库
     */
    protected util = util;
    /**
     * id
     */
    @Input() rawId: string;
    /**
     * 名称
     */
    @Input() name: string;
    /**
     * 禁用
     */
    @Input() disabled: boolean;
    /**
     * 地区代码
     */
    @Input() areaCode: string;
    /**
     * 组件元素
     */
    @ViewChild(forwardRef(() => 'control'), { static: false }) element: ElementRef;
    /**
     * 表单控件包装器
     */
    constructor() {
        this.rawId = uuid();
    }
    /**
     * 初始化
     */
    ngOnInit() {
    }
    /**
     * 视图加载完成
     */
    ngAfterViewInit() {
    }
    /**
     * 组件销毁
     */
    ngOnDestroy() {
    }
    /**
     * 打开创建页面弹出框
     */
    openDialog(options?: {
        component?,
        title?,
        data?
        width?,
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
