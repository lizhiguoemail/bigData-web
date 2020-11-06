import { Component, OnDestroy, OnInit, Injector } from '@angular/core';
import { DialogComponentBase } from './base/dialog-base';
import { UserAnalysisDialogComponent } from './user-analysis-dialog.component';

/**
 * 区域分析列表
 */
@Component({
    selector: 'app-area-analysis-dialog',
    templateUrl: './html/area-analysis-dialog.component.html'
})
export class AreaAnalysisDialogComponent extends DialogComponentBase implements OnInit, OnDestroy {
    /**
     * 初始化首页
     */
    constructor(injector: Injector) {
        super(injector);
    }
    /**
     * 初始化页面
     */
    ngOnInit(): void {
        this.loadData();
    }
    /**
     * 加载数据
     */
    loadData() {
        this.util.webapi.get<any>(`${this.data.areaUrl}?code=${this.data.code}&lx=${this.data.name}&rylx=${this.data.type}`).handle({
            ok: (resp) => {
                this.dataList = resp;
                this.dataList.forEach(item => {
                  this.mapOfExpandedData[item.code] = this.convertTreeToList(item);
                });
            }
        });
    }
    formatOne = (percent: number) => `${percent.toFixed(2)}%`;
    /**
     * 打开人员列表
     * @param data 数据
     */
    openUserDialog(data) {
        this.openDialog({
            component: UserAnalysisDialogComponent,
            title: data.name,
            data: { data, url: this.data.userUrl },
            width: '800px'
          });
    }
    /**
     * 页面销毁
     */
    ngOnDestroy(): void {
    }
}
