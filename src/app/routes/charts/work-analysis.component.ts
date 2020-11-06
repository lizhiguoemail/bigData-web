import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart } from '@antv/g2';
import { SelectItem, util } from '@utils';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 就业与失业分析
 */
@Component({
  selector: 'app-work-analysis-chart',
  template: `
      <div class="panel-header">
          <div class="panel-header-line">就业与失业分析</div>
          <app-common-area width="92px"  margin="15px 0 0 28px" placeholder="请选择" [(model)]="areaCode" [dataSource]="areaData" (modelChange)="onRegionChange($event)"></app-common-area>
      </div>
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" id="work-analysis-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    ``
  ]
})
export class WorkAnalysisChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
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
    //   { type: '城镇劳动力', name: '就业', value: 10 },
    //   { type: '城镇劳动力', name: '失业', value: 30 },
    //   { type: '城镇劳动力', name: '务工', value: 30 },
    //   { type: '农村劳动力', name: '务农', value: 141 },
    //   { type: '农村劳动力', name: '就业', value: 32 },
    //   { type: '农村劳动力', name: '务工', value: 12 },
    //   { type: '贫困劳动力', name: '失业', value: 110 },
    //   { type: '贫困劳动力', name: '就业', value: 20 },
    //   { type: '2020年高校毕业生', name: '就业', value: 50 },
    //   { type: '2020年高校毕业生', name: '失业', value: 123 },
    //   { type: '2020年高校毕业生', name: '待业', value: 13 },
    //   { type: '2020年高校毕业生', name: '创业', value: 13 },
    //   { type: '2020年高校毕业生', name: '电商', value: 13 },
    //   { type: '2020年高校毕业生', name: '开店', value: 13 },
    // ];
    const colorMap = {
      '城镇劳动力': '#1a8ffc',
      '农村劳动力': '#ff6db4',
      '贫困劳动力': '#7798be',
      '2020年高校毕业生': '#53be42',
    };
    const chart = new Chart({
      container: 'work-analysis-container',
      autoFit: true,
      padding: [10, 10, 20, 10] // 上、右、下、左
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
            areaUrl: `api/ldl_v/analysis/work/tree`,
            userUrl: `ldl_v/analysis/work/user`
          },
          width: '600px'
        })
      }
    });
    chart.data(this.data);
    chart.coordinate('polar', {
      innerRadius: 0.1,
      radius: 0.8
    });
    // chart.scale('value', {
    //   nice: true,
    //   alias: '人数'
    // });
    // chart.axis('value', {
    //   title: {
    //     offset: 40,
    //     style: {
    //       fill: '#aaaaaa'
    //     },
    //   }
    // });
    chart.legend('type', {
      position: 'bottom',
      itemSpacing: 5,
      flipPage: false,
      custom: true,
      items: [
        { id: '1', name: '城镇劳动力', value: '城镇劳动力', marker: { spacing: 2, style: { fill: '#1a8ffc' } } },
        { id: '2', name: '农村劳动力', value: '农村劳动力', marker: { spacing: 2, style: { fill: '#ff6db4' } } },
        { id: '3', name: '贫困劳动力', value: '贫困劳动力', marker: { spacing: 2, style: { fill: '#7798be' } } },
        { id: '4', name: '2020年高校毕业生', value: '2020年高校毕业生', marker: { spacing: 2, style: { fill: '#53be42' } } },
      ],
      itemName: {
        style: {
          fill: '#ffffff'
        }
      }
    });
    chart.tooltip({
      showMarkers: false,
      showCrosshairs: true,
      showContent: false,
      crosshairs: {
        line: {
          style: {
            stroke: '#fff'
          }
        },
        text: {
          position: 'end',
          offset: 10,
          autoRotate: true,
          style: {
            fontSize: 14,
            fontWeight: 'bold',
            fill: '#fff'
          }
        },
        textBackground: null
      }
    });
    chart.interval()
    .position('name*value')
    .color('type', (type) => {
      return colorMap[type];
    })
    .style({
      cursor: 'pointer'
    })
    .style({
      lineWidth: 1,
      stroke: '#fff',
    })
    .adjust('stack');

    // chart.interaction('active-region');
    // view.interaction('element-single-selected');
    chart.interaction('element-highlight', {
      showEnable: [
        { trigger: 'interval:mouseenter', action: 'cursor:pointer' },
        { trigger: 'interval:mouseleave', action: 'cursor:default' },
      ],
    });
    // view.interaction('element-active');
    chart.render();
  }
}
