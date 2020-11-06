import { Component, Input, Optional } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormControlWrapperBase } from './base/form-control-wrapper-base';

/**
 * NgZorro数字文本框包装器
 */
@Component({
    selector: 'x-number-textbox',
    template: `
    <nz-form-item>
        <nz-form-label [nzRequired]="required" *ngIf="label!=''">{{label}}</nz-form-label>
        <nz-form-control [nzErrorTip]="nzErrorTpl" [nzValidateStatus]="(controlModel?.invalid && (controlModel?.dirty || controlModel.touched))?'error':'success'">
            <nz-input-number [id]="rawId" [name]="name" [nzPlaceHolder]="placeholder" [nzDisabled]="disabled"
                #control #controlModel="ngModel" [ngModel]="model" (ngModelChange)="onModelChange($event)"
                [nzAutoFocus]="autoFocus" [nzPrecision]="precision" [nzStep]="step"
                (nzBlur)="handleBlur($event)" (nzFocus)="handleFocus($event)" (keyup)="handleKeyup($event)" (keydown)="handleKeydown($event)"
                [required]="required" [nzMin]="min" [nzMax]="max"></nz-input-number>
            <ng-template #nzErrorTpl let-control>
                {{requiredMessage}}
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
export class NumberTextBox extends FormControlWrapperBase {
    /**
     * 自动获取焦点
     */
    @Input() autoFocus?: boolean;
    /**
     * 最小值
     */
    @Input() min?: number;
    /**
     * 最大值
     */
    @Input() max?: number;
    /**
     * 精度
     */
    @Input() precision?: number;
    /**
     * 每次改变步数
     */
    @Input() step?: number | string;

    /**
     * 初始化数字文本框包装器
     * @param form 表单
     */
    constructor( @Optional() form: NgForm ) {
        super( form );
        this.precision = 6;
        this.step = 1;
    }
}
