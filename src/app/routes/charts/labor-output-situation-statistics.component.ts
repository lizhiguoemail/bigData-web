import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart, registerShape } from '@antv/g2';
import { Point } from '@antv/g2/lib/dependents';
import { SelectItem, util } from '@utils';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 劳务输出意愿统计
 */
@Component({
  selector: 'app-labor-output-situation-statistics-chart',
  template: `
      <div class="right-all">
          <span>总人数</span>
          <p>{{total}}</p>
      </div>
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" style="margin:10px auto 0 auto; width:90%" id="labor-output-situation-statistics-container"></div>
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
export class LaborOutputSituationStatisticsChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
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
    //   { type: '省内', name: '省内', value: 1524 },
    //   { type: '省外', name: '省外', value: 934 },
    //   { type: '美国', name: '美国', value: 441 },
    //   { type: '日本', name: '日本', value: 341 },
    //   { type: '俄罗斯', name: '俄罗斯', value: 741 },
    // ];
    const colorMap = {
      '省内': '#5a8ff6',
      '省外': '#57d7a7',
      '美国': '#5d7091',
      '日本': '#f6be30',
      '俄罗斯': '#e96756'
    };
    this.total = this.data.reduce((totalValue, currentValue) => {
      return totalValue + currentValue.value;
    }, 0);
    // 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值
    const sliceNumber = 0.01;
    // 自定义 other 的图形，增加两条线
    registerShape('interval', 'slice-shape', {
      draw(cfg, container) {
        const points = cfg.points as Point[];
        let path = [];
        path.push(['M', points[0].x, points[0].y]);
        path.push(['L', points[1].x, points[1].y - sliceNumber]);
        path.push(['L', points[2].x, points[2].y - sliceNumber]);
        path.push(['L', points[3].x, points[3].y]);
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
      container: 'labor-output-situation-statistics-container',
      autoFit: true,
      padding: [20, 50, 30, 50] // 上、右、下、左
    });
    chart.on('interval:click', (ev) => {
      if (ev.data && ev.data.data) {
        const data = ev.data.data;
        this.openDialog({
          component: AreaAnalysisDialogComponent,
          title: `劳务输出意愿⇨${data.name}`,
          data: {
            code: this.areaCode || '14',
            ...ev.data.data,
            areaUrl: `api/ldl_v/statistics/export_labors/tree`,
            userUrl: `ldl_v/statistics/export_labors/user`
          },
          width: '600px'
        })
      }
    });
    chart.data(this.data);
    chart.axis(false);
    chart.legend('name', {
      position: 'right',
      itemSpacing: 15,
      // custom: true,
      // items: [
      //   { id: '1', name: '初级', value: '初级', marker: { spacing: 2, symbol: 'square', style: { fill: '#43d4fd' } } },
      //   { id: '2', name: '中级', value: '中级', marker: { spacing: 2, symbol: 'square', style: { fill: '#febe29' } } },
      //   { id: '3', name: '高级', value: '高级', marker: { spacing: 2, symbol: 'square', style: { fill: '#ff7d4d' } } }
      // ],
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
    chart.coordinate('theta', {
      radius: 0.88,
      innerRadius: 0.90,
    });
    chart.annotation().image({
      start: ['50%', '50%'], 
      end: ['50%', '50%'], 
      offsetX: -62,
      offsetY: -62,
      src: '/assets/images/fj.png'
    });
    chart.interval()
      .adjust('stack')
      .position('value')
      .color('name')
      .shape('slice-shape')
      .style({
        cursor: 'pointer'
      })
      .label(
        'name*value',
        (name, value) => {
          return {
            content: `${name}`,
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
      })
      .animate({
        appear: {
          animation: 'fade-in'
        },
        update: {
          // annotation: 'fade-in'
        }
      });

    chart.interaction('active-region', {
      showEnable: [
        { trigger: 'interval:mouseenter', action: 'cursor:pointer' },
        { trigger: 'interval:mouseleave', action: 'cursor:default' },
      ],
    });
    // view.interaction('element-single-selected');
    // chart.interaction('element-highlight');
    // view.interaction('element-active');
    chart.render();
  }
}
