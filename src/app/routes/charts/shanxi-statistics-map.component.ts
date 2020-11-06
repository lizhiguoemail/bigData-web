import { AfterContentInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart } from '@antv/g2';
import { util } from '@utils';
import { ok } from 'assert';

/**
 * 山西省监测与统计地图
 */
@Component({
  selector: 'app-shanxi-statistics-map',
  template: `
      <div class="shanxi-statistics-map-container">
          <div *ngIf="!loading" class="chart" id="shanxi-statistics-map-container"></div>
          <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    `
      .shanxi-statistics-map-container {
        height: 100%;
        margin: 0 auto;
      }
      .shanxi-statistics-map-container .chart {
          height: 100%;
          width: 100%;
          margin: 0 auto;
      }
    `
  ]
})
export class ShanxiStatisticsMapComponent extends ChartWrapperBase implements OnInit, AfterContentInit {
  /**
   * 山西省代码
   */
  shanxiCode = '140000';
  /**
   * 上一个代码
   */
  prevCode: string;
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
   * 切换地区事件
   */
  @Output() onMapChange = new EventEmitter<string>();
  /**
   * 初始化下拉列表包装器
   */
  constructor() {
    super();
    this.autoLoad = true;
    this.loading = true;
    this.url = `api/ldl_v/analysis/health`;
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
   * 页面内容初始化后
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
      this.render(this.shanxiCode);
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
  $get(url) {
    return new Promise((resolve, rejected) => {
      $.getJSON(url, res => {
        resolve(res)
      })
    })
  }
  /**
   * 渲染图表
   */
  render(areaCode) {
    // if(areaCode == '140000') {
    //   this.data = [
    //     { name: '太原市', code: '140100', parent: '140000', value: 400000 },
    //     { name: '大同市', code: '140200', parent: '140000', value: 500000 },
    //     { name: '阳泉市', code: '140300', parent: '140000', value: 900000 },
    //     { name: '长治市', code: '140400', parent: '140000', value: 1500000 },
    //     { name: '晋城市', code: '140500', parent: '140000', value: 2100000 },
    //     { name: '朔州市', code: '140600', parent: '140000', value: 2700000 },
    //     { name: '忻州市', code: '140700', parent: '140000', value: 454343 },
    //     { name: '吕梁市', code: '140800', parent: '140000', value: 5689785 },
    //     { name: '晋中市', code: '140900', parent: '140000', value: 95 },
    //     { name: '临汾市', code: '141000', parent: '140000', value: 101 },
    //     { name: '运城市', code: '141100', parent: '140000', value: 0 }
    //   ];
    // }
    // if(areaCode == '140200') {
    //   this.data = [
    //     { name: '平城区', code: '140213', parent: '140200', value: 55463 },
    //     { name: '云冈区', code: '140214', parent: '140200', value: 45663 },
    //     { name: '新荣区', code: '140212', parent: '140200', value: 23423 },
    //     { name: '云州区', code: '140215', parent: '140200', value: 2342 },
    //     { name: '阳高县', code: '140221', parent: '140200', value: 23442 },
    //     { name: '天镇县', code: '140222', parent: '140200', value: 1231 },
    //     { name: '广灵县', code: '140223', parent: '140200', value: 3213 },
    //     { name: '灵丘县', code: '140224', parent: '140200', value: 23444 },
    //     { name: '浑源县', code: '140225', parent: '140200', value: 23442 },
    //     { name: '左云县', code: '140226', parent: '140200', value: 23465 },
    //   ];
    // }
    const colorMap = {
      '0': '#2e7ac4',
      '1-400000': '#0050b0',
      '400000-800000': '#4060c6',
      '800000-1400000': '#2548b7',
      '1400000-2000000': '#1133a1',
      '2000000-2600000': '#092889',
      '≥2600000': '#03185a',
    };
    this.$get(`/assets/json/geo/${areaCode}.json`).then((mapData) => {
      const chart = new Chart({
        container: 'shanxi-statistics-map-container',
        autoFit: true,
        padding: areaCode === this.shanxiCode ? [30, 40, 30, 40] : [30, 50, 30, 50], // 上、右、下、左
      });
      chart.on('plot:click', (ev) => {
        let code: string = this.shanxiCode;
        let parentCode: string = this.shanxiCode;
        this.prevCode = this.shanxiCode;
        if(ev.data){
          const data = ev.data.data;
          code = data.code;
          parentCode = data.parent;
          this.prevCode = parentCode;
        } else {
          code = this.prevCode.substring(0,4) + '00';
        }
        if(parentCode != this.shanxiCode) return;
        const tmpcode = code == '140000' ? '14' : code.substring(0,4);
        this.onMapChange.emit(tmpcode);
      });
      chart.tooltip({
        showCrosshairs: false, // 展示 Tooltip 辅助线
        showTitle: false,
        showMarkers: false,
        shared: true,
      });
      // 同步度量
      chart.scale({
        longitude: { sync: true },
        latitude: { sync: true }
      });
      chart.axis(false);
      chart.legend('trend', {
        position: 'right-bottom',
        itemSpacing: 8,
        flipPage: false,
        custom: true,
        offsetY: 0,
        items: [
          { id: '1', name: '0', value: '0', marker: { spacing: 2, symbol: 'square', style: { fill: '#2e7ac4' } } },
          { id: '2', name: '1-400000', value: '1-400000', marker: { spacing: 2, symbol: 'square', style: { fill: '#0050b0' } } },
          { id: '3', name: '400000-800000', value: '400000-800000', marker: { spacing: 2, symbol: 'square', style: { fill: '#4060c6' } } },
          { id: '4', name: '800000-1400000', value: '800000-1400000', marker: { spacing: 2, symbol: 'square', style: { fill: '#2548b7' } } },
          { id: '5', name: '1400000-2000000', value: '1400000-2000000', marker: { spacing: 2, symbol: 'square', style: { fill: '#1133a1' } } },
          { id: '6', name: '2000000-2600000', value: '2000000-2600000', marker: { spacing: 2, symbol: 'square', style: { fill: '#092889' } } },
          { id: '7', name: '≥2600000', value: '≥2600000', marker: { spacing: 2, symbol: 'square', style: { fill: '#03185a' } } },
        ],
        itemName: {
          style: {
            fill: '#ffffff'
          }
        }
      });
      // 绘制世界地图背景
      const ds = new DataSet();
      const shanxiMap = ds.createView('shanxiMap')
        .source(mapData, {
          type: 'GeoJSON'
        });
      const shanxiMapView = chart.createView();
      shanxiMapView.data(shanxiMap.rows);
      shanxiMapView.tooltip(false);
      shanxiMapView.polygon()
        .position({
          fields: ['longitude', 'latitude']
        })
        .label('name', {
          offset: -5
        })
        .style({
          fill: '#2e7ac4', // 地图颜色
          stroke: '#176aef', // 界线颜色
          lineWidth: 1.5, // 线粗细
          fillOpacity: 1,
          shadowColor: '#0050ae',
          shadowOffsetX: 6,
          shadowOffsetY: 8
        });
      let totalValue = this.data.reduce((totalValue, currentValue) => {
        return totalValue + currentValue.value;
      }, 0);
      const userDv = ds.createView()
        .source(this.data)
        .transform({
          geoDataView: shanxiMap,
          field: 'name',
          type: 'geo.region',
          as: ['longitude', 'latitude']
        })
        .transform({
          type: 'map',
          callback: obj => {
            obj.ratio = ((obj.value / (totalValue == 0 ? 1 : totalValue)) * 100).toFixed(2) + '%';
            if (obj.value == 0) {
              obj.trend = '0';
            } else if (obj.value >= 1 && obj.value < 400000) {
              obj.trend = '1-400000';
            } else if (obj.value >= 400000 && obj.value < 800000) {
              obj.trend = '400000-800000';
            } else if (obj.value >= 800000 && obj.value < 1400000) {
              obj.trend = '800000-1400000';
            } else if (obj.value >= 1400000 && obj.value < 2000000) {
              obj.trend = '1400000-2000000';
            } else if (obj.value >= 2000000 && obj.value < 2600000) {
              obj.trend = '2000000-2600000';
            } else if (obj.value >= 2600000) {
              obj.trend = '≥2600000';
            }
            return obj;
          }
        });
      const view = chart.createView();
      view.data(userDv.rows);
      view.scale({
        name: {
          alias: '城市',
        },
        value: {
          alias: '入库数',
        },
        ratio: {
          alias: '入库比例',
        },
      });
      view.polygon()
        .position('longitude*latitude')
        .color('trend', val => {
          return colorMap[val];
        })
        .tooltip('name*value*ratio')
        .style({
          stroke: '#419bf2', // 界线颜色
          lineWidth: 1.5, // 线粗细
          fillOpacity: 1,
          cursor: 'pointer',
        })
        .state({
          active: {
            style: {
              lineWidth: 2,
              stroke: '#fdd204'
            }
          }
        })
        .animate({
          leave: {
            animation: 'fade-out'
          },
          enter: {
            animation: 'fade-in'
          }
        });
        view.interaction('element-active');
        // view.interaction('element-highlight');
      chart.render();
    });
  }
}
