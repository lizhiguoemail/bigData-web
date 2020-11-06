import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart } from '@antv/g2';
import { SelectItem, util } from '@utils';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 年龄段分析
 */
@Component({
  selector: 'app-age-analysis-chart',
  template: `
      <div class="panel-header">
          <div class="panel-header-line">年龄段分析</div>
          <app-common-area width="92px"  margin="15px 0 0 28px" placeholder="请选择" [(model)]="areaCode" [dataSource]="areaData" (modelChange)="onRegionChange($event)"></app-common-area>
      </div>
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" id="age-analysis-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    `
    `
  ]
})
export class AgeAnalysisChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
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
    //   { "type": "农村劳动力", "name": "16-25周岁", "value": 56 },
    //   { "type": "城镇劳动力", "name": "16-25周岁", "value": 122 },
    //   { "type": "贫困劳动力", "name": "16-25周岁", "value": 132 },
    //   { "type": "2020高校毕业生", "name": "16-25周岁", "value": 12 },
    //   { "type": "农村劳动力", "name": "26-35周岁", "value": 23 },
    //   { "type": "城镇劳动力", "name": "26-35周岁", "value": 345 },
    //   { "type": "贫困劳动力", "name": "26-35周岁", "value": 678 },
    //   { "type": "2020高校毕业生", "name": "26-35周岁", "value": 133 },
    //   { "type": "农村劳动力", "name": "36-45周岁", "value": 22 },
    //   { "type": "城镇劳动力", "name": "36-45周岁", "value": 454 },
    //   { "type": "贫困劳动力", "name": "36-45周岁", "value": 765 },
    //   { "type": "2020高校毕业生", "name": "36-45周岁", "value": 345 },
    //   { "type": "农村劳动力", "name": "46-60周岁", "value": 12 },
    //   { "type": "城镇劳动力", "name": "46-60周岁", "value": 678 },
    //   { "type": "贫困劳动力", "name": "46-60周岁", "value": 765 },
    //   { "type": "2020高校毕业生", "name": "46-60周岁", "value": 432 },
    // ];
    const colorMap = {
      '16-25周岁': '#1a8ffc',
      '26-35周岁': '#ff6db4',
      '36-45周岁': '#53be42',
      '46-60周岁': '#7798be',
    };
    const chart = new Chart({
      container: 'age-analysis-container',
      autoFit: true,
      padding: [50, 20, 30, 60] // 上、右、下、左
    });
    chart.on('point:click', (ev) => {
      if (ev.data && ev.data.data) {
        const data = ev.data.data;
        this.openDialog({
          component: AreaAnalysisDialogComponent,
          title: `${data.type}⇨${data.name}`,
          data: {
            code: this.areaCode || '14',
            ...ev.data.data,
            areaUrl: `api/ldl_v/analysis/age/tree`,
            userUrl: `ldl_v/analysis/age/user`
          },
          width: '600px'
        })
      }
    });
    chart.data(this.data);
    chart.scale('value', {
      nice: true,
      alias: '人数'
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
      itemSpacing: 5,
      flipPage: false,
      custom: true,
      items: [
        { id: '1', name: '16-25周岁', value: '16-25周岁', marker: { spacing: 2, style: { fill: '#1a8ffc' } } },
        { id: '2', name: '26-35周岁', value: '26-35周岁', marker: { spacing: 2, style: { fill: '#ff6db4' } } },
        { id: '3', name: '36-45周岁', value: '36-45周岁', marker: { spacing: 2, style: { fill: '#53be42' } } },
        { id: '4', name: '46-60周岁', value: '46-60周岁', marker: { spacing: 2, style: { fill: '#7798be' } } },
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
    chart.line()
      .position('type*value')
      .color('name', val => {
        return colorMap[val];
      })
      .shape('smooth');
    chart.point()
      .position('type*value')
      .color('name', val => {
        return colorMap[val];
      })
      .size(4)
      .shape('circle')
      .style({
        stroke: '#fff',
        lineWidth: 1,
        cursor: 'pointer'
      });

    chart.interaction('active-region', {
      showEnable: [
        { trigger: 'point:mouseenter', action: 'cursor:pointer' },
        { trigger: 'point:mouseleave', action: 'cursor:default' },
      ],
    });
    // view.interaction('element-single-selected');
    // chart.interaction('element-highlight');
    // view.interaction('element-active');
    chart.render();
  }
}
