import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import { util } from '@utils';

/**
 * 加载动画
 */
@Component({
  selector: 'app-loader-chart',
  template: `
        <div class="chart-wrapper">
            <div class="chart-div">
                <div class="chart-loader"><div class="loader"></div></div>
            </div>
        </div>
    `,
  styles: [
    `
    `
  ]
})
export class LoaderChartComponent extends ChartWrapperBase implements OnInit {
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
    this.loading = false;
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
    setTimeout(()=>{
      this.render();
    }, 100);
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
  }
}
