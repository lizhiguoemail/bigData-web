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
import { TrainingAgeDistributionChartComponent } from '../charts/training-age-distribution.component';
import { TrainingCompareChartComponent } from '../charts/training-compare.component';
import { TrainingIntentionAnalysisChartComponent } from '../charts/training-intention-analysis.component';
import { TrainingJobTop5ChartComponent } from '../charts/training-job-top5.component';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.less'],
})
export class SkillsComponent extends ComponentBase implements OnInit, OnDestroy {
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
   * 有培训意愿与已参加培训对比
   */
  @ViewChild('trainingCompare', {static: true}) trainingCompareChart: TrainingCompareChartComponent;
  /**
   * 培训人员年龄分布
   */
  @ViewChild('trainingAgeDistribution', {static: true}) trainingAgeDistributionChart: TrainingAgeDistributionChartComponent;
  /**
   * 培训意愿分析
   */
  @ViewChild('trainingIntentionAnalysis', {static: true}) trainingIntentionAnalysisChart: TrainingIntentionAnalysisChartComponent;
  /**
   * 培训前五工种
   */
  @ViewChild('trainingJobTop5', {static: true}) trainingJobTop5Chart: TrainingJobTop5ChartComponent;
  /**
   * 工种数据
   */
  jobData = [
    { text: '中式烹调师（准）', value: '中式烹调师（准）' },
    { text: '育婴员', value: '育婴员' },
    { text: '中式面点师', value: '中式面点师' },
    { text: '家畜饲养', value: '家畜饲养' },
    { text: '化妆师', value: '化妆师' },
    { text: '中式面点师', value: '中式面点师' },
    { text: '保育员', value: '保育员' }
  ];
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
    this.trainingAgeDistributionChart.onRegionChange(code);
    this.trainingCompareChart.onRegionChange(code);
    this.trainingIntentionAnalysisChart.onRegionChange(code);
    this.trainingJobTop5Chart.onRegionChange(code);
  }
}
