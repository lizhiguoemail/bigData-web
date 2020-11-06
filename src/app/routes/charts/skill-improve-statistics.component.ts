import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart, registerShape } from '@antv/g2';
import { SelectItem, util } from '@utils';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 技能提升统计
 */
@Component({
  selector: 'app-skill-improve-statistics-chart',
  template: `
      <div class="right-all">
          <span>总人数</span>
          <p>{{total}}</p>
      </div>
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" style="margin:10px auto; width:90%" id="skill-improve-statistics-container"></div>
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
export class SkillImproveStatisticsChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
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
    //   { type: '2018', name: '2018', value: 1524 },
    //   { type: '2019', name: '2019', value: 934 },
    //   { type: '2020', name: '2020', value: 0 },
    // ];
    let max = 0;
    this.data.forEach(function (obj) {
      if (obj.value > max) {
        max = obj.value;
      }
    });
    // 自定义Shape 部分
    registerShape('point', 'pointer', {
      draw(cfg, container) {
        const group = container.addGroup();
        const center = this.parsePoint({ x: 0, y: 0 }); // 获取极坐标系下画布中心点
        // 绘制指针
        group.addShape('line', {
          attrs: {
            x1: center.x,
            y1: center.y,
            x2: cfg.x,
            y2: cfg.y,
            stroke: cfg.color,
            lineWidth: 3,
            lineCap: 'round',
          },
        });
        group.addShape('circle', {
          attrs: {
            x: center.x,
            y: center.y,
            r: 6.75,
            stroke: cfg.color,
            lineWidth: 3.5,
            fill: '#fff',
          },
        });

        return group;
      },
    });
    const colorMap = {
      '2018': '#43d4fd',
      '2019': '#febe29',
      '2020': '#ff7d4d'
    };
    this.total = this.data.reduce((totalValue, currentValue) => {
      return totalValue + currentValue.value;
    }, 0);
    const chart = new Chart({
      container: 'skill-improve-statistics-container',
      autoFit: true,
      padding: [10, 10, 10, 10] // 上、右、下、左
    });
    chart.on('point:click', (ev) => {
      if (ev.data && ev.data.data) {
        const data = ev.data.data;
        this.openDialog({
          component: AreaAnalysisDialogComponent,
          title: `${data.name}`,
          data: {
            code: this.areaCode || '14',
            ...ev.data.data,
            areaUrl: `api/ldl_v/statistics/upgrad_skills/tree`,
            userUrl: `ldl_v/statistics/upgrad_skills/user`
          },
          width: '600px'
        })
      }
    });
    chart.data(this.data);
    chart.axis(false);
    chart.legend('name', false);
    chart.tooltip({
      showCrosshairs: false, // 展示 Tooltip 辅助线
      showTitle: true,
      showMarkers: false,
      shared: true,
    });
    chart.facet('rect', {
      fields: ['name'],
      padding: 2,
      showTitle: false,
      eachView: (view, facet) => {
        const dv = new DataSet().createView();
        dv.source(facet.data).transform({
          type: 'percent',
          field: 'value',
          dimension: 'name',
          as: 'percent',
        });
        view.data(dv.rows);
        view.scale('value', {
          min: 0,
          max: max + 100,
          tickInterval: 100,
        });
        view.coordinate('polar', {
          startAngle: (-9 / 8) * Math.PI,
          endAngle: (1 / 8) * Math.PI,
          radius: 0.75,
        });
        view.tooltip(false);
        view.legend(false);
        view.axis('1', false);
        view.axis('value', {
          line: null,
          label: {
            offset: -36,
            style: {
              fontSize: 8,
              textAlign: 'center',
              textBaseline: 'middle',
            },
          },
          subTickLine: {
            count: 4,
            length: -15,
          },
          tickLine: {
            length: -14,
          },
          grid: null,
        });
        view.point()
          .position('value*1')
          .shape('pointer')
          .color('#1890FF')
          .state({
            active: {
              style: {
                lineWidth: 3,
                stroke: '#fdd204',
                cursor: 'pointer'
              }
            }
          })
          .animate({
            appear: {
              animation: 'fade-in'
            }
          });
        // 绘制仪表盘背景
        view.annotation().arc({
          top: false,
          start: [0, 1],
          end: [max + 100, 1],
          style: {
            // 底灰色
            stroke: '#CBCBCB',
            lineWidth: 3,
            lineDash: null,
          },
        });
        // 绘制指标
        view.annotation().arc({
          start: [0, 1],
          end: [dv.rows[0].value, 1],
          style: {
            stroke: '#1890FF',
            lineWidth: 3,
            lineDash: null,
          },
        });
        // 绘制指标数字
        view.annotation().text({
          position: ['50%', '80%'],
          content: dv.rows[0].name,
          style: {
            fontSize: 14,
            fill: '#fff',
            textAlign: 'center',
            stroke: null
          },
        });
        view.annotation().text({
          position: ['50%', '5%'],
          content: `${dv.rows[0].value}`,
          style: {
            fontSize: 18,
            fill: '#fff',
            textAlign: 'center',
            stroke: null
          },
          offsetY: 10,
        });
        view.annotation().text({
          position: ['50%', '10%'],
          content: `培训人数`,
          style: {
            fontSize: 14,
            fill: '#fff',
            textAlign: 'center',
            stroke: null
          },
          offsetY: 25,
        });
        // view.interaction('element-single-selected');
        view.interaction('element-highlight');
        // view.interaction('element-active');
      }
    });

    // chart.interaction('active-region');
    // view.interaction('element-single-selected');
    // chart.interaction('element-highlight');
    // view.interaction('element-active');
    chart.render();
  }
}
