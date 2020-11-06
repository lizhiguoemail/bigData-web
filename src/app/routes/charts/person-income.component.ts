import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart, registerShape } from '@antv/g2';
import { SelectItem, util } from '@utils';
import { AreaAnalysisDialogComponent } from '../dialog/area-analysis-dialog.component';

/**
 * 个人年收入
 */
@Component({
  selector: 'app-person-income-chart',
  template: `
      <div class="chart-container">
        <div *ngIf="!loading" class="chart" id="person-income-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    ``
  ]
})
export class PersonIncomeChartComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
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
    this.loadData();
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
    // this.data = [{ name: '1万-2万', value: 5 }];
    this.data.value = this.data.value == 9 ? 0.5 : this.data.value + 0.5;
    this.data = [{ name: this.data.name, value: this.data.value }];
    const colorMap = {
      '0-3千元': '#1a8ffc',
      '3千-5千元': '#ff6db4',
      '5千-8千元': '#f55f5f',
      '8千-1万元': '#7798be',
      '1万-2万元': '#a92e2e',
      '2万-5万元': '#ff1d69',
      '5万-10万元': '#efabed',
      '10万元以上': '#53be42',
      '无收入': '#e0e0e0'
    };
    const chart = new Chart({
      container: 'person-income-container',
      autoFit: true,
      padding: [5, 0, 5, 0], // 上、右、下、左
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
    //         areaUrl: `api/ldl_v/analysis/income/tree`,
    //         userUrl: `ldl_v/analysis/income/user`
    //       },
    //       width: '600px'
    //     })
    //   }
    // });

    // 自定义Shape 部分
    registerShape('point', 'pointer', {
      draw(cfg, container) {
        const group = container.addGroup({});
        // 获取极坐标系下画布中心点
        const center = this.parsePoint({ x: 0, y: 0 });
        // 绘制指针
        group.addShape('line', {
          attrs: {
            x1: center.x,
            y1: center.y,
            x2: cfg.x,
            y2: cfg.y,
            stroke: cfg.color,
            lineWidth: 4.5,
            lineCap: 'round',
          },
        });
        group.addShape('circle', {
          attrs: {
            x: center.x,
            y: center.y,
            r: 6.75,
            stroke: cfg.color,
            lineWidth: 4.5,
            fill: '#fff',
          },
        });

        return group;
      },
    });
    chart.data(this.data);

    chart.coordinate('polar', {
      startAngle: (-9 / 8) * Math.PI,
      endAngle: (1 / 8) * Math.PI,
      radius: 0.95,
    });
    chart.scale('value', {
      min: 0,
      max: 9,
      ticks: [0.40, 1.60, 2.55, 3.55, 4.50, 5.45, 6.45, 7.45, 8.60],
    });

    chart.axis('value', false);
    chart.axis('value', {
      line: null,
      label: {
        offset: -30,
        formatter: (val) => {
          if (val === '0.4') {
            return '无收入';
          } else if (val === '1.6') {
            return '0~3千';
          } else if (val === '2.55') {
            return '3~5千';
          } else if (val === '3.55') {
            return '5~8千';
          } else if (val === '4.5') {
            return '8~1万';
          } else if (val === '5.45') {
            return '1~2万';
          } else if (val === '6.45') {
            return '2~5万';
          } else if (val === '7.45') {
            return '5~10万';
          } else if (val === '8.6') {
            return '10万以上';
          }

          return '无收入';
        },
        style: {
          fontSize: 12,
          textAlign: 'center',
        },
      },
      tickLine: null,
      grid: null,
    });
    chart.legend(false);
    chart
      .point()
      .position('value*1')
      .shape('pointer')
      .color('#1890FF');

    // 绘制仪表盘刻度线
    chart.annotation().line({
      start: [0, 0.905],
      end: [0, 0.85],
      style: {
        stroke: '#19AFFA', // 线的颜色
        lineDash: null, // 虚线的设置
        lineWidth: 3,
      },
    });
    chart.annotation().line({
      start: [1, 0.905],
      end: [1, 0.85],
      style: {
        stroke: '#19AFFA', // 线的颜色
        lineDash: null, // 虚线的设置
        lineWidth: 3,
      },
    });
    chart.annotation().line({
      start: [2, 0.905],
      end: [2, 0.85],
      style: {
        stroke: '#19AFFA', // 线的颜色
        lineDash: null, // 虚线的设置
        lineWidth: 3,
      },
    });
    chart.annotation().line({
      start: [3, 0.905],
      end: [3, 0.85],
      style: {
        stroke: '#19AFFA', // 线的颜色
        lineDash: null, // 虚线的设置
        lineWidth: 3,
      },
    });
    chart.annotation().line({
      start: [4, 0.905],
      end: [4, 0.85],
      style: {
        stroke: '#19AFFA', // 线的颜色
        lineDash: null, // 虚线的设置
        lineWidth: 3,
      },
    });
    chart.annotation().line({
      start: [5, 0.905],
      end: [5, 0.85],
      style: {
        stroke: '#19AFFA', // 线的颜色
        lineDash: null, // 虚线的设置
        lineWidth: 3,
      },
    });
    chart.annotation().line({
      start: [6, 0.905],
      end: [6, 0.85],
      style: {
        stroke: '#19AFFA', // 线的颜色
        lineDash: null, // 虚线的设置
        lineWidth: 3,
      },
    });
    chart.annotation().line({
      start: [7, 0.905],
      end: [7, 0.85],
      style: {
        stroke: '#19AFFA', // 线的颜色
        lineDash: null, // 虚线的设置
        lineWidth: 3,
      },
    });
    chart.annotation().line({
      start: [8, 0.905],
      end: [8, 0.85],
      style: {
        stroke: '#19AFFA', // 线的颜色
        lineDash: null, // 虚线的设置
        lineWidth: 3,
      },
    });
    chart.annotation().line({
      start: [9, 0.905],
      end: [9, 0.85],
      style: {
        stroke: '#19AFFA', // 线的颜色
        lineDash: null, // 虚线的设置
        lineWidth: 3,
      },
    });

    // 绘制仪表盘背景
    chart.annotation().arc({
      top: false,
      start: [0, 1],
      end: [9, 1],
      style: {
        stroke: '#CBCBCB',
        lineWidth: 5,
        lineDash: null,
      },
    });

    // 绘制指标
    chart.annotation().arc({
      start: [0, 1],
      end: [this.data[0].value, 1],
      style: {
        stroke: '#1890FF',
        lineWidth: 5,
        lineDash: null,
      },
    });
    // 绘制指标数字
    chart.annotation().text({
      position: ['50%', '85%'],
      offsetY: 20,
      content: this.data[0].name,
      style: {
        fontSize: 20,
        fill: '#fff',
        textAlign: 'center',
        stroke: null
      },
    });
    // chart.annotation().text({
    //   position: ['50%', '90%'],
    //   content: `${this.data[0].value * 10} %`,
    //   style: {
    //     fontSize: 12,
    //     fill: '#545454',
    //     textAlign: 'center',
    //     stroke: null
    //   },
    //   offsetY: 15,
    // });

    chart.render();
  }
}
