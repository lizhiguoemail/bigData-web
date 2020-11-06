import { Component, Input, Optional } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormControlWrapperBase } from './base/form-control-wrapper-base';

/**
 * NgZorro开关选择包装器
 */
@Component({
    selector: 'x-switch',
    template: `
    <nz-form-item>
        <nz-form-label [nzRequired]="required" *ngIf="label!=''">{{label}}</nz-form-label>
        <nz-form-control [nzErrorTip]="nzErrorTpl" [nzValidateStatus]="(controlModel?.invalid && (controlModel?.dirty || controlModel.touched))?'error':'success'">
            <nz-switch [name]="name" [nzDisabled]="disabled"
                #control #controlModel="ngModel" [ngModel]="model" (ngModelChange)="onModelChange($event)"
                (nzBlur)="handleBlur($event)" (nzFocus)="handleFocus($event)"
                [nzCheckedChildren]="onText" [nzUnCheckedChildren]="offText"
                [required]="required"></nz-switch>
                <ng-template #nzErrorTpl let-control>
                    {{getErrorMessage()}}
                </ng-template>
        </nz-form-control>
    </nz-form-item >
    `,
    styles: [
      `
      `
    ]
})
// tslint:disable-next-line: component-class-suffix
export class Switch extends FormControlWrapperBase {
    /**
     * 选中时的内容
     */
    @Input() onText: string;
    /**
     * 非选中时的内容
     */
    @Input() offText: string;

    /**
     * 初始化数字文本框包装器
     * @param form 表单
     */
    constructor( @Optional() form: NgForm ) {
        super( form );
        this.onText = '';
        this.offText = '';
    }

    /**
     * 获取错误消息
     */
    getErrorMessage() {
        if (!this.controlModel) {
            return '';
        }
        if (this.controlModel.hasError('required')) {
            return this.requiredMessage;
        }
        return '';
    }
}
