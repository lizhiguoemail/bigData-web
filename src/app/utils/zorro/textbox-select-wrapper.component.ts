import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageConfig } from '../config/message-config';
import { FormControlWrapperBase } from './base/form-control-wrapper-base';

/**
 * NgZorro文本框包装器
 */
@Component( {
    selector: 'x-textbox-select',
    template: `
        <nz-form-item>
            <nz-form-label [nzRequired]="required" *ngIf="label!=''">{{label}}</nz-form-label>
            <nz-form-control [nzErrorTip]="nzErrorTpl" [nzValidateStatus]="(controlModel?.invalid && (controlModel?.dirty || controlModel.touched))?'error':'success'">
                <nz-input-group [nzSize]="size" nzSearch [nzAddOnAfter]="suffixIconButton">
                    <input nz-input [id]="rawId" [name]="name" [type]="type" [placeholder]="placeholder" [disabled]="disabled" [readonly]="readonly"
                        #control #controlModel="ngModel" [ngModel]="model" (ngModelChange)="onModelChange($event)"
                        (blur)="handleBlur($event)" (focus)="handleFocus($event)" (keyup)="handleKeyup($event)" (keydown)="handleKeydown($event)"
                        [required]="required" [email]="type==='email'" [pattern]="pattern"
                        [minlength]="minLength" [maxlength]="maxLength"
                    />
                    <ng-template #suffixIconButton>
                        <button nz-button [nzType]="btnColor" nzSearch (click)="click($event)" nz-tooltip [disabled]="disabled" [nzTooltipTitle]="iconTitle"><i nz-icon [nzType]="icon"></i></button>
                    </ng-template>
                </nz-input-group>
                <ng-template #nzErrorTpl let-control>
                    {{getErrorMessage()}}
                </ng-template>
            </nz-form-control>
        <nz-form-item>
    `,
    styles: [
      `
      `
    ]
} )
// tslint:disable-next-line: component-class-suffix
export class TextBoxSelect extends FormControlWrapperBase implements OnInit {
    /**
     * 是否密码框
     */
    isPassword: boolean;
    /**
     * 密码显示隐藏开关
     */
    hide: boolean;
    /**
     * 清除按钮提示
     */
    clearButtonTooltip: string;
    /**
     * 图标
     */
    @Input() icon: string;
    /**
     * 是否显示清除按钮
     */
    @Input() showClearButton: boolean;
    /**
     * 文本框类型，可选值：text,password,number,email,date
     */
    @Input() type: string;
    /**
     * 只读
     */
    @Input() readonly: boolean;
    /**
     * 尺寸，可选值：default,small,large
     */
    @Input() size?: string;
    /**
     * 最小长度
     */
    @Input() minLength: number;
    /**
     * 最小长度验证消息
     */
    @Input() minLengthMessage: string;
    /**
     * 最大长度
     */
    @Input() maxLength: number;
    /**
     * 电子邮件验证消息
     */
    @Input() emailMessage: string;
    /**
     * 正则表达式验证
     */
    @Input() pattern: string;
    /**
     * 正则表达式验证消息
     */
    @Input() patterMessage: string;
    /**
     * 单击事件
     */
    @Output() onClick = new EventEmitter<any>();
    /**
     * 颜色，可选值：default,primary,dashed,danger
     */
    @Input() btnColor?: string;
    /**
     * 图标提示信息
     */
    @Input() iconTitle: string;

    /**
     * 初始化文本框包装器
     * @param form 表单
     */
    constructor( @Optional() form: NgForm ) {
        super( form );
        this.clearButtonTooltip = MessageConfig.clear;
        this.showClearButton = true;
        this.icon = '';
        this.iconTitle = '';
    }

    /**
     * 组件初始化
     */
    ngOnInit() {
        super.ngOnInit();
        this.initPassword();
    }

    /**
     * 初始化密码框
     */
    private initPassword() {
        if ( this.type !== 'password' ) {
            return;
        }
        this.isPassword = true;
        this.hide = true;
        this.togglePassword();
    }

    /**
     * 切换密码显示状态
     */
    private togglePassword() {
        this.type = this.hide ? 'password' : 'text';
        this.hide = !this.hide;
    }

    /**
     * 获取错误消息
     */
    getErrorMessage() {
        if ( !this.controlModel ) {
            return '';
        }
        if ( this.controlModel.hasError( 'required' ) ) {
            return this.requiredMessage;
        }
        if ( this.controlModel.hasError( 'minlength' ) ) {
            return this.replace( this.minLengthMessage || MessageConfig.minLengthMessage, this.minLength );
        }
        if ( this.controlModel.hasError( 'email' ) ) {
            return this.emailMessage || MessageConfig.emailMessage;
        }
        if ( this.controlModel.hasError( 'pattern' ) ) {
            return this.patterMessage;
        }
        return '';
    }

    /**
     * 替换{0}
     */
    private replace( message, value ) {
        return message.replace( /\{0\}/, String( value ) );
    }

    /**
     * 单击事件
     */
    click( event ) {
        this.onClick.emit( event );
    }
}
