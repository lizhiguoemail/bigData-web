import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart } from '@antv/g2';
import { util } from '@utils';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 灵活就业分析
 */
@Component({
  selector: 'app-work-flexible-analysis-chart',
  template: `
      <div class="panel-header">
          <div>灵活就业分析</div>
      </div>
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" id="work-flexible-analysis-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    `
    `
  ]
})
export class WorkFlexibleAnalysisChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
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
    //   { type: '太原市', name: '16-25周岁', value: 10 },
    //   { type: '太原市', name: '26-35周岁', value: 10 },
    //   { type: '大同市', name: '26-35周岁', value: 30 },
    //   { type: '朔州市', name: '26-35周岁', value: 141 },
    //   { type: '阳泉市', name: '26-35周岁', value: 567 },
    //   { type: '晋中市', name: '26-35周岁', value: 110 },
    //   { type: '临汾市', name: '26-35周岁', value: 20 },
    // ];
    const colorMap = {
      '16-25周岁': '#1a8ffc',
      '26-35周岁': '#ff6db4',
      '36-45周岁': '#53be42',
      '46-60周岁': '#7798be',
      '60周岁以上': '#90c6ae',
    };
    const titleMap = {
      'ty': '太原',
      'dt': '大同',
      'yq': '阳泉',
      'cz': '长治',
      'jc': '晋城',
      'sz': '朔州',
      'xz': '忻州',
      'll': '吕梁',
      'jz': '晋中',
      'lf': '临汾',
      'yc': '运城'
    };
    const chart = new Chart({
      container: 'work-flexible-analysis-container',
      autoFit: true,
      padding: [50,5,5,5] // 上、右、下、左
    });
    // chart.on('point:click', (ev) => {
    //   if (ev.data && ev.data.data) {
    //     const data = ev.data.data;
    //     this.openDialog({
    //       component: AreaAnalysisDialogComponent,
    //       title: `${data.type}⇨${data.name}`,
    //       data: {
    //         code: this.areaCode || '14',
    //         ...ev.data.data,
    //         areaUrl: `api/ldl_v/analysis/flexible/tree`,
    //         userUrl: `ldl_v/analysis/flexible/user`
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
    // chart.scale({
    //   type: {
    //     formatter: val => {
    //       return titleMap[val];
    //     },
    //   }
    // });
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
      itemSpacing: 15,
      flipPage: false,
      custom: true,
      items: [
        { id: '1', name: '16-25周岁', value: '16-25周岁', marker: { spacing: 2, style: { fill: '#1a8ffc' } } },
        { id: '2', name: '26-35周岁', value: '26-35周岁', marker: { spacing: 2, style: { fill: '#ff6db4' } } },
        { id: '3', name: '36-45周岁', value: '36-45周岁', marker: { spacing: 2, style: { fill: '#53be42' } } },
        { id: '4', name: '46-60周岁', value: '46-60周岁', marker: { spacing: 2, style: { fill: '#7798be' } } },
        { id: '5', name: '60周岁以上', value: '60周岁以上', marker: { spacing: 2, style: { fill: '#90c6ae' } } },
      ],
      itemName: {
        style: {
          fill: '#ffffff'
        }
      }
    });
    chart.coordinate('polar', {
      radius: 0.8,
    });
    chart.tooltip({
      showCrosshairs: true, // 展示 Tooltip 辅助线
      showTitle: true,
      showMarkers: false,
      shared: true,
      crosshairs: {
        line: {
          style: {
            lineDash: [4, 4],
            stroke: '#333'
          }
        }
      }
    });
    chart.axis('type', {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineDash: null,
          },
        },
      },
    });
    chart.axis('value1', {
      line: null,
      tickLine: null,
      grid: {
        line: {
          type: 'line',
          style: {
            lineDash: null,
          },
        },
      },
    });
    chart
      .line()
      .position('type*value1')
      .color('name', val => {
        return colorMap[val];
      })
      .size(2);
    chart
      .point()
      .position('type*value1')
      .color('name', val => {
        return colorMap[val];
      })
      .shape('circle')
      .size(4)
      .style({
        stroke: '#fff',
        lineWidth: 1,
        fillOpacity: 1,
        cursor: 'pointer'
      });
    chart
      .area()
      .position('type*value1')
      .color('name', val => {
        return colorMap[val];
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
