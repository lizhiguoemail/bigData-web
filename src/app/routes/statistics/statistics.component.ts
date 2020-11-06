/* tslint:disable:ban-types */
import {
    Component,
    Inject,
    OnDestroy,
    Optional,
    OnInit,
    Injector,
    ViewChild,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ComponentBase} from '@utils';
import {state} from '@angular/animations';
import {StatisticsViewModel} from '../model/statistics-view-model';
import {SkillCertStatisticsChartComponent} from '../charts/skill-cert-statistics.component';
import {WorkSituationStatisticsChartComponent} from '../charts/work-situation-statistics.component';
import {TrainingIntentionStatisticsChartComponent} from '../charts/training-intention-statistics.component';
import {JobIntentionStatisticsChartComponent} from '../charts/job-intention-statistics.component';
import {SkillImproveStatisticsChartComponent} from '../charts/skill-improve-statistics.component';
import {LaborOutputSituationStatisticsChartComponent} from '../charts/labor-output-situation-statistics.component';
import {AreaAnalysisDialogComponent} from '../dialog/area-analysis-dialog.component';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.less'],
})
export class StatisticsComponent extends ComponentBase implements OnInit, OnDestroy {
    myOpts = {separator: ''};
    /**
     * 地区数据
     */
    areaData: any;
    /**
     * 统计数量
     */
    statistics: StatisticsViewModel;
    /**
     * 判断搜索
     */
    // ismargin = false;
    /**
     * 技能证书统计
     */
    @ViewChild('skillCertStatistics', {static: true}) skillCertStatisticsChart: SkillCertStatisticsChartComponent;
    /**
     * 就业失业统计
     */
    @ViewChild('workSituationStatistics', {static: true}) workSituationStatisticsChart: WorkSituationStatisticsChartComponent;
    /**
     * 培训意愿统计
     */
    @ViewChild('trainingIntentionStatistics', {static: true}) trainingIntentionStatisticsChart: TrainingIntentionStatisticsChartComponent;
    /**
     * 求职意愿统计
     */
    @ViewChild('jobIntentionStatistics', {static: true}) jobIntentionStatisticsChart: JobIntentionStatisticsChartComponent;
    /**
     * 技能提升统计
     */
    @ViewChild('skillImproveStatistics', {static: true}) skillImproveStatisticsChart: SkillImproveStatisticsChartComponent;
    /**
     * 劳务输出意愿统计
     */
    @ViewChild('laborOutputSituationStatistics', {static: true}) laborOutputSituationStatisticsChart: LaborOutputSituationStatisticsChartComponent;

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
        // this.card = '';
        $.getScript('/assets/scripts/flexible.js');
        this.statistics = new StatisticsViewModel();
        this.loadStatistics();
    }

    /**
     * 销毁页面
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
        // if (code == '14') {
        //   this.loadCity();
        // } else {
        //   this.util.webapi.get<any>(`api/ldl_v/data/county?code=${code}`).handle({
        //     ok: (resp) => {
        //       this.areaData = resp;
        //     }
        //   });
        // }
        this.skillCertStatisticsChart.onRegionChange(code);
        this.workSituationStatisticsChart.onRegionChange(code);
        this.trainingIntentionStatisticsChart.onRegionChange(code);
        this.jobIntentionStatisticsChart.onRegionChange(code);
        this.skillImproveStatisticsChart.onRegionChange(code);
        this.laborOutputSituationStatisticsChart.onRegionChange(code);
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
        });
    }
}
