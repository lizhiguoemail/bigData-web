// 请参考：https://ng-alain.com/docs/i18n
import { registerLocaleData } from '@angular/common';
import ngEn from '@angular/common/locales/en';
import ngZh from '@angular/common/locales/zh';
import ngZhTw from '@angular/common/locales/zh-Hant';
import { Injectable } from '@angular/core';
import {
  AlainI18NService
} from './i18n';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

interface LangData {
  text: string;
  ng: any;
  abbr: string;
}

const DEFAULT = 'zh-CN';
const LANGS: { [key: string]: LangData } = {
  'zh-CN': {
    text: '简体中文',
    ng: ngZh,
    abbr: '🇨🇳',
  },
  'zh-TW': {
    text: '繁体中文',
    ng: ngZhTw,
    abbr: '🇭🇰',
  },
  'en-US': {
    text: 'English',
    ng: ngEn,
    abbr: '🇬🇧',
  },
};

@Injectable({ providedIn: 'root' })
export class I18NService implements AlainI18NService {
  private _default = DEFAULT;
  private change$ = new BehaviorSubject<string | null>(null);

  private _langs = Object.keys(LANGS).map((code) => {
    const item = LANGS[code];
    return { code, text: item.text, abbr: item.abbr };
  });

  constructor(
    private translate: TranslateService,
  ) {
    // `@ngx-translate/core` 预先知道支持哪些语言
    const lans = this._langs.map((item) => item.code);
    translate.addLangs(lans);

    const defaultLan = this.getDefaultLang();
    if (lans.includes(defaultLan)) {
      this._default = defaultLan;
    }

    this.updateLangData(this._default);
  }

  private getDefaultLang(): string | undefined {
    // if (this.settings.layout.lang) {
    //   return this.settings.layout.lang;
    // }
    return (navigator.languages ? navigator.languages[0] : null) || navigator.language;
  }

  private updateLangData(lang: string) {
    const item = LANGS[lang];
    registerLocaleData(item.ng);
  }

  get change(): Observable<string> {
    return this.change$.asObservable().pipe(filter((w) => w != null)) as Observable<string>;
  }

  use(lang: string): void {
    lang = lang || this.translate.getDefaultLang();
    if (this.currentLang === lang) {
      return;
    }
    this.updateLangData(lang);
    this.translate.use(lang).subscribe(() => this.change$.next(lang));
  }
  /** 获取语言列表 */
  getLangs() {
    return this._langs;
  }
  /** 翻译 */
  fanyi(key: string, interpolateParams?: {}) {
    return this.translate.instant(key, interpolateParams);
  }
  /** 默认语言 */
  get defaultLang() {
    return this._default;
  }
  /** 当前语言 */
  get currentLang() {
    return this.translate.currentLang || this.translate.getDefaultLang() || this._default;
  }
}
