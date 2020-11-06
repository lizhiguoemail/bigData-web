import { Component, Injector, OnInit } from '@angular/core';
import { ComponentBase } from '@utils';
import EasyTyper from 'easy-typer-js';

/**
 * 智能分析个人页
 */
@Component({
    selector: 'app-smart-person-analysis-dialog',
    templateUrl: './html/smart-person-analysis-dialog.component.html'
})
export class SmartPersonAnalysisDialogComponent extends ComponentBase implements OnInit {
    /**
     * 初始化Api资源列表页
     * @param injector 注入器
     */
    constructor(injector: Injector) {
        super(injector);
    }
    /**
     * 初始化
     */
    ngOnInit(): void {
    }
}
