import { AfterViewInit, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { uuid } from '../../common/helper';
import { MessageConfig } from '../../config/message-config';

/**
 * 表单控件包装器
 */
export class FormControlWrapperBase implements OnInit, AfterViewInit, OnDestroy {
    /**
     * id
     */
    @Input() rawId: string;
    /**
     * 名称
     */
    @Input() name: string;
    /**
     * 标签
     */
    @Input() label: string;
    /**
     * 标签Span宽度
     */
    @Input() labelSpan: number;
    /**
     * 组件不添加到FormGroup，独立存在，这样也无法基于NgForm进行表单验证
     */
    @Input() standalone: boolean;
    /**
     * 禁用
     */
    @Input() disabled: boolean;
    /**
     * 占位提示
     */
    @Input() placeholder?: string;
    /**
     * 必填项
     */
    @Input() required: boolean;
    /**
     * 必填项验证消息
     */
    @Input() requiredMessage: string;
    /**
     * 模型，用于双向绑定
     */
    @Input() model;
    /**
     * 模型变更事件,用于双向绑定
     */
    @Output() modelChange = new EventEmitter<any>();
    /**
     * 变更事件
     */
    @Output() onChange = new EventEmitter<any>();
    /**
     * 获得焦点事件
     */
    @Output() onFocus = new EventEmitter<FocusEvent>();
    /**
     * 失去焦点事件
     */
    @Output() onBlur = new EventEmitter<FocusEvent>();
    /**
     * 键盘按键事件
     */
    @Output() onKeyup = new EventEmitter<KeyboardEvent>();
    /**
     * 键盘按下事件
     */
    @Output() onKeydown = new EventEmitter<KeyboardEvent>();
    /**
     * 控件模型
     */
    @ViewChild('controlModel', { static: false }) controlModel: NgModel;
    /**
     * 组件元素
     */
    @ViewChild(forwardRef(() => 'control'), { static: false }) element: ElementRef;

    /**
     * 表单控件包装器
     * @param form 表单
     */
    constructor(private form: NgForm) {
        this.requiredMessage = MessageConfig.requiredMessage;
        this.placeholder = '';
        this.rawId = uuid();
        this.labelSpan = 5;
        this.label = '';
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
        this.addControl();
    }

    /**
     * 将控件添加到FormGroup
     */
    private addControl() {
        if (this.standalone) {
            return;
        }
        if (this.form) {
            this.form.addControl(this.controlModel);
        }
    }

    /**
     * 组件销毁
     */
    ngOnDestroy() {
        this.removeControl();
    }

    /**
     * 将控件移除FormGroup
     */
    private removeControl() {
        if (this.standalone) {
            return;
        }
        if (this.form) {
            this.form.removeControl(this.controlModel);
        }
    }

    /**
     * 获取值
     */
    get value() {
        return this.controlModel.value;
    }

    /**
     * 是否有效
     */
    isValid() {
        if (!this.controlModel) {
            return false;
        }
        return !this.controlModel.invalid;
    }

    /**
     * 设置焦点
     */
    focus() {
        setTimeout(() => {
            const element = this.getNativeElement();
            if (element) {
                element.focus();
            }
        }, 0);
    }

    /**
     * 获取html元素
     */
    getNativeElement() {
        if (this.element) {
            return this.element.nativeElement;
        }
        return null;
    }

    /**
     * 模型变更事件处理
     */
    onModelChange(value) {
        this.modelChange.emit(value);
        this.onChange.emit(value);
    }

    /**
     * 获得焦点事件
     */
    handleFocus(event: FocusEvent) {
        this.onFocus.emit(event);
    }

    /**
     * 失去焦点事件
     */
    handleBlur(event: FocusEvent) {
        this.onBlur.emit(event);
    }

    /**
     * 键盘按键事件
     */
    handleKeyup(event: KeyboardEvent) {
        this.onKeyup.emit(event);
    }

    /**
     * 键盘按下事件
     */
    handleKeydown(event: KeyboardEvent) {
        this.onKeydown.emit(event);
    }
}
