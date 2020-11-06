import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart } from '@antv/g2';
import { util } from '@utils';

/**
 * 人才分布
 */
@Component({
  selector: 'app-distribution-chart',
  template: `
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" id="distribution-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    ``
  ]
})
export class DistributionChartComponent extends ChartWrapperBase implements OnInit {
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
    this.autoLoad = true;
    this.loading = true;
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
    this.loadData();
    if (this.autoLoad) {
      this.loadUrl();
    }
    setTimeout(() => {
      this.loading = false;
      setTimeout(() => {
        this.render();
      }, 100);
    }, 500);
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
        this.loadData();
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
    const data = [
      { type: '在职', name: '教授', value: 246 },
      { type: '在职', name: '博士', value: 673 },
      { type: '在职', name: '硕士', value: 905 },
      { type: '离职', name: '教授', value: 141 },
      { type: '离职', name: '博士', value: 567 },
      { type: '离职', name: '硕士', value: 110 },
      { type: '退休', name: '教授', value: 20 },
      { type: '退休', name: '博士', value: 50 },
      { type: '退休', name: '硕士', value: 123 },
    ];
    const chart = new Chart({
      container: 'distribution-container',
      autoFit: true,
      height: 500
    });
    chart.data(data);
    chart.scale({
      percent: {
        formatter: (val) => {
          val = (val * 100).toFixed(2) + '%';
          return val;
        },
      },
    });
    chart.legend('name', {
      position: 'bottom',
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
      padding: 5,
      showTitle: false,
      eachView: (view, facet) => {
        const ds1 = new DataSet();
        const dv1 = ds1.createView();
        dv1.source(facet.data).transform({
          type: 'percent',
          field: 'value',
          dimension: 'name',
          as: 'percent',
        });
        view.data(dv1.rows);
        view.coordinate('theta', {
          radius: 0.7,
          innerRadius: 0.7
        });
        // 辅助文本
        view.annotation()
          .text({
            position: ['50%', '50%'],
            content: dv1.rows[0].type,
            style: {
              fontSize: 12,
              textAlign: 'center',
            },
            offsetY: -10,
          })
          .text({
            position: ['50%', '50%'],
            content: '200',
            style: {
              fontSize: 12,
              textAlign: 'center',
            },
            offsetY: 10,
          });
        view.interval()
          .adjust('stack')
          .position('percent')
          .color('name')
          .label('percent', (percent) => {
            return {
              content: (data) => {
                percent = (percent * 100).toFixed(2) + '%';
                // return `${data.name}: ${percent}`;
                return `${data.name}`;
              },
            };
          }, {
            style: {
              fill: '#fff'
            }
          })
          .style({
            opacity: 1,
          });

        view.interaction('element-active');
      }
    });
    chart.render();
  }
}
