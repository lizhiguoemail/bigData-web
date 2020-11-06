import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart } from '@antv/g2';
import { util } from '@utils';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 有培训意愿与已参加培训对比
 */
@Component({
  selector: 'app-training-compare-chart',
  template: `
      <div class="panel-header">
          <div>有培训意愿与已参加培训对比</div>
      </div>
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" id="training-compare-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    `
    `
  ]
})
export class TrainingCompareChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
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
    //   { type: '太原市', value1: 30, value2: 10 },
    //   { type: '大同市', value1: 50, value2: 30 },
    //   { type: '阳泉市', value1: 25, value2: 141 },
    //   { type: '晋中市', value1: 45, value2: 567 },
    //   { type: '吕梁市', value1: 78, value2: 110 },
    //   { type: '临汾市', value1: 32, value2: 20 },
    // ];
    const dv = new DataSet().createView();
    dv.source(this.data).transform({
      type: 'fold',
      fields: ['value1', 'value2'], // 展开字段集
      key: 'name', // key字段
      value: 'value', // value字段
    });
    const colorMap = {
      'value1': '#6295f6',
      'value2': '#60d9ac'
    };
    const titleMap = {
      'value1': '有培训意愿',
      'value2': '已参加培训'
    };
    const chart = new Chart({
      container: 'training-compare-container',
      autoFit: true,
      padding: [30,20,30,60] // 上、右、下、左
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
    //         areaUrl: `api/ldl_v/analysis/contrast/tree`,
    //         userUrl: `ldl_v/analysis/contrast/user`
    //       },
    //       width: '600px'
    //     })
    //   }
    // });
    chart.data(dv.rows);
    chart.scale('value', {
      nice: true,
      alias: '人数',
    });
    chart.scale({
      name: {
        formatter: val => {
          return titleMap[val];
        }
      }
    })
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
        { id: '1', name: '有培训意愿', value: '有培训意愿', marker: { spacing: 2, style: { fill: '#6295f6' } } },
        { id: '2', name: '已参加培训', value: '已参加培训', marker: { spacing: 2, style: { fill: '#60d9ac' } } }
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
        type: 'dodge',
        marginRatio: 0,
      },
    ]);
  
    chart.interaction('active-region');
    // view.interaction('element-single-selected');
    // chart.interaction('element-highlight');
    // view.interaction('element-active');
    chart.render();
  }
}
