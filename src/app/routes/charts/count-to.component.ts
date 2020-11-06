import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { CountUpOptions } from 'countup.js';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import { util } from '@utils';

/**
 * 显示数字
 */
@Component({
    selector: 'app-count-to-chart',
    template: `
        <h3 *ngIf="!loading" class="count-color" [countUp]="count" [options]="config">0</h3>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
    `,
    styles: [
        `
      .chart {
          height: 3rem;
      }
    `
    ]
})
export class CountToChartComponent extends ChartWrapperBase implements OnInit {
    /**
     * 加载状态
     */
    @Input() loading: boolean;
    /**
     * 选项设置
     */
    @Input() config: CountUpOptions;
    /**
     * 数字
     */
    @Input() count: number;
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
            this.render();
            this.loading = false;
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
    }
}
