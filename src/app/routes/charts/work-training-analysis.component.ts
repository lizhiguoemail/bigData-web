import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart } from '@antv/g2';
import { util } from '@utils';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 就业培训分析
 */
@Component({
  selector: 'app-work-training-analysis-chart',
  template: `
      <div class="panel-header">
          <div>就业培训分析</div>
      </div>
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" id="work-training-analysis-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    `
    `
  ]
})
export class WorkTrainingAnalysisChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
  /**
   * 加载状态
   */
  @Input() loading: boolean;
  /**
   * 数据源
   */
  private data: any;
  /**
   * 请求地址
   */
  @Input() url: string;
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
   * 初始化下拉列表包装器
   */
  constructor() {
    super();
  }
  /**
   * 加载数据
   * @param data 列表项集合
   */
  loadData(data?: any) {
    this.data = data || this.data;
    if (!this.data) {
      return;
    }
  }
  /**
   * 组件初始化
   */
  ngOnInit() {
  }
  /**
   * 内容初始化后加载
   */
  ngAfterContentInit(): void {
    if (this.autoLoad) {
      this.loadUrl();
    }
  }
  /**
   * 呈现图形
   */
  renderChart() {
    setTimeout(() => {
      this.render();
    }, 100);
  }
  /**
   * 区域变更
   * @param e 参数
   */
  onRegionChange(e) {
    this.areaCode = e;
    this.loadUrl({
      param: { code: e }
    });
  }
  /**
   * 从服务器加载
   */
  loadUrl(options?: {
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
    const url = options.url || this.url;
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
        this.loadData(result);
        this.renderChart();
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
   * 渲染图表
   */
  render() {
    // this.data = [
    //   { type: '西式烹调师', name: '西式烹调师', value: 10 },
    //   { type: '推销员', name: '推销员', value: 30 },
    //   { type: '公关员', name: '公关员', value: 141 },
    //   { type: '模特', name: '模特', value: 567 },
    //   { type: '内勤', name: '内勤', value: 110 },
    //   { type: '营业人员、收银员', name: '营业人员、收银员', value: 120 },
    //   { type: '西式面点师', name: '西式面点师', value: 223 },
    //   { type: '其他大田作物生产人员', name: '其他大田作物生产人员', value: 122 },
    //   { type: '促销员', name: '促销员', value: 321 },
    //   { type: '中式面点师', name: '中式面点师', value: 56 },
    // ];
    const chart = new Chart({
      container: 'work-training-analysis-container',
      autoFit: true,
      padding: [70,20,30,60] // 上、右、下、左
    });
    // chart.on('interval:click', (ev) => {
    //   if (ev.data && ev.data.data) {
    //     const data = ev.data.data;
    //     this.openDialog({
    //       component: AreaAnalysisDialogComponent,
    //       title: `${data.type}⇨${data.name}`,
    //       data: {
    //         code: this.areaCode || '14',
    //         ...ev.data.data,
    //         areaUrl: `api/ldl_v/analysis/cultivate/tree`,
    //         userUrl: `ldl_v/analysis/cultivate/user`
    //       },
    //       width: '600px'
    //     })
    //   }
    // });
    chart.data(this.data);
    chart.scale('value1', {
      nice: true,
      alias: '人数'
    });
    chart.axis('value1', {
      title: {
        offset: 40,
        style: {
          fill: '#aaaaaa'
        },
      }
    });
    chart.legend('name', {
      position: 'top',
      flipPage: false,
      itemName: {
        style: {
          fill: '#fff'
        }
      }
    });
    chart.tooltip({
      showCrosshairs: false, // 展示 Tooltip 辅助线
      showTitle: true,
      showMarkers: false,
      shared: true,
    });
    chart.interval()
    .position('type*value1')
    .color('name')
    .style({
      cursor: 'pointer'
    })
    .label('value1', (value1) => {
      return {
        content: (data) => {
          return `${value1}`;
        },
      };
    }, {
      style: {
        fill: '#fff',
        textAlign: 'center',
      }
    });
  
    chart.interaction('element-highlight-by-color');
    // view.interaction('element-single-selected');
    // chart.interaction('element-highlight');
    // view.interaction('element-active');
    chart.render();
  }
}
