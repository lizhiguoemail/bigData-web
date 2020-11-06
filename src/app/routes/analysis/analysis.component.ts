import {
    Component,
    Inject,
    OnDestroy,
    Optional,
    OnInit,
    Injector,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentBase } from '@utils';
import { AgeAnalysisChartComponent } from '../charts/age-analysis.component';
import { DegreeAnalysisChartComponent } from '../charts/degree-analysis.component';
import { GenderAnalysisChartComponent } from '../charts/gender-analysis.component';
import { HealthAnalysisChartComponent } from '../charts/health-analysis.component';
import { IncomeAnalysisChartComponent } from '../charts/income-analysis.component';
import { WorkAnalysisChartComponent } from '../charts/work-analysis.component';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';
import { StatisticsViewModel } from '../model/statistics-view-model';

@Component({
    selector: 'app-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.less'],
})
export class AnalysisComponent extends ComponentBase implements OnInit, OnDestroy {
    /**
     * 数字配置
     */
    myOpts = { separator: '' };
    /**
     * 地区数据
     */
    areaData: any;
    /**
     * 统计数量
     */
    statistics: StatisticsViewModel;
    /**
     * 地区代码
     */
    areaCode: string;
    /**
     * 学历分析
     */
    @ViewChild('degreeAnalysis', { static: true }) degreeAnalysisChart: DegreeAnalysisChartComponent;
    /**
     * 性别分析
     */
    @ViewChild('genderAnalysis', { static: true }) genderAnalysisChart: GenderAnalysisChartComponent;
    /**
     * 年龄段分析
     */
    @ViewChild('ageAnalysis', { static: true }) ageAnalysisChart: AgeAnalysisChartComponent;
    /**
     * 健康分析
     */
    @ViewChild('healthAnalysis', { static: true }) healthAnalysisChart: HealthAnalysisChartComponent;
    /**
     * 年收入分析
     */
    @ViewChild('incomeAnalysis', { static: true }) incomeAnalysisChart: IncomeAnalysisChartComponent;
    /**
     * 就业与失业分析
     */
    @ViewChild('workAnalysis', { static: true }) workAnalysisChart: WorkAnalysisChartComponent;

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
        this.areaCode = '14';
        $.getScript('/assets/scripts/flexible.js');
        this.statistics = new StatisticsViewModel();
        this.loadCity();
        this.loadStatistics();
    }

    /**
     * 窗口销毁
     */
    ngOnDestroy(): void {
    }

    /**
     * 统计数量
     */
    loadStatistics() {
        this.util.webapi.get<any>(`api/ldl_v/statistics/situation?code=14`).handle({
            ok: (resp) => {
                this.statistics = resp;
            }
        });
    }

    /**
     * 加载地市
     */
    loadCity() {
        this.util.webapi.get<any>(`api/ldl_v/data/city`).handle({
            ok: (resp) => {
                this.areaData = resp;
            }
        });
    }

    /**
     * 加载县区
     */
    loadCounty(code) {
        this.areaCode = code;
        if (code == '14') {
            this.loadCity();
        } else {
            this.util.webapi.get<any>(`api/ldl_v/data/county?code=${code}`).handle({
                ok: (resp) => {
                    this.areaData = resp;
                }
            });
        }
        this.degreeAnalysisChart.onRegionChange(code);
        this.genderAnalysisChart.onRegionChange(code);
        this.ageAnalysisChart.onRegionChange(code);
        this.healthAnalysisChart.onRegionChange(code);
        this.incomeAnalysisChart.onRegionChange(code);
        this.workAnalysisChart.onRegionChange(code);
    }
    /**
     * 打开人员窗口
     * @param title 标题
     * @param code 地区
     * @param type 类型
     */
    openDataDialog(title, code, type) {
        this.openDialog({
            component: AreaAnalysisDialogComponent,
            title: `${title}`,
            data: {
                code: code,
                name: type,
                areaUrl: `api/ldl_v/data/tree`,
                userUrl: `ldl_v/data/user`
            },
            width: '700px'
        })
    }
}
