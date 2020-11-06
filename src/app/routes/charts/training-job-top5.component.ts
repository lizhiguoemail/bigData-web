import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart } from '@antv/g2';
import { util } from '@utils';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 培训前五工种
 */
@Component({
  selector: 'app-training-job-top5-chart',
  template: `
      <div class="panel-header">
          <div>培训前五工种</div>
      </div>
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" id="training-job-top5-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    ``
  ]
})
export class TrainingJobTop5ChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
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
    //   { "name": "中式面点师", "type": "2019", "value": 1 },
    //   { "name": "中式烹调师（准）", "type": "2018", "value": 4 },
    //   { "name": "育婴员", "type": "2018", "value": 1 },
    //   { "name": "家畜饲养", "type": "2018", "value": 1 },
    //   { "name": "中式面点师", "type": "2018", "value": 1 },
    //   { "name": "保育员", "type": "2018", "value": 1 }
    // ];
    const chart = new Chart({
      container: 'training-job-top5-container',
      autoFit: true,
      padding: 8 // 上、右、下、左
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
    //         areaUrl: `api/ldl_v/analysis/five/tree`,
    //         userUrl: `ldl_v/analysis/five/user`
    //       },
    //       width: '600px'
    //     })
    //   }
    // });
    chart.data(this.data);
    chart.scale({
      percent: {
        formatter: (val) => {
          val = (val * 100).toFixed(1) + '%';
          return val;
        },
      },
    });
    chart.legend('name', {
      position: 'top',
      itemSpacing: 8,
      itemName: {
        style: {
          fill: '#ffffff'
        }
      }
    });
    chart.tooltip({
      showCrosshairs: false, // 展示 Tooltip 辅助线
      showTitle: false,
      showMarkers: false,
    });
    chart.facet('rect', {
      fields: ['type'],
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
        view.coordinate('theta', {
          radius: 0.6,
          // innerRadius: 0.6
        });
        view.tooltip({ title: 'type*name' });
        view.legend(false);
        // 辅助文本
        view.annotation()
          .text({
            position: ['50%', '99%'],
            content: dv.rows[0].type,
            style: {
              fontSize: 12,
              textAlign: 'center',
              fill: '#ffffff',
              stroke: null
            },
            offsetY: -5,
          });
        // view.legend('name', {
        //   position: 'right',
        // });
        view.interval()
          .adjust('stack')
          .position('percent')
          .color('name')
          .style({
            cursor: 'pointer'
          })
          .label('percent', (percent) => {
            return {
              content: (data) => {
                percent = (percent * 100).toFixed(1) + '%';
                // return `${data.name}: ${percent}`;
                // return `${data.name}`;
                return `${percent}`;
              },
            };
          }, {
            style: {
              fill: '#fff',
              textAlign: 'center',
            }
          })
          .style({
            opacity: 1,
          });

        // view.interaction('element-single-selected');
        view.interaction('element-highlight', {
          showEnable: [
            { trigger: 'interval:mouseenter', action: 'cursor:pointer' },
            { trigger: 'interval:mouseleave', action: 'cursor:default' },
          ],
        });
        // view.interaction('element-active');
      }
    });
    chart.render();
  }
}
