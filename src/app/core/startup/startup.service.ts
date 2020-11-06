import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    private translate: TranslateService,
    private httpClient: HttpClient,
  ) {
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve) => {
      zip(this.httpClient.get(`assets/json/i18n/zh-CN.json`))
        .pipe(
          // 接收其他拦截器后产生的异常消息
          catchError((res) => {
            console.warn(`StartupService.load: Network request failed`, res);
            resolve(null);
            return [];
          }),
        )
        .subscribe(
          ([langData]) => {
            // setting language data
            // this.translate.setTranslation(this.i18n.defaultLang, langData);
            // this.translate.setDefaultLang(this.i18n.defaultLang);

            // 设置页面标题的后缀
            // this.titleService.default = '';
            // this.titleService.suffix = res.app.name;
          },
          () => {},
          () => {
            resolve(null);
          },
        );
    });
  }
}
