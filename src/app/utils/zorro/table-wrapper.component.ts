import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageConfig as config } from '../config/message-config';
import { IKey, QueryParameter } from '../core/model';
import { PagerList } from '../core/pager-list';
import { Util as util } from '../util';
import { TableBase } from './table-wrapper-base.component';

/**
 * NgZorro表格包装器
 */
@Component({
    selector: 'nz-table-wrapper',
    template: `
        <ng-content></ng-content>
    `
})
// tslint:disable-next-line: component-class-suffix
export class Table<T extends IKey> extends TableBase<T> implements OnInit {
    /**
     * 初始化表格包装器
     */
    constructor() {
        super();
    }

}
