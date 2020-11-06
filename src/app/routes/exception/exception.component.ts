import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { RouterHelper } from 'src/app/utils/angular/router-helper';
import { isEmpty } from 'src/app/utils/common/helper';

export type ExceptionType = 403 | 404 | 500;

@Component({
  selector: 'exception',
  exportAs: 'exception',
  templateUrl: './exception.component.html',
  host: { '[class.exception]': 'true' },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
  `]
})
export class ExceptionComponent implements OnInit, OnDestroy {
  static ngAcceptInputType_type: ExceptionType | string;

  private i18n$: Subscription;
  @ViewChild('conTpl', { static: true }) private conTpl: ElementRef;

  _type: ExceptionType;
  hasCon = false;

  _img: SafeUrl = '';
  _title: SafeHtml = '';
  _desc: SafeHtml = '';

  @Input()
  set type(value: ExceptionType) {
    const item = {
      403: {
        img: '/assets/images/403.svg',
        title: '403',
        desc: '抱歉，你无权访问该页面'
      },
      404: {
        img: '/assets/images/404.svg',
        title: '404',
        desc: '抱歉，你访问的页面不存在'
      },
      500: {
        img: '/assets/images/500.svg',
        title: '500',
        desc: '抱歉，服务器出错了'
      },
    }[value];

    if (!item) return;

    this.fixImg(item.img);
    this._type = value;
    this._title = item.title;
    this._desc = item.desc;
  }

  private fixImg(src: string): void {
    this._img = this.dom.bypassSecurityTrustStyle(`url('${src}')`);
  }

  @Input()
  set img(value: string) {
    this.fixImg(value);
  }

  @Input()
  set title(value: string) {
    this._title = this.dom.bypassSecurityTrustHtml(value);
  }

  @Input()
  set desc(value: string) {
    this._desc = this.dom.bypassSecurityTrustHtml(value);
  }

  checkContent(): void {
    this.hasCon = !isEmpty(this.conTpl.nativeElement);
  }

  constructor(private dom: DomSanitizer) {}

  ngOnInit(): void {
    this.checkContent();
  }

  ngOnDestroy(): void {
    this.i18n$.unsubscribe();
  }

  goHome() {
    window.location.href = '/';
  }
}