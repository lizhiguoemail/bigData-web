import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart } from '@antv/g2';
import { SelectItem, util } from '@utils';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 年收入分析
 */
@Component({
  selector: 'app-income-analysis-chart',
  template: `
      <div class="panel-header">
          <div class="panel-header-line">年收入分析</div>
          <app-common-area width="92px"  margin="15px 0 0 28px" placeholder="请选择" [(model)]="areaCode" [dataSource]="areaData" (modelChange)="onRegionChange($event)"></app-common-area>
      </div>
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" id="income-analysis-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    ``
  ]
})
export class IncomeAnalysisChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
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
    this.loadData();
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
    //   { "name": "8千-1万元", "type": "农村劳动力", "value": 2 },
    //   { "name": "2万-5万元", "type": "农村劳动力", "value": 1 },
    //   { "name": "5千-8千元", "type": "农村劳动力", "value": 2 },
    //   { "name": "1万-2万元", "type": "农村劳动力", "value": 1 },
    //   { "name": "3千-5千元", "type": "农村劳动力", "value": 1 },
    //   { "name": "0-3千元", "type": "农村劳动力", "value": 1 },
    //   { "name": "", "type": "城镇劳动力", "value": 0 },
    //   { "name": "5千-8千元", "type": "贫困劳动力", "value": 2 },
    //   { "name": "3千-5千元", "type": "贫困劳动力", "value": 2 },
    //   { "name": "无收入", "type": "贫困劳动力", "value": 2 },
    //   { "name": "1万-2万元", "type": "贫困劳动力", "value": 1 },
    //   { "name": "", "type": "2020年高校毕业生", "value": 0 }
    // ];
    const colorMap = {
      '0-3千元': '#7496f5',
      '3千-5千元': '#688cf5',
      '5千-8千元': '#5680f5',
      '8千-1万元': '#4572f4',
      '1万-2万元': '#255af3',
      '2万-5万元': '#0b46ef',
      '5万-10万元': '#103bb4',
      '10万元以上': '#062b95',
      '无收入': '#e0e0e0'
    };
    const chart = new Chart({
      container: 'income-analysis-container',
      autoFit: true,
      padding: [50, 20, 30, 60] // 上、右、下、左
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
            areaUrl: `api/ldl_v/analysis/income/tree`,
            userUrl: `ldl_v/analysis/income/user`
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
      maxWidth: 500,
      items: [
        { id: '1', name: '0-3千元', value: '0-3千元', marker: { spacing: 2, style: { fill: '#7496f5' } } },
        { id: '2', name: '3千-5千元', value: '3千-5千元', marker: { spacing: 2, style: { fill: '#688cf5' } } },
        { id: '3', name: '5千-8千元', value: '5千-8千元', marker: { spacing: 2, style: { fill: '#5680f5' } } },
        { id: '4', name: '8千-1万元', value: '8千-1万元', marker: { spacing: 2, style: { fill: '#4572f4' } } },
        { id: '5', name: '1万-2万元', value: '1万-2万元', marker: { spacing: 2, style: { fill: '#255af3' } } },
        { id: '6', name: '2万-5万元', value: '2万-5万元', marker: { spacing: 2, style: { fill: '#0b46ef' } } },
        { id: '7', name: '5万-10万元', value: '5万-10万元', marker: { spacing: 2, style: { fill: '#103bb4' } } },
        { id: '8', name: '10万元以上', value: '10万元以上', marker: { spacing: 2, style: { fill: '#062b95' } } },
        { id: '9', name: '无收入', value: '无收入', marker: { spacing: 2, style: { fill: '#e0e0e0' } } }
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
        cursor: 'pointer'
      })
      .adjust([
        {
          type: 'stack',
        },
      ]);

    chart.interaction('element-highlight-by-color');
    // view.interaction('element-single-selected');
    // chart.interaction('element-highlight');
    // view.interaction('element-active');
    chart.render();
  }
}
