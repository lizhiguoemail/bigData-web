import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ChartWrapperBase } from './base/chart-wrapper-base';
import DataSet from '@antv/data-set';
import DataView from '@antv/data-set';
import { Chart } from '@antv/g2';
import { util } from '@utils';

/**
 * 山西省精准就业地图
 */
@Component({
  selector: 'app-shanxi-jobs-map',
  template: `
      <div class="shanxi-jobs-map-container">
        <div *ngIf="!loading" class="chart" id="shanxi-jobs-map-container"></div>
        <app-loader-chart *ngIf="loading"></app-loader-chart>
      </div>
    `,
  styles: [
    `
      .shanxi-jobs-map-container {
        margin: 0 auto;
      }
      .shanxi-jobs-map-container .chart {
          height: 10rem;
          // width: 6rem;
          margin: 0 auto;
      }
    `
  ]
})
export class ShanxiJobsMapComponent extends ChartWrapperBase implements OnInit {
  /**
   * 山西省代码
   */
  shanxiCode = '140000';
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
    if (this.autoLoad) {
      this.loadUrl();
    }
    setTimeout(() => {
      this.render(this.shanxiCode);
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
    const userData = [
      { name: '太原市', code: '140100', parent: '140000', value: 46.8 },
      { name: '大同市', code: '140200', parent: '140000', value: 46.3 },
      { name: '阳泉市', code: '140300', parent: '140000', value: 114.7 },
      { name: '长治市', code: '140400', parent: '140000', value: 78 },
      { name: '晋城市', code: '140500', parent: '140000', value: 68.4 },
      { name: '朔州市', code: '140600', parent: '140000', value: 67.2 },
      { name: '忻州市', code: '140700', parent: '140000', value: 98.3 },
      { name: '吕梁市', code: '140800', parent: '140000', value: 56.7 },
      { name: '晋中市', code: '140900', parent: '140000', value: 95.8 },
      { name: '临汾市', code: '141000', parent: '140000', value: 101.3 },
      { name: '运城市', code: '141100', parent: '140000', value: 94.8 }
    ];
    this.$get(`/assets/json/geo/${areaCode}.json`).then((mapData) => {
      const chart = new Chart({
        container: 'shanxi-jobs-map-container',
        autoFit: true,
        height: 900,
        padding: areaCode === this.shanxiCode ? [30, 70] : [30, 30],
      });
      chart.on('click', (ev) => {
        const target = ev.target;
        let code: string = this.shanxiCode;
        let parentCode: string = this.shanxiCode;
        if (target.cfg.type === 'text') {
          code = target.cfg.data.properties.adcode;
          parentCode = target.cfg.data.properties.parent.adcode.toString();
        } else if (target.cfg.type === 'path') {
          code = target.cfg.origin.data.code;
          parentCode = target.cfg.origin.data.parent.toString();
        } else {
          code = this.shanxiCode;
          parentCode = this.shanxiCode;
        }
        if (areaCode === this.shanxiCode && code === this.shanxiCode) {
          return;
        }
        if (chart && parentCode === this.shanxiCode) {
          chart.destroy();
          this.render(code);
        }
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
        position: 'bottom',
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
          fill: '#000088', // 地图颜色
          stroke: '#ffffff', // 界线颜色
          lineWidth: 1, // 线粗细
          fillOpacity: 1,
        });

      // const pointDv = ds.createView()
      //   .transform({
      //     type: 'geo.centroid',
      //     field: 'name', // 标注地名的字段
      //     geoDataView: shanxiMap, // 使用的geo数据来源，可以是DataView实例，也可以是DataView实例的name
      //     as: ['centroid_x', 'centroid_y'], // centroid_x是中心点的x坐标 centroid_y是中心点y坐标
      //   });
      // const pointView = chart.createView();
      // pointView.data(pointDv.rows);
      // pointView.point().position('centroid_x*centroid_y').shape('circle').color('#ffffff');

      const userDv = ds.createView()
        .source(userData)
        .transform({
          geoDataView: shanxiMap,
          field: 'name',
          type: 'geo.region',
          as: ['longitude', 'latitude']
        })
        .transform({
          type: 'map',
          callback: obj => {
            if(obj.value > 100){
              obj.trend = '人才更多';
            } else if(obj.value > 50){
              obj.trend = '人才中等';
            } else {
              obj.trend = '人才较少';
            }
            return obj;
          }
        });
      const userView = chart.createView();
      userView.data(userDv.rows);
      userView.scale({
        name: {
          alias: '城市',
        },
        trend: {
          alias: '数量',
        },
        // trend: {
        //   alias: '每100位女性对应的男性数量',
        // },
      });
      userView.polygon()
        .position('longitude*latitude')
        .color('trend', ['#F51D27', '#EA61D7', '#0A61D7'])
        .tooltip('name*trend')
        .style({
          stroke: '#b1b1b1', // 界线颜色
          lineWidth: 1, // 线粗细
          fillOpacity: 1,
          cursor: 'pointer'
        })
        .animate({
          leave: {
            animation: 'fade-out'
          },
          enter: {
            animation: 'fade-in'
          }
        });
      userView.interaction('element-highlight');
      chart.render();
    });
  }
}
