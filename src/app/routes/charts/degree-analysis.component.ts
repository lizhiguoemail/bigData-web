import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart } from '@antv/g2';
import { SelectItem, util } from '@utils';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 学历分析
 */
@Component({
  selector: 'app-degree-analysis-chart',
  template: `
      <div class="panel-header">
          <div class="panel-header-line">学历分析</div>
          <app-common-area width="92px" margin="15px 0 0 28px"  placeholder="请选择" [(model)]="areaCode" [dataSource]="areaData" (modelChange)="onRegionChange($event)"></app-common-area>
      </div>
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" #chartContainer id="degree-analysis-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    ``
  ]
})
export class DegreeAnalysisChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
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
   * 切换地区事件
   */
  @Output() onMapChange = new EventEmitter<void>();
  /**
   * 图表元素
   */
  @ViewChild('chartContainer', { static: true }) chartContainer: HTMLElement;
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
   * 区域更改
   * @param e 参数
   */
  onRegionChange(e) {
    this.areaCode = e;
    this.loadUrl({
      param: { code: e },
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
    //   { "name": "大专", "type": "农村劳动力", "value": 1 },
    //   { "name": "初中", "type": "农村劳动力", "value": 7 },
    //   { "name": "高中", "type": "农村劳动力", "value": 7 },
    //   { "name": "", "type": "城镇劳动力", "value": 0 },
    //   { "name": "高中", "type": "贫困劳动力", "value": 3 },
    //   { "name": "初中", "type": "贫困劳动力", "value": 4 },
    //   { "name": "", "type": "2020年高校毕业生", "value": 0 }
    // ];
    const colorMap = {
      '小学': '#ff8000',
      '初中': '#46a3ff',
      '高中': '#5e7e54',
      '中专': '#fdd204',
      '大专': '#e44f2f',
      '本科': '#81b6b2',
      '硕士': '#eba422',
      '博士': '#9f4d95',
      '其他': 'skyblue',
    };
    const chart = new Chart({
      container: 'degree-analysis-container',
      autoFit: true,
      padding: [8, 15, 15, 15] // 上、右、下、左
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
            areaUrl: `api/ldl_v/analysis/education/tree`,
            userUrl: `ldl_v/analysis/education/user`
          },
          width: '600px'
        })
      }
    });
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
      flipPage: false,
      custom: true,
      items: [
        { id: '1', name: '博士', value: '博士研究生', marker: { spacing: 2, style: { fill: '#9f4d95' } } },
        { id: '2', name: '硕士', value: '硕士研究生', marker: { spacing: 2, style: { fill: '#eba422' } } },
        { id: '3', name: '本科', value: '大学本科生', marker: { spacing: 2, style: { fill: '#81b6b2' } } },
        { id: '4', name: '大专', value: '大专生', marker: { spacing: 2, style: { fill: '#e44f2f' } } },
        { id: '5', name: '中专', value: '中专中技', marker: { spacing: 2, style: { fill: '#fdd204' } } },
        { id: '6', name: '高中', value: '高中', marker: { spacing: 2, style: { fill: '#5e7e54' } } },
        { id: '7', name: '初中', value: '初中', marker: { spacing: 2, style: { fill: '#46a3ff' } } },
        { id: '8', name: '小学', value: '小学', marker: { spacing: 2, style: { fill: '#ff8000' } } },
        { id: '9', name: '其他', value: '其他', marker: { spacing: 2, style: { fill: 'skyblue' } } }
      ],
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
          innerRadius: 0.6
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
        view.interval()
          .adjust('stack')
          .style({
            cursor: 'pointer'
          })
          .position('percent')
          .color('name', (name) => {
            return colorMap[name];
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
        view.interaction('element-highlight-by-color', {
          showEnable: [
            { trigger: 'interval:mouseenter', action: 'cursor:pointer' },
            { trigger: 'interval:mouseleave', action: 'cursor:default' },
          ],
        });
      }
    });
    chart.render();
  }
}
