import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, CanActivateChild, CanLoad, Route } from '@angular/router';
import { Session } from '../security/session';
import { Util as util } from '../util';
import { TokenService } from './token.service';

/**
 * 授权
 */
@Injectable()
export class Authorize implements CanActivate, CanActivateChild, CanLoad {
    /**
     * 登录地址，默认值 "/login"
     */
    static loginUrl = '/passport/login';
    /**
     * 获取用户会话地址，默认值 "/api/security/session"
     */
    static sessionUrl = '/api/security/session';
    private url: string | undefined;
    /**
     * 初始化
     * @param session 用户会话
     */
    constructor(injector: Injector, private session: Session, private tokenService: TokenService) {
        util.ioc.componentInjector = injector;
    }
    /**
     * 是否能加载
     * @param route 路由
     * @param segments 片段
     */
    canLoad(route: Route, segments: import('@angular/router').UrlSegment[]): boolean {
        this.url = route.path;
        return true;
    }
    /**
     * 验证子路由是否激活组件
     * @param childRoute 子路由
     * @param state 状态
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.verfiySession(state);
    }
    /**
     * 是否激活组件
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.verfiySession(state);
    }
    /**
     * 验证当前会话
     * @param state 状态
     */
    verfiySession(state: RouterStateSnapshot): boolean {
        if (this.session && this.session.isAuthenticated) {
            return true;
        }
        this.loadSessionAsync();
        if (this.session && this.session.isAuthenticated) {
            return true;
        }
        util.router.navigateByQuery([Authorize.loginUrl], { returnUrl: state.url });
        return false;
    }
    /**
     * 加载用户会话
     */
    private loadSessionAsync(): boolean {
        const data = this.tokenService.get();
        this.session.userId = data.id;
        this.session.name = data.name;
        this.session.isAuthenticated = data.id ? true : false;
        return this.session.isAuthenticated;
    }
}
