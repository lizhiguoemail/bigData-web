import { Component, OnDestroy, OnInit, Injector, Input, HostListener, } from '@angular/core';
import * as screenfull from 'screenfull';
import { ComponentBase } from '@utils';
import { ManpowerComponent } from '../manpower/manpower.component';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.less'],
})
export class NavComponent extends ComponentBase implements OnInit, OnDestroy {
    status = false;
    private get sf(): screenfull.Screenfull {
        return screenfull as screenfull.Screenfull;
    }
    @Input() navTitle: string;
    active: boolean;
    /**
     * 判断搜索
     */
    ismargin = false;
    seachFrame = false;
    card: string;

    constructor(injector: Injector) {
        super(injector);
    }

    /**
     * 初始化页面
     */
    ngOnInit(): void {
        this.card = '';
    }

    /**
     * 获取地址
     */
    setActive(url) {
        return this.util.router.getUrl().indexOf(url) > -1;
    }

    /**
     * 点击搜索滑出
     */
    isOpen() {
        this.ismargin = !this.ismargin;
        // tslint:disable-next-line: triple-equals
        if (this.ismargin == true) {
            const inputAutofocus = document.getElementById('searchInput');
            inputAutofocus.focus();
        }

    }

    /**
     * 搜索跳转
     */
    openPersonDetail() {
        if (this.vaildCardNo()) {
            this.openUserDialog(this.card);
        }
    }

    /**
     * 搜索键盘确认事件
     */
    keyUpSearch(e) {
        // tslint:disable-next-line: triple-equals
        if (e.keyCode == 13) {
            if (this.vaildCardNo()) {
                this.openUserDialog(this.card);
            }
        }
    }

    /**
     * 打开人员详情
     * @param data 数据
     */
    openUserDialog(idCardNo) {
        this.openDialog({
            component: ManpowerComponent,
            // title: data.name,
            data: idCardNo,
            width: '100%',
            style: { top: '-1px' }
        })
    }
    /**
     * 验证规则
     */
    vaildCardNo() {
        if (this.card.trim() == '') {
            this.util.message.warn('身份证号不能为空');
            return false;
        }
        if (this.card.trim().length != 18) {
            this.util.message.warn('身份证号格式有误');
            return false;
        }
        return true;
    }
    /**
     * 后退
     */
    back() {
        this.util.router.back();
    }
    /**
     * 前进
     */
    forward() {
        this.util.router.forward();
    }
    /**
     * 监听事件
     */
    @HostListener('window:resize')
    _resize() {
        this.status = this.sf.isFullscreen;
    }
    /**
     * 全屏
     */
    fullscreen() {
        if (this.sf.isEnabled) {
            this.sf.toggle();
        }
    }
    /**
     * 销毁页面
     */
    ngOnDestroy(): void {
    }
}
