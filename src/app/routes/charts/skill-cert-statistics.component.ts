import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart } from '@antv/g2';
import { SelectItem, util } from '@utils';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 技能证书统计
 */
@Component({
  selector: 'app-skill-cert-statistics-chart',
  template: `
      <div class="right-all">
          <span>总人数</span>
          <p>{{total}}</p>
      </div>
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" style="margin:10px auto; width:90%" id="skill-cert-statistics-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    `
    .right-all {
        float: left;
        color: #fff;
        margin-left: 5%;
    }
    .right-all p {
            color: #3affe4;
            font-size: 18px;
            font-weight: bold;
            line-height: 1.7;
            text-align: left;
        }
    `
  ]
})
export class SkillCertStatisticsChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
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
   * 总数量
   */
  total: number;
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
    //   { type: '初级', name: '初级', value: 1524 },
    //   { type: '中级', name: '中级', value: 934 },
    //   { type: '高级', name: '高级', value: 441 },
    // ];
    const colorMap = {
      '初级': '#ff7d4d',
      '中级': '#febe29',
      '高级': '#43d4fd'
    };
    this.total = this.data.reduce((totalValue, currentValue) => {
      return totalValue + currentValue.value;
    }, 0);
    const chart = new Chart({
      container: 'skill-cert-statistics-container',
      autoFit: true,
      padding: [10, 30, 50, 30] // 上、右、下、左
    });
    chart.on('interval:click', (ev) => {
      if (ev.data && ev.data.data) {
        const data = ev.data.data;
        this.openDialog({
          component: AreaAnalysisDialogComponent,
          title: `技能证书统计⇨${data.name}`,
          data: {
            code: this.areaCode || '14',
            ...ev.data.data,
            areaUrl: `api/ldl_v/statistics/skills/tree`,
            userUrl: `ldl_v/statistics/skills/user`
          },
          width: '600px'
        })
      }
    });
    chart.data(this.data);
    chart.axis(false);
    chart.legend('name', {
      position: 'top-right',
      itemSpacing: 15,
      custom: true,
      items: [
        { id: '1', name: '初级', value: '初级', marker: { spacing: 2, symbol: 'square', style: { fill: '#ff7d4d' } } },
        { id: '2', name: '中级', value: '中级', marker: { spacing: 2, symbol: 'square', style: { fill: '#febe29' } } },
        { id: '3', name: '高级', value: '高级', marker: { spacing: 2, symbol: 'square', style: { fill: '#43d4fd' } } }
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
    chart.coordinate('rect')
      .scale(0.5, 1)
      .transpose();
    chart.interval()
      .adjust('symmetric')
      .position('name*value')
      .shape('pyramid')
      .color('name', (name) => {
        return colorMap[name];
      })
      .style({
        cursor: 'pointer'
      })
      .label(
        'name*value',
        (name, value) => {
          return {
            content: `${name} ${value}`,
            style: {
              fill: colorMap[name]
            },
          };
        }, {
        offset: 55,
        labelLine: {
          style: {
            lineWidth: 1,
            // stroke: 'rgba(0, 0, 0, 0.8)',
          },
        },
      },
      )
      .animate({
        appear: {
          animation: 'fade-in'
        },
        update: {
          // annotation: 'fade-in'
        }
      });

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
