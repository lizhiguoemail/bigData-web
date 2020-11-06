import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart, registerShape } from '@antv/g2';
import { SelectItem, util } from '@utils';
import { Point } from '@antv/g2/lib/dependents';
import { Datum } from '@antv/g2/lib/interface';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 就失业情况统计
 */
@Component({
  selector: 'app-work-situation-statistics-chart',
  template: `
      <div class="right-table">
          <p [ngClass]="{'active':chartType==0}" (click)="switchChartType(0)">就业分析</p>
          <p [ngClass]="{'active':chartType==1}" (click)="switchChartType(1)">失业分析</p>
      </div>
      <div class="chart-container">
          <div *ngIf="!loading" class="chart" [ngClass]="{'none':chartType==1}" style="margin:10px auto; width:100%" id="work-jobs-situation-statistics-container"></div>
          <div *ngIf="!loading" class="chart" [ngClass]="{'none':chartType==0}" style="margin:10px auto; width:100%" id="loss-jobs-situation-statistics-container"></div>
          <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    `
      .right-table {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 7%;
      }
      .right-table p {
        text-align: center;
        color: #3affe4;
        width: 100px;
        font-size: 15px;
        font-weight: normal;
        color: #fff;
        border: 1px #29d3e9 solid;
        border-radius: 16px;
        line-height: 28px;
        cursor: pointer;
      }
      .right-table .active {
        background: rgb(41, 211, 233);
      }
    `
  ]
})
export class WorkSituationStatisticsChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
  /**
   * 图表类型
   */
  chartType: number;
  /**
   * 加载状态
   */
  @Input() loading: boolean;
  /**
   * 数据源
   */
  private workData: any;
  /**
   * 数据源
   */
  private lossData: any;
  /**
   * 请求地址
   */
  @Input() workUrl: string;
  /**
   * 请求地址
   */
  @Input() lossUrl: string;
  /**
   * 查询参数
   */
  @Input() queryParam;
  /**
   * 初始化时是否自动加载数据，默认为true,设置成false则手工加载
   */
  @Input() autoLoad: boolean;
  /**
   * 宽度
   */
  @Input() width?: string;
  /**
   * 区域数据源
   */
  @Input() areaData: SelectItem[];
  /**
   * 初始化下拉列表包装器
   */
  constructor() {
    super();
  }
  /**
   * 加载数据
   * @param data 列表项集合
   */
  loadWorkData(data?: any) {
    this.workData = data || this.workData;
    if (!this.workData) {
      return;
    }
  }
  /**
   * 加载数据
   * @param data 列表项集合
   */
  loadLossData(data?: any) {
    this.lossData = data || this.lossData;
    if (!this.lossData) {
      return;
    }
  }
  /**
   * 组件初始化
   */
  ngOnInit() {
    this.chartType = 0;
  }
  /**
   * 内容初始化后加载
   */
  ngAfterContentInit(): void {
    this.switchChartType(0);
  }
  /**
   * 呈现图形
   */
  renderWorkChart() {
    setTimeout(() => {
      this.renderWork();
    }, 100);
  }
  /**
   * 呈现图形
   */
  renderLossChart() {
    setTimeout(() => {
      this.renderLoss();
    }, 100);
  }
  /**
   * 区域变更
   * @param e 参数
   */
  onRegionChange(e) {
    this.areaCode = e;
    this.loadWorkUrl({
      param: { code: e }
    });
  }
  /**
   * 切换图表
   * @param type 类型
   */
  switchChartType(type) {
    this.chartType = type;
    setTimeout(() => {
      if (type == 0) {
        this.loadWorkUrl();
      } else {
        this.loadLossUrl();
      }
    }, 100);
  }
  /**
   * 从服务器加载
   */
  loadWorkUrl(options?: {
    /**
     * 请求地址
     */
    url?: string,
    /**
     * 查询参数
     */
    param?,
    /**
     * 成功加载回调函数
     */
    handler?: (value) => void;
  }) {
    options = options || {};
    const url = options.url || this.workUrl;
    if (!url) {
      return;
    }
    const param = options.param || this.queryParam;
    util.webapi.get<any>(url).param(param).handle({
      before: () => {
        this.loading = true;
        return true;
      },
      ok: result => {
        if (options.handler) {
          options.handler(result);
          return;
        }
        this.loadWorkData(result);
        this.renderWorkChart();
      },
      complete: () => this.loading = false
    });
  }
  /**
   * 从服务器加载
   */
  loadLossUrl(options?: {
    /**
     * 请求地址
     */
    url?: string,
    /**
     * 查询参数
     */
    param?,
    /**
     * 成功加载回调函数
     */
    handler?: (value) => void;
  }) {
    options = options || {};
    const url = options.url || this.lossUrl;
    if (!url) {
      return;
    }
    const param = options.param || this.queryParam;
    util.webapi.get<any>(url).param(param).handle({
      before: () => {
        this.loading = true;
        return true;
      },
      ok: result => {
        if (options.handler) {
          options.handler(result);
          return;
        }
        this.loadLossData(result);
        this.renderLossChart();
      },
      complete: () => this.loading = false
    });
  }
  /**
   * 获取样式
   */
  getStyle() {
    return {
      width: this.width ? this.width : null
    };
  }
  /**
   * 渲染就业图表
   */
  renderWork() {
    // this.data = [
    //   { type: '务农', name: '务农', value: 1524 },
    //   { type: '自主创业', name: '自主创业', value: 934 },
    //   { type: '灵活就业', name: '灵活就业', value: 441 },
    //   { type: '新业态就业', name: '新业态就业', value: 441 },
    //   { type: '稳定就业', name: '稳定就业', value: 441 },
    // ];
    const colorMap = {
      '务农': '#f79a4e',
      '自主创业': '#fba50a',
      '灵活就业': '#fc5c25',
      '新业态就业': '#47d0ff',
      '稳定就业': '#1682ff'
    };
    let max = 0;
    this.workData.forEach(function (obj) {
      if (obj.value > max) {
        max = obj.value;
      }
    });
    // 自定义 other 的图形，增加两条线
    registerShape('interval', 'slice-shape', {
      draw(cfg, container) {
        const points = cfg.points as Point[];
        const origin = cfg.data as Datum;
        const percent = origin.value / max;
        const xWidth = points[2].x - points[1].x;
        const width = xWidth * percent;
        let path = [];
        path.push(['M', points[0].x, points[0].y]);
        path.push(['L', points[1].x, points[1].y]);
        path.push(['L', points[0].x + width, points[2].y]);
        path.push(['L', points[0].x + width, points[3].y]);
        path.push('Z');
        path = this.parsePath(path);
        return container.addShape('path', {
          attrs: {
            fill: cfg.color,
            path,
          },
        });
      },
    });
    const chart = new Chart({
      container: 'work-jobs-situation-statistics-container',
      autoFit: true,
      padding: [30] // 上、右、下、左
    });
    chart.on('interval:click', (ev) => {
      if (ev.data && ev.data.data) {
        const data = ev.data.data;
        this.openDialog({
          component: AreaAnalysisDialogComponent,
          title: `就业分析⇨${data.name}`,
          data: {
            code: this.areaCode || '14',
            ...ev.data.data,
            areaUrl: `api/ldl_v/statistics/work/tree`,
            userUrl: `ldl_v/statistics/work/user`
          },
          width: '600px'
        })
      }
    });
    chart.data(this.workData);
    chart.axis(false);
    chart.legend('name', false);
    chart.tooltip({
      showCrosshairs: false, // 展示 Tooltip 辅助线
      showTitle: false,
      showMarkers: false,
      shared: false,
    });
    chart.coordinate('theta', {
      radius: 0.9,
      innerRadius: 0.2
    });
    chart.interval()
      .adjust('stack')
      .position('value')
      .shape('slice-shape')
      .color('name')
      // .color('name', (name) => {
      //   return colorMap[name];
      // })
      .style({
        cursor: 'pointer'
      })
      .label(
        'name*value',
        (name, value) => {
          return {
            content: `${value} ${name}`,
            style: {
              fill: colorMap[name]
            }
          };
        }, {
        offset: 15,
        labelLine: {
          style: {
            lineWidth: 1,
            // stroke: 'rgba(0, 0, 0, 0.8)',
          },
        },
      });

    // chart.interaction('active-region');
    // chart.interaction('element-single-selected');
    chart.interaction('element-highlight', {
      showEnable: [
        { trigger: 'interval:mouseenter', action: 'cursor:pointer' },
        { trigger: 'interval:mouseleave', action: 'cursor:default' },
      ],
    });
    // chart.interaction('element-active');
    chart.render();
  }
  /**
   * 渲染就业图表
   */
  renderLoss() {
    // this.data = [
    //   { type: '务农', name: '务农', value: 1524 },
    //   { type: '自主创业', name: '自主创业', value: 934 },
    //   { type: '灵活就业', name: '灵活就业', value: 441 },
    //   { type: '新业态就业', name: '新业态就业', value: 441 },
    //   { type: '稳定就业', name: '稳定就业', value: 441 },
    // ];
    const colorMap = {
      '失业': '#f79a4e',
      '非就业': '#086efc'
    };
    let max = 0;
    this.lossData.forEach(function (obj) {
      if (obj.value > max) {
        max = obj.value;
      }
    });
    // 自定义 other 的图形，增加两条线
    registerShape('interval', 'slice-shape', {
      draw(cfg, container) {
        const points = cfg.points as Point[];
        const origin = cfg.data as Datum;
        const percent = origin.value / max;
        const xWidth = points[2].x - points[1].x;
        const width = xWidth * percent;
        let path = [];
        path.push(['M', points[0].x, points[0].y]);
        path.push(['L', points[1].x, points[1].y]);
        path.push(['L', points[0].x + width, points[2].y]);
        path.push(['L', points[0].x + width, points[3].y]);
        path.push('Z');
        path = this.parsePath(path);
        return container.addShape('path', {
          attrs: {
            fill: cfg.color,
            path,
          },
        });
      },
    });
    const chart = new Chart({
      container: 'loss-jobs-situation-statistics-container',
      autoFit: true,
      padding: [30] // 上、右、下、左
    });
    chart.on('interval:click', (ev) => {
      if (ev.data && ev.data.data) {
        const data = ev.data.data;
        this.openDialog({
          component: AreaAnalysisDialogComponent,
          title: `失业分析⇨${data.name}`,
          data: {
            code: this.areaCode || '14',
            ...ev.data.data,
            areaUrl: `api/ldl_v/statistics/work/tree`,
            userUrl: `ldl_v/statistics/work/user`
          },
          width: '600px'
        })
      }
    });
    chart.data(this.lossData);
    chart.axis(false);
    chart.legend('name', false);
    chart.tooltip({
      showCrosshairs: false, // 展示 Tooltip 辅助线
      showTitle: false,
      showMarkers: false,
      shared: false,
    });
    chart.coordinate('theta', {
      radius: 0.9,
      innerRadius: 0.2
    });
    chart.interval()
      .adjust('stack')
      .position('value')
      .shape('slice-shape')
      .color('name')
      // .color('name', (name) => {
      //   return colorMap[name];
      // })
      .style({
        cursor: 'pointer'
      })
      .label(
        'name*value',
        (name, value) => {
          return {
            content: `${value} ${name}`,
            style: {
              fill: colorMap[name]
            }
          };
        }, {
        offset: 15,
        labelLine: {
          style: {
            lineWidth: 1,
            // stroke: 'rgba(0, 0, 0, 0.8)',
          },
        },
      });

    // chart.interaction('active-region');
    // chart.interaction('element-single-selected');
    chart.interaction('element-highlight', {
      showEnable: [
        { trigger: 'interval:mouseenter', action: 'cursor:pointer' },
        { trigger: 'interval:mouseleave', action: 'cursor:default' },
      ],
    });
    // chart.interaction('element-active');
    chart.render();
  }
}
