import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart, registerShape, Util } from '@antv/g2';

import { util } from '@utils';

/**
 * 云热词
 */
@Component({
    selector: 'app-word-cloud-chart',
    template: `
      <div class="word-cloud-container">
        <div *ngIf="!loading" class="chart" id="word-cloud-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
    styles: [
        `
      .word-cloud-container .chart {
          height: 3rem;
      }
    `
    ]
})
export class WordCloudChartComponent extends ChartWrapperBase implements OnInit {
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
    getTextAttrs(cfg) {
        return {
            ...cfg.style,
            fontSize: cfg.data.size,
            text: cfg.data.text,
            textAlign: 'center',
            fontFamily: cfg.data.font,
            fill: cfg.color,
            textBaseline: 'Alphabetic'
        };
    }
    /**
     * 组件初始化
     */
    ngOnInit() {
        const me = this;
        this.loadData();
        // 给 point 注册一个词云的 shape
        registerShape('point', 'cloud', {
            draw(cfg, container) {
                const attrs = me.getTextAttrs(cfg);
                const textShape = container.addShape('text', {
                    attrs: {
                        ...attrs,
                        x: cfg.x,
                        y: cfg.y
                    }
                });
                const data = cfg.data as any;
                if (data.rotate) {
                    Util.rotate(textShape, data.rotate * Math.PI / 180);
                }
                return textShape;
            }
        });
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
        $.getJSON('/assets/json/data/keywords.json').then((data) => {
            const dv = new DataSet.View().source(data);
            const range = dv.range('value');
            const min = range[0];
            const max = range[1];
            // const imageMask = new Image();
            // imageMask.crossOrigin = '';
            // imageMask.src = '/assets/img/G2.png';
            // imageMask.onload = () => {
            dv.transform({
                type: 'tag-cloud',
                fields: ['name', 'value'],
                // imageMask,
                font: () => 'Verdana',
                size: [300, 280], // 宽高设置最好根据 imageMask 做调整
                padding: 0,
                timeInterval: 5000, // max execute time
                rotate() {
                    let random = ~~(Math.random() * 4) % 4;
                    if (random === 2) {
                        random = 0;
                    }
                    return random * 90; // 0, 90, 270
                },
                fontSize(d: any) {
                    return ((d.value - min) / (max - min)) * (32 - 8) + 8;
                },
            });
            const chart = new Chart({
                container: 'word-cloud-container',
                autoFit: true,
                width: 300, // 宽高设置最好根据 imageMask 做调整
                height: 280,
                padding: 0
            });
            chart.data(dv.rows);
            chart.scale({
                x: { nice: false },
                y: { nice: false }
            });
            chart.legend(false);
            chart.axis(false);
            chart.tooltip({
                showTitle: false,
                showMarkers: false
            });
            chart.coordinate().reflect('y');
            chart.point()
                .position('x*y')
                .color('text')
                .shape('cloud')
                .state({
                    active: {
                        style: {
                            fillOpacity: 0.4
                        }
                    }
                });
            chart.interaction('element-active');
            chart.render();
            // }
        });
    }
}
