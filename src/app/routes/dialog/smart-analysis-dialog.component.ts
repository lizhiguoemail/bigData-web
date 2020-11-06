import { Component, Injector, OnInit } from '@angular/core';
import { ComponentBase } from '@utils';
import EasyTyper from 'easy-typer-js';

/**
 * 智能分析页
 */
@Component({
    selector: 'app-smart-analysis-dialog',
    templateUrl: './html/smart-analysis-dialog.component.html'
})
export class SmartAnalysisDialogComponent extends ComponentBase implements OnInit {
    /**
     * 打字机
     */
    typer: EasyTyper;
    /**
     * 打字机配置
     */
    typerCfg = {
        output: '',
        isEnd: false,
        speed: 100,
        singleBack: false,
        sleep: 0,
        type: 'normal',
        backSpeed: 40,
        sentencePause: false
    }
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
        this.initTyper();
    }
    /**
     * 初始化打字机
     */
    initTyper() {
        // 实例化
        this.typer = new EasyTyper(
            this.typerCfg, 
            this.data.result ? this.data.result : '正在进行分析，请稍后！', 
            () => { }, 
            () => { }
        );
    }
}
