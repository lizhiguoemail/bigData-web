import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { util, TokenService } from '@utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * 初始化
   * @param session 用户会话
   */
  constructor(injector: Injector, private tokenService: TokenService) {
    util.ioc.componentInjector = injector;
  }
  /**
   * 拦截请求
   * @param req 请求信息
   * @param next 执行请求操作
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const data = this.tokenService.get();
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${data.token}`)
    });
    return next.handle(clonedRequest);
  }
}
