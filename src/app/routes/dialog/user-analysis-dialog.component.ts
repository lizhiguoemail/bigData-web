import { Component, Injector, OnInit } from '@angular/core';
import { TableQueryComponentBase } from '@utils';
import { EricoidComponent } from '../ericoid/ericoid.component';
import { ManpowerComponent } from '../manpower/manpower.component';
import { UserAnalysisQuery } from './model/userAnalysis-query';
import { UserAnalysisViewModel } from './model/userAnalysis-view-model';
import { UserRegionItemViewModel, UserRegionViewModel } from './model/userRegion-view-model';

/**
 * 人员分析列表页
 */
@Component({
    selector: 'app-user-analysis-dialog',
    templateUrl: './html/user-analysis-dialog.component.html'
})
export class UserAnalysisDialogComponent extends TableQueryComponentBase<UserAnalysisViewModel, UserAnalysisQuery> implements OnInit {
    /**
     * 请求地址
     */
    baseUrl: string;
    tabs: Array<UserRegionViewModel>;
    /**
     * 初始化Api资源列表页
     * @param injector 注入器
     */
    constructor(injector: Injector) {
        super(injector);
        this.tabs = new Array<UserRegionViewModel>();
    }
    /**
     * 初始化
     */
    ngOnInit(): void {
        this.initTabs();
        this.queryParam.code = this.data.data.code;
        this.queryParam.lx = this.data.data.lx;
        this.queryParam.rylx = this.data.data.rylx;
    }
    /**
     * 创建查询参数
     */
    protected createQuery() {
        this.queryParam = new UserAnalysisQuery();
        return this.queryParam;
    }
    /**
     * 打开人员详情
     * @param data 数据
     */
    openUserDialog(idCardNo) {
        this.openDialog({
            component: ManpowerComponent,
            // title: data.name,
            data: idCardNo,
            width: '100%',
            style: { top: '-1px' }
        })
    }
    /**
     * 初始化索引标签
     */
    initTabs() {
        const children = this.data.data.children || [];
        if (this.data.data.code.length == 4) {
            children.forEach(item => {
                this.genTabItem(item.children);
            });
        } else {
            this.genTabItem(children);
        }
        if (this.tabs.length > 0) {
            this.tabs.sort((a, b): number => { return a.pinyin.charCodeAt(0) - b.pinyin.charCodeAt(0) });
            this.util.helper.insert(this.tabs, { pinyin: '全部' }, 0);
        }
    }
    /**
     * 生成Tab数据
     * @param item 数组
     */
    genTabItem(item) {
        item.forEach(child => {
            let data = new UserRegionViewModel();
            data.region = new Array<UserRegionItemViewModel>();
            data.pinyin = child.pinyin;
            let dataItem = new UserRegionItemViewModel();
            dataItem.code = child.code;
            dataItem.name = child.name;
            const tabItem = this.tabs.find(t => t.pinyin == child.pinyin);
            if (!tabItem) {
                data.region.push(dataItem);
                this.tabs.push(data);
            } else {
                tabItem.region.push(dataItem);
            }
        });
    }
    /**
     * 点击Tab标签
     */
    tabClick(item) {
        if (item.pinyin == '全部') {
            this.regionClick(this.data.data.code);
        }
    }
    /**
     * 加载社区人员
     */
    regionClick(code) {
        this.queryParam.code = code;
        this.query();
    }
}
