import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart, registerShape } from '@antv/g2';
import { SelectItem, util } from '@utils';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 培训意愿统计
 */
@Component({
  selector: 'app-training-intention-statistics-chart',
  template: `
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" style="margin:10px auto; width:100%" id="training-intention-statistics-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    ``
  ]
})
export class TrainingIntentionStatisticsChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
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
    //   { type: '其他邮政电信业务人员', name: '其他邮政电信业务人员', value: 824 },
    //   { type: '模特', name: '模特', value: 624 },
    //   { type: '促销员', name: '促销员', value: 524 },
    //   { type: '业务员', name: '业务员', value: 324 },
    //   { type: '音像发行员', name: '音像发行员', value: 1424 },
    //   { type: '报刊零售员', name: '报刊零售员', value: 1524 },
    //   { type: '营销员', name: '营销员', value: 934 },
    //   { type: '门卫', name: '门卫', value: 441 },
    //   { type: '领班', name: '领班', value: 341 },
    //   { type: '保安员', name: '保安员', value: 3241 },
    // ];
    const colorMap = {
      '其他邮政电信业务人员': '#0864fa',
      '模特': '#00d1bd',
      '促销员': '#086cfc',
      '业务员': '#00cdb7',
      '音像发行员': '#00d3bf',
      '报刊零售员': '#624f25',
      '营销员': '#ff8923',
      '门卫': '#ff4920',
      '领班': '#ff481f',
      '保安员': '#f69624'
    };
    let max = 0;
    this.data.forEach(function (obj) {
      if (obj.value > max) {
        max = obj.value;
      }
    });
    let total = this.data.reduce((totalValue, currentValue) => {
      return totalValue + currentValue.value;
    }, 0);
    const chart = new Chart({
      container: 'training-intention-statistics-container',
      autoFit: true,
      padding: [20, 30, 10, 20] // 上、右、下、左
    });
    chart.on('interval:click', (ev) => {
      if (ev.data && ev.data.data) {
        const data = ev.data.data;
        this.openDialog({
          component: AreaAnalysisDialogComponent,
          title: `培训意愿统计⇨${data.name}`,
          data: {
            code: this.areaCode || '14',
            ...ev.data.data,
            areaUrl: `api/ldl_v/statistics/train/tree`,
            userUrl: `ldl_v/statistics/train/user`
          },
          width: '600px'
        });
      }
    });
    chart.data(this.data);
    chart.scale('value', {
      min: 0,
      max: max + 500,
    });
    chart.axis('name', {
      grid: null,
      tickLine: null,
      line: null,
      label: {
        style: {
          fill: '#fff'
        }
      }
    });
    chart.legend('name', {
      position: 'right',
      itemSpacing: 8,
      flipPage: false,
      custom: true,
      items: [
        { id: '1', name: '其他邮政电信业务人员', value: '其他邮政电信业务人员', marker: { spacing: 2, style: { fill: '#0864fa' } } },
        { id: '2', name: '模特', value: '模特', marker: { spacing: 2, style: { fill: '#00d1bd' } } },
        { id: '3', name: '促销员', value: '促销员', marker: { spacing: 2, style: { fill: '#086cfc' } } },
        { id: '4', name: '业务员', value: '业务员', marker: { spacing: 2, style: { fill: '#00cdb7' } } },
        { id: '5', name: '音像发行员', value: '音像发行员', marker: { spacing: 2, style: { fill: '#00d3bf' } } },
        { id: '6', name: '报刊零售员', value: '报刊零售员', marker: { spacing: 2, style: { fill: '#624f25' } } },
        { id: '7', name: '营销员', value: '营销员', marker: { spacing: 2, style: { fill: '#ff8923' } } },
        { id: '8', name: '门卫', value: '门卫', marker: { spacing: 2, style: { fill: '#ff4920' } } },
        { id: '9', name: '领班', value: '领班', marker: { spacing: 2, style: { fill: '#ff481f' } } },
        { id: '10', name: '保安员', value: '保安员', marker: { spacing: 2, style: { fill: '#f69624' } } },
      ],
      itemName: {
        style: {
          fill: '#ffffff'
        }
      }
    });
    chart.tooltip({
      title: 'name',
      showCrosshairs: false, // 展示 Tooltip 辅助线
      showTitle: true,
      showMarkers: false,
      shared: false,
    });
    chart.coordinate('polar', { radius: 1, innerRadius: 0.1 }).transpose();
    chart.interval()
    .position('name*value')
    .color('name', (name) => {
      return colorMap[name];
    })
    .style({
      cursor: 'pointer'
    })
    .tooltip('value', (val) => {
      return {
        name: '占比',
        value: (val / total * 100).toFixed(2) + '%',
      };
    })
    // .label('value', {
    //   offset: -2,
    //   content: (data) => {
    //     return (data.value / total * 100).toFixed(2) + '%';
    //   }
    // });

    // chart.interaction('active-region');
    // chart.interaction('element-single-selected');
    chart.interaction('element-highlight');
    // chart.interaction('element-active');
    chart.render();
  }
}
