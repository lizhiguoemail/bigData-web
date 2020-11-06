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
import { WorkFlexibleAnalysisChartComponent } from '../charts/work-flexible-analysis.component';
import { WorkSituationAnalysisChartComponent } from '../charts/work-situation-analysis.component';
import { WorkStatisticsAnalysisChartComponent } from '../charts/work-statistics-analysis.component';
import { WorkTrainingAnalysisChartComponent } from '../charts/work-training-analysis.component';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.less'],
})
export class JobsComponent extends ComponentBase implements OnInit, OnDestroy {
  myOpts = { separator: '' };
  /**
   * 地区数据
   */
  areaData: any;
  /**
   * 统计数量
   */
  statistics: any;
  /**
   * 就业情况分析
   */
  @ViewChild('workSituationAnalysis', {static: true}) workSituationAnalysisChart: WorkSituationAnalysisChartComponent;
  /**
   * 灵活就业
   */
  @ViewChild('workFlexibleAnalysis', {static: true}) workFlexibleAnalysisChart: WorkFlexibleAnalysisChartComponent;
  /**
   * 就业培训分析
   */
  @ViewChild('workTrainingAnalysis', {static: true}) workTrainingAnalysisChart: WorkTrainingAnalysisChartComponent;
  /**
   * 就业统计分析
   */
  @ViewChild('workStatisticsAnalysis', {static: true}) workStatisticsAnalysisChart: WorkStatisticsAnalysisChartComponent;
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
    $.getScript('/assets/scripts/flexible.js');
  }
  /**
   * 销毁页面
   */
  ngOnDestroy(): void {}

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
    if(code == '14') {
      this.loadCity();
    } else {
      this.util.webapi.get<any>(`api/ldl_v/data/county?code=${code}`).handle({
        ok: (resp) => {
          this.areaData = resp;
        }
      });
    }
    this.workSituationAnalysisChart.onRegionChange(code);
    this.workFlexibleAnalysisChart.onRegionChange(code);
    this.workTrainingAnalysisChart.onRegionChange(code);
    this.workStatisticsAnalysisChart.onRegionChange(code);
  }
}
