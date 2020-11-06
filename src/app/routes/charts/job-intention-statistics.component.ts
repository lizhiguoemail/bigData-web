import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart } from '@antv/g2';
import { util } from '@utils';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 求职意愿统计
 */
@Component({
  selector: 'app-job-intention-statistics-chart',
  template: `
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" style="margin:10px auto; width:95%;" id="job-intention-statistics-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    `
    `
  ]
})
export class JobIntentionStatisticsChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
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
    //   { type: '群众团体负责人', name: '城镇劳动力', value: 456 },
    //   { type: '井下采矿工', name: '城镇劳动力', value: 2345 },
    //   { type: '养老护理员', name: '城镇劳动力', value: 534 },
    //   { type: '育婴师', name: '城镇劳动力', value: 1234 },
    //   { type: '高科技工作', name: '城镇劳动力', value: 56756 },
    //   { type: '群众团体负责人', name: '农村劳动力', value: 23434 },
    //   { type: '井下采矿工', name: '农村劳动力', value: 45666 },
    //   { type: '养老护理员', name: '农村劳动力', value: 56734 },
    //   { type: '育婴师', name: '农村劳动力', value: 45345 },
    //   { type: '高科技工作', name: '农村劳动力', value: 85722 },
    //   { type: '群众团体负责人', name: '贫困劳动力', value: 42752 },
    //   { type: '井下采矿工', name: '贫困劳动力', value: 4527 },
    //   { type: '养老护理员', name: '贫困劳动力', value: 7862 },
    //   { type: '育婴师', name: '贫困劳动力', value: 25224 },
    //   { type: '高科技工作', name: '贫困劳动力', value: 75245 },
    //   { type: '群众团体负责人', name: '2020年高校毕业生', value: 8787 },
    //   { type: '井下采矿工', name: '2020年高校毕业生', value: 78527 },
    //   { type: '养老护理员', name: '2020年高校毕业生', value: 25224 },
    //   { type: '育婴师', name: '2020年高校毕业生', value: 22574 },
    //   { type: '高科技工作', name: '2020年高校毕业生', value: 4587 },
    // ];
    const colorMap = {
      '城镇劳动力': '#1a8ffc',
      '农村劳动力': '#ff6db4',
      '贫困劳动力': '#3dc8f1',
      '2020年高校毕业生': '#53be42'
    };
    const chart = new Chart({
      container: 'job-intention-statistics-container',
      autoFit: true,
      padding: [50,20,30,60] // 上、右、下、左
    });
    chart.on('interval:click', (ev) => {
      if (ev.data && ev.data.data) {
        const data = ev.data.data;
        this.openDialog({
          component: AreaAnalysisDialogComponent,
          title: `${data.type}⇨${data.name}`,
          data: {
            code: this.areaCode || '14',
            ...ev.data.data,
            areaUrl: `api/ldl_v/statistics/apply_jobs/tree`,
            userUrl: `ldl_v/statistics/apply_jobs/user`
          },
          width: '600px'
        })
      }
    });
    chart.data(this.data);
    chart.scale({
      value: {
        alias: '人数',
        min: 0,
        formatter(val) {
          return (val / 10000) + '万';
        },
      }
    });
    chart.axis('value', {
      title: {
        offset: 40,
        style: {
          fill: '#aaaaaa'
        },
      }
    });
    chart.legend('name', {
      position: 'top',
      itemSpacing: 15,
      custom: true,
      items: [
        { id: '1', name: '城镇劳动力', value: '城镇劳动力', marker: { spacing: 2, symbol: 'square', style: { fill: '#1a8ffc' } } },
        { id: '2', name: '农村劳动力', value: '农村劳动力', marker: { spacing: 2, symbol: 'square', style: { fill: '#ff6db4' } } },
        { id: '3', name: '贫困劳动力', value: '贫困劳动力', marker: { spacing: 2, symbol: 'square', style: { fill: '#3dc8f1' } } },
        { id: '4', name: '2020年高校毕业生', value: '2020年高校毕业生', marker: { spacing: 2, symbol: 'square', style: { fill: '#53be42' } } }
      ],
      itemName: {
        style: {
          fill: '#ffffff'
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
    .position('type*value')
    .color('name', (name) => {
      return colorMap[name];
    })
    .style({
      cursor: 'pointer',
    })
    .label('value', (value) => {
      return {
        content: (data) => {
          return `${value / 10000}`;
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
