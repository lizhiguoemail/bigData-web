import { AfterViewInit, Component, EventEmitter, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { WebApi as webapi } from '../common/webapi';
import { SelectItem, SelectList, SelectOption } from '../core/select-model';

/**
 * NgZorro审核操作包装器
 */
@Component({
    selector: 'x-check-operation',
    template: `
    <nz-row [nzGutter]="24" style="float: right;margin-right: 24px;margin-top: -40px">
        <nz-col nzLg="19" nzMd="19" nzSm="24">
        <nz-form-item>
            <nz-form-label [nzRequired]="required"*ngIf="label!=''">{{label}}</nz-form-label>
            <nz-form-control [nzErrorTip]="nzErrorTpl" [nzValidateStatus]="(controlModel?.invalid && (controlModel?.dirty || controlModel.touched))?'error':'success'">
                <input nz-input [name]="name" [type]="'text'" [placeholder]="placeholder" [disabled]="disabled" [readonly]="readonly"
                    #control #controlModel="ngModel" [ngModel]="model" (ngModelChange)="onModelChange($event)"
                    [required]="required" />
                <ng-template #nzErrorTpl let-control>
                    {{requiredMessage}}
                </ng-template>
            </nz-form-control>
        </nz-form-item >
        </nz-col>
        <nz-col nzLg="5" nzMd="5" nzSm="24">
            <nz-radio-group #controlRadioModel="ngModel" [name]="radioGroupName" [ngModel]="chkStateModel" (ngModelChange)="onModelRadioChange($event)">
                <label nz-radio-button nzValue="04">通过</label>
                <label nz-radio-button nzValue="03">不通过</label>
                <label nz-radio-button nzValue="02">退回</label>
            </nz-radio-group>
        </nz-col>
    </nz-row>
    `,
    styles: [`
    `]
})
// tslint:disable-next-line: component-class-suffix
export class ApplyCheckOperation implements OnInit, AfterViewInit {
    /**
     * id
     */
    @Input() rawId: string;
    /**
     * 名称
     */
    @Input() name: string;
    /**
     * 名称
     */
    @Input() radioGroupName: string;
    /**
     * 是否垂直布局
     */
    @Input() vertical: boolean;
    /**
     * 风格样式，可选值：'outline' | 'solid'
     */
    @Input() buttonStyle: string;
    /**
     * 是否显示标签
     */
    @Input() showLabel: boolean;
    /**
     * 标签文本
     */
    @Input() label: string;
    /**
     * 标签Span宽度
     */
    @Input() labelSpan: number;
    /**
     * 禁用
     */
    @Input() disabled: boolean;
    /**
     * 只读
     */
    @Input() readonly: boolean;
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
     * 模型，用于双向绑定
     */
    @Input() chkStateModel;
    /**
     * 占位提示
     */
    @Input() placeholder?: string;
    /**
     * 模型变更事件,用于双向绑定
     */
    @Output() modelChange = new EventEmitter<any>();
    /**
     * 变更事件
     */
    @Output() onChange = new EventEmitter<any>();
    /**
     * 模型变更事件,用于双向绑定
     */
    @Output() modelRadioChange = new EventEmitter<any>();
    /**
     * 变更事件
     */
    @Output() onRadioChange = new EventEmitter<any>();
    /**
     * 控件模型
     */
    @ViewChild('controlModel', { static: false }) controlModel: NgModel;
    /**
     * 控件模型
     */
    @ViewChild('controlRadioModel', { static: false }) controlRadioModel: NgModel;

    /**
     * 初始化单选按钮包装器
     */
    constructor(@Optional() private form: NgForm) {
        this.showLabel = true;
        this.buttonStyle = 'outline';
        this.labelSpan = 2;
        this.label = '';
        this.placeholder = '';
        this.requiredMessage = '';
    }

    /**
     * 垂直样式
     */
    verticalStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
    };

    /**
     * 组件初始化
     */
    ngOnInit() {
    }

    /**
     * 视图加载完成
     */
    ngAfterViewInit(): void {
        if (this.form) {
            this.form.addControl(this.controlModel);
            this.form.addControl(this.controlRadioModel);
        }
    }

    /**
     * 获取值
     */
    get value() {
        return this.controlModel.value;
    }

    get radioValue() {
        return this.controlRadioModel.value;
    }

    /**
     * 模型变更事件处理
     */
    onModelChange(value) {
        this.modelChange.emit(value);
        this.onChange.emit(value);
    }

    /**
     * 模型变更事件处理
     */
    onModelRadioChange(value) {
        this.modelRadioChange.emit(value);
        this.onRadioChange.emit(value);
    }
}
