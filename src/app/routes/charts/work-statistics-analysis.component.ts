import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart } from '@antv/g2';
import { util } from '@utils';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 就业统计分析
 */
@Component({
  selector: 'app-work-statistics-analysis-chart',
  template: `
      <div class="panel-header">
          <div>就业统计分析</div>
      </div>
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" id="work-statistics-analysis-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    `
    `
  ]
})
export class WorkStatisticsAnalysisChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
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
    // this.data = [{ "name": "阳泉市", "type": "其他生产制造及有关人员", "value1": 0, "value2": 3 }, { "name": "长治市", "type": "其他生产制造及有关人员", "value1": 0, "value2": 4 }, { "name": "晋城市", "type": "其他生产制造及有关人员", "value1": 0, "value2": 5 }, { "name": "朔州市", "type": "其他生产制造及有关人员", "value1": 0, "value2": 6 }, { "name": "晋中市", "type": "其他生产制造及有关人员", "value1": 0, "value2": 7 }, { "name": "运城市", "type": "其他生产制造及有关人员", "value1": 0, "value2": 8 }, { "name": "忻州市", "type": "其他生产制造及有关人员", "value1": 0, "value2": 9 }, { "name": "临汾市", "type": "其他生产制造及有关人员", "value1": 0, "value2": 10 }, { "name": "吕梁市", "type": "其他生产制造及有关人员", "value1": 0, "value2": 11 }, { "name": "吕梁市", "type": "党的机关、国家机关、群众团体和社会组织、企事业单位负责人", "value1": 0, "value2": 11 }, { "name": "太原市", "type": "其他采矿人员", "value1": 0, "value2": 1 }, { "name": "大同市", "type": "其他采矿人员", "value1": 0, "value2": 2 }, { "name": "阳泉市", "type": "其他采矿人员", "value1": 0, "value2": 3 }, { "name": "长治市", "type": "其他采矿人员", "value1": 0, "value2": 4 }, { "name": "晋城市", "type": "其他采矿人员", "value1": 0, "value2": 5 }, { "name": "朔州市", "type": "其他采矿人员", "value1": 0, "value2": 6 }, { "name": "晋中市", "type": "其他采矿人员", "value1": 0, "value2": 7 }, { "name": "运城市", "type": "其他采矿人员", "value1": 0, "value2": 8 }, { "name": "忻州市", "type": "其他采矿人员", "value1": 0, "value2": 9 }, { "name": "临汾市", "type": "其他采矿人员", "value1": 0, "value2": 10 }, { "name": "吕梁市", "type": "其他采矿人员", "value1": 0, "value2": 11 }, { "name": "太原市", "type": "其他生产制造及有关人员", "value1": 0, "value2": 1 }, { "name": "忻州市", "type": "其他社会生产和生活服务人员", "value1": 0, "value2": 9 }, { "name": "临汾市", "type": "其他社会生产和生活服务人员", "value1": 0, "value2": 10 }, { "name": "吕梁市", "type": "其他社会生产和生活服务人员", "value1": 0, "value2": 11 }, { "name": "太原市", "type": "党的机关、国家机关、群众团体和社会组织、企事业单位负责人", "value1": 0, "value2": 1 }, { "name": "大同市", "type": "党的机关、国家机关、群众团体和社会组织、企事业单位负责人", "value1": 0, "value2": 2 }, { "name": "阳泉市", "type": "党的机关、国家机关、群众团体和社会组织、企事业单位负责人", "value1": 0, "value2": 3 }, { "name": "长治市", "type": "党的机关、国家机关、群众团体和社会组织、企事业单位负责人", "value1": 0, "value2": 4 }, { "name": "晋城市", "type": "党的机关、国家机关、群众团体和社会组织、企事业单位负责人", "value1": 0, "value2": 5 }, { "name": "朔州市", "type": "党的机关、国家机关、群众团体和社会组织、企事业单位负责人", "value1": 0, "value2": 6 }, { "name": "晋中市", "type": "党的机关、国家机关、群众团体和社会组织、企事业单位负责人", "value1": 0, "value2": 7 }, { "name": "运城市", "type": "党的机关、国家机关、群众团体和社会组织、企事业单位负责人", "value1": 0, "value2": 8 }, { "name": "忻州市", "type": "党的机关、国家机关、群众团体和社会组织、企事业单位负责人", "value1": 0, "value2": 9 }, { "name": "临汾市", "type": "党的机关、国家机关、群众团体和社会组织、企事业单位负责人", "value1": 0, "value2": 10 }, { "name": "晋中市", "type": "专业技术人员", "value1": 0, "value2": 7 }, { "name": "运城市", "type": "专业技术人员", "value1": 0, "value2": 8 }, { "name": "忻州市", "type": "专业技术人员", "value1": 0, "value2": 9 }, { "name": "临汾市", "type": "专业技术人员", "value1": 1, "value2": 10 }, { "name": "吕梁市", "type": "专业技术人员", "value1": 0, "value2": 11 }, { "name": "太原市", "type": "其他社会生产和生活服务人员", "value1": 0, "value2": 1 }, { "name": "大同市", "type": "其他社会生产和生活服务人员", "value1": 0, "value2": 2 }, { "name": "阳泉市", "type": "其他社会生产和生活服务人员", "value1": 0, "value2": 3 }, { "name": "长治市", "type": "其他社会生产和生活服务人员", "value1": 0, "value2": 4 }, { "name": "晋城市", "type": "其他社会生产和生活服务人员", "value1": 0, "value2": 5 }, { "name": "朔州市", "type": "其他社会生产和生活服务人员", "value1": 0, "value2": 6 }, { "name": "晋中市", "type": "其他社会生产和生活服务人员", "value1": 0, "value2": 7 }, { "name": "运城市", "type": "其他社会生产和生活服务人员", "value1": 0, "value2": 8 }, { "name": "朔州市", "type": "其他办事人员", "value1": 0, "value2": 6 }, { "name": "晋中市", "type": "其他办事人员", "value1": 0, "value2": 7 }, { "name": "运城市", "type": "其他办事人员", "value1": 0, "value2": 8 }, { "name": "忻州市", "type": "其他办事人员", "value1": 0, "value2": 9 }, { "name": "临汾市", "type": "其他办事人员", "value1": 0, "value2": 10 }, { "name": "吕梁市", "type": "其他办事人员", "value1": 0, "value2": 11 }, { "name": "太原市", "type": "专业技术人员", "value1": 0, "value2": 1 }, { "name": "大同市", "type": "专业技术人员", "value1": 0, "value2": 2 }, { "name": "阳泉市", "type": "专业技术人员", "value1": 0, "value2": 3 }, { "name": "长治市", "type": "专业技术人员", "value1": 0, "value2": 4 }, { "name": "晋城市", "type": "专业技术人员", "value1": 0, "value2": 5 }, { "name": "朔州市", "type": "专业技术人员", "value1": 0, "value2": 6 }, { "name": "晋城市", "type": "其他专业技术人员", "value1": 0, "value2": 5 }, { "name": "朔州市", "type": "其他专业技术人员", "value1": 0, "value2": 6 }, { "name": "晋中市", "type": "其他专业技术人员", "value1": 0, "value2": 7 }, { "name": "运城市", "type": "其他专业技术人员", "value1": 0, "value2": 8 }, { "name": "忻州市", "type": "其他专业技术人员", "value1": 0, "value2": 9 }, { "name": "临汾市", "type": "其他专业技术人员", "value1": 0, "value2": 10 }, { "name": "吕梁市", "type": "其他专业技术人员", "value1": 0, "value2": 11 }, { "name": "太原市", "type": "其他办事人员", "value1": 0, "value2": 1 }, { "name": "大同市", "type": "其他办事人员", "value1": 0, "value2": 2 }, { "name": "阳泉市", "type": "其他办事人员", "value1": 0, "value2": 3 }, { "name": "长治市", "type": "其他办事人员", "value1": 0, "value2": 4 }, { "name": "晋城市", "type": "其他办事人员", "value1": 0, "value2": 5 }, { "name": "朔州市", "type": "生产制造及有关人员", "value1": 0, "value2": 6 }, { "name": "晋中市", "type": "生产制造及有关人员", "value1": 0, "value2": 7 }, { "name": "运城市", "type": "生产制造及有关人员", "value1": 0, "value2": 8 }, { "name": "忻州市", "type": "生产制造及有关人员", "value1": 0, "value2": 9 }, { "name": "临汾市", "type": "生产制造及有关人员", "value1": 0, "value2": 10 }, { "name": "吕梁市", "type": "生产制造及有关人员", "value1": 0, "value2": 11 }, { "name": "太原市", "type": "其他专业技术人员", "value1": 0, "value2": 1 }, { "name": "大同市", "type": "其他专业技术人员", "value1": 0, "value2": 2 }, { "name": "阳泉市", "type": "其他专业技术人员", "value1": 0, "value2": 3 }, { "name": "长治市", "type": "其他专业技术人员", "value1": 0, "value2": 4 }, { "name": "朔州市", "type": "不便分类的其他从业人员", "value1": 0, "value2": 6 }, { "name": "晋中市", "type": "不便分类的其他从业人员", "value1": 0, "value2": 7 }, { "name": "运城市", "type": "不便分类的其他从业人员", "value1": 0, "value2": 8 }, { "name": "忻州市", "type": "不便分类的其他从业人员", "value1": 0, "value2": 9 }, { "name": "临汾市", "type": "不便分类的其他从业人员", "value1": 0, "value2": 10 }, { "name": "吕梁市", "type": "不便分类的其他从业人员", "value1": 1, "value2": 11 }, { "name": "太原市", "type": "生产制造及有关人员", "value1": 0, "value2": 1 }, { "name": "大同市", "type": "生产制造及有关人员", "value1": 0, "value2": 2 }, { "name": "阳泉市", "type": "生产制造及有关人员", "value1": 0, "value2": 3 }, { "name": "长治市", "type": "生产制造及有关人员", "value1": 0, "value2": 4 }, { "name": "晋城市", "type": "生产制造及有关人员", "value1": 0, "value2": 5 }, { "name": "朔州市", "type": "军人", "value1": 0, "value2": 6 }, { "name": "晋中市", "type": "军人", "value1": 0, "value2": 7 }, { "name": "运城市", "type": "军人", "value1": 0, "value2": 8 }, { "name": "忻州市", "type": "军人", "value1": 0, "value2": 9 }, { "name": "临汾市", "type": "军人", "value1": 0, "value2": 10 }, { "name": "吕梁市", "type": "军人", "value1": 0, "value2": 11 }, { "name": "太原市", "type": "不便分类的其他从业人员", "value1": 0, "value2": 1 }, { "name": "大同市", "type": "不便分类的其他从业人员", "value1": 0, "value2": 2 }, { "name": "阳泉市", "type": "不便分类的其他从业人员", "value1": 0, "value2": 3 }, { "name": "长治市", "type": "不便分类的其他从业人员", "value1": 0, "value2": 4 }, { "name": "晋城市", "type": "不便分类的其他从业人员", "value1": 0, "value2": 5 }, { "name": "太原市", "type": "军人", "value1": 0, "value2": 1 }, { "name": "大同市", "type": "军人", "value1": 0, "value2": 2 }, { "name": "阳泉市", "type": "军人", "value1": 0, "value2": 3 }, { "name": "长治市", "type": "军人", "value1": 0, "value2": 4 }, { "name": "晋城市", "type": "军人", "value1": 0, "value2": 5 }];
    const colorMap = {
      '太原市': '#1d63f5',
      '大同市': '#34d1d2',
      '阳泉市': '#ff9400',
      '长治市': '#f46526',
      '晋城市': '#c33a36',
      '朔州市': '#d58368',
      '忻州市': '#739f83',
      '吕梁市': '#bda29b',
      '晋中市': '#90c6ae',
      '临汾市': '#2f4553',
      '运城市': '#546570'
    };
    const chart = new Chart({
      container: 'work-statistics-analysis-container',
      autoFit: true,
      padding: [50, 20, 30, 60] // 上、右、下、左
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
    //         areaUrl: `api/ldl_v/analysis/statistics/tree`,
    //         userUrl: `ldl_v/analysis/statistics/user`
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
      itemSpacing: 5,
      flipPage: false,
      custom: true,
      maxWidth: 500,
      items: [
        { id: '1', name: '太原市', value: '太原市', marker: { spacing: 2, style: { fill: '#1d63f5' } } },
        { id: '2', name: '大同市', value: '大同市', marker: { spacing: 2, style: { fill: '#34d1d2' } } },
        { id: '3', name: '阳泉市', value: '阳泉市', marker: { spacing: 2, style: { fill: '#ff9400' } } },
        { id: '4', name: '长治市', value: '长治市', marker: { spacing: 2, style: { fill: '#f46526' } } },
        { id: '5', name: '晋城市', value: '晋城市', marker: { spacing: 2, style: { fill: '#c33a36' } } },
        { id: '6', name: '朔州市', value: '朔州市', marker: { spacing: 2, style: { fill: '#d58368' } } },
        { id: '7', name: '忻州市', value: '忻州市', marker: { spacing: 2, style: { fill: '#739f83' } } },
        { id: '8', name: '吕梁市', value: '吕梁市', marker: { spacing: 2, style: { fill: '#bda29b' } } },
        { id: '9', name: '晋中市', value: '晋中市', marker: { spacing: 2, style: { fill: '#90c6ae' } } },
        { id: '10', name: '临汾市', value: '临汾市', marker: { spacing: 2, style: { fill: '#2f4553' } } },
        { id: '11', name: '运城市', value: '运城市', marker: { spacing: 2, style: { fill: '#546570' } } },
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
    chart.line()
      .position('type*value1')
      .color('name', val => {
        return colorMap[val];
      })
      .shape('smooth');
    chart.point()
      .position('type*value1')
      .color('name', val => {
        return colorMap[val];
      })
      .size(4)
      .shape('circle')
      .style({
        stroke: '#fff',
        lineWidth: 1,
        cursor: 'pointer'
      });

    chart.interaction('active-region');
    // view.interaction('element-single-selected');
    // chart.interaction('element-highlight');
    // view.interaction('element-active');
    chart.render();
  }
}
