import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Injector, OnDestroy, Optional } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AlainI18NService, ALAIN_I18N_TOKEN } from '../i18n/i18n';

@Injectable({ providedIn: 'root' })
export class TitleService implements OnDestroy {
  private _prefix = '';
  private _suffix = '';
  private _separator = ' - ';
  private _reverse = false;
  private i18n$: Subscription;

  readonly DELAY_TIME = 25;

  constructor(
    private injector: Injector,
    private title: Title,
    @Optional()
    @Inject(ALAIN_I18N_TOKEN)
    private i18nSrv: AlainI18NService,
    @Inject(DOCUMENT) private doc: any,
  ) {
    this.i18n$ = this.i18nSrv.change.pipe(filter(() => !!this.i18n$)).subscribe(() => this.setTitle());
  }

  /** 设置分隔符 */
  set separator(value: string) {
    this._separator = value;
  }

  /** 设置前缀 */
  set prefix(value: string) {
    this._prefix = value;
  }

  /** 设置后缀 */
  set suffix(value: string) {
    this._suffix = value;
  }

  /** 设置是否反转 */
  set reverse(value: boolean) {
    this._reverse = value;
  }

  /** 设置默认标题名 */
  default = `Not Page Name`;

  private getByElement(): string {
    const el = (this.doc.querySelector('.alain-default__content-title h1') || this.doc.querySelector('.page-header__title')) as HTMLElement;
    if (el) {
      let text = '';
      el.childNodes.forEach(val => {
        if (!text && val.nodeType === 3) {
          text = val.textContent!.trim();
        }
      });
      return text || el.firstChild!.textContent!.trim();
    }
    return '';
  }

  private getByRoute(): string {
    let next = this.injector.get(ActivatedRoute);
    while (next.firstChild) { next = next.firstChild; }
    const data = (next.snapshot && next.snapshot.data) || {};
    if (data.titleI18n && this.i18nSrv) { data.title = this.i18nSrv.fanyi(data.titleI18n); }
    return data.title;
  }

  private _setTitle(title?: string | string[]) {
    if (!title) {
      title = this.getByRoute() || this.getByElement() || this.default;
    }
    if (title && !Array.isArray(title)) {
      title = [title];
    }

    let newTitles: string[] = [];
    if (this._prefix) {
      newTitles.push(this._prefix);
    }
    newTitles.push(...(title as string[]));
    if (this._suffix) {
      newTitles.push(this._suffix);
    }
    if (this._reverse) {
      newTitles = newTitles.reverse();
    }
    this.title.setTitle(newTitles.join(this._separator));
  }

  /**
   * Set the document title, will be delay `25ms`, pls refer to [#1261](https://github.com/ng-alain/ng-alain/issues/1261)
   */
  setTitle(title?: string | string[]) {
    setTimeout(() => this._setTitle(title), this.DELAY_TIME);
  }

  /**
   * Set i18n key of the document title
   */
  setTitleByI18n(key: string, params?: {}) {
    this.setTitle(this.i18nSrv.fanyi(key, params));
  }

  ngOnDestroy(): void {
    this.i18n$.unsubscribe();
  }
}
