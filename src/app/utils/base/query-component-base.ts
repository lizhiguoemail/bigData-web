import { Injector, Input } from '@angular/core';
import { Util as util } from '../util';

/**
 * 查询基类
 */
export abstract class QueryComponentBase {
    /**
     * 操作库
     */
    protected util = util;
    /**
     * 是否展开
     */
    expand;
    /**
     * 复选框选中的标识列表
     */
    checkedIds;
    /**
     * 传入数据
     */
    @Input() data;

    /**
     * 初始化组件
     * @param injector 注入器
     */
    constructor( injector: Injector ) {
        util.ioc.componentInjector = injector;
    }

    /**
     * 查询
     * @param button 按钮
     */
    abstract query( button?);

    /**
     * 获取查询延迟间隔，单位：毫秒，默认500
     */
    protected getDelay() {
        return 500;
    }

    /**
     * 打开创建页面弹出框
     */
    openCreateDialog( data?) {
        this.util.dialog.open( {
            component: this.getCreateDialogComponent(),
            title: this.getCreateDialogTitle(),
            data: this.getCreateDialogData( data ),
            width: this.getCreateDialogWidth(),
            disableClose: true,
            showFooter: false,
            onBeforeOpen: () => {
                return this.onCreateBeforeOpen();
            },
            onBeforeClose: result => {
                return this.onCreateBeforeClose( result );
            },
            onClose: result => {
                this.onCreateClose( result );
            }
        } );
    }

    /**
     * 获取创建弹出框组件
     */
    protected getCreateDialogComponent(): any {
        return {};
    }

    /**
     * 获取创建弹出框标题
     */
    protected getCreateDialogTitle() {
        return null;
    }

    /**
     * 获取创建弹出框数据
     */
    protected getCreateDialogData( data?): any {
        if ( !data ) {
            return null;
        }
        return { data };
    }

    /**
     * 获取创建弹出框宽度
     */
    protected getCreateDialogWidth() {
        return this.getDialogWidth();
    }

    /**
     * 获取弹出框宽度，默认值：60%
     */
    protected getDialogWidth() {
        return '60%';
    }

    /**
     * 打开创建页面抽屉框
     */
    openCreateDrawer( data?) {
        this.util.drawer.open( {
            component: this.getCreateDrawerComponent(),
            title: this.getCreateDrawerTitle(),
            data: this.getCreateDrawerData( data ),
            width: this.getCreateDrawerWidth(),
            disableClose: true,
            onBeforeOpen: () => {
                return this.onCreateBeforeOpen();
            },
            onBeforeClose: result => {
                return this.onCreateBeforeClose( result );
            },
            onClose: result => {
                this.onCreateClose( result );
            }
        } );
    }

    /**
     * 获取创建抽屉框组件
     */
    protected getCreateDrawerComponent(): any {
        return {};
    }

    /**
     * 获取创建抽屉框标题
     */
    protected getCreateDrawerTitle() {
        return null;
    }

    /**
     * 获取创建抽屉框数据
     */
    protected getCreateDrawerData( data?): any {
        if ( !data ) {
            return null;
        }
        return { data };
    }

    /**
     * 获取创建抽屉框宽度
     */
    protected getCreateDrawerWidth() {
        return this.getDrawerWidth();
    }

    /**
     * 获取抽屉框宽度，默认值：60%
     */
    protected getDrawerWidth() {
        return '60%';
    }

    /**
     * 创建弹出框打开前回调函数，返回 false 阻止打开
     */
    protected onCreateBeforeOpen() {
        return true;
    }

    /**
     * 创建弹出框关闭前回调函数，返回 false 阻止关闭
     * @param result 返回结果
     */
    protected onCreateBeforeClose( result ) {
        return true;
    }

    /**
     * 创建弹出框关闭回调函数
     * @param result 返回结果
     */
    protected onCreateClose( result ) {
        if ( result ) {
            this.query();
        }
    }

    /**
     * 打开修改页面弹出框
     */
    openEditDialog( data ) {
        this.util.dialog.open( {
            component: this.getEditDialogComponent(),
            title: this.getEditDialogTitle(),
            data: this.getEditDialogData( data ),
            width: this.getEditDialogWidth(),
            disableClose: true,
            showFooter: false,
            onBeforeOpen: () => {
                return this.onEditBeforeOpen();
            },
            onBeforeClose: result => {
                return this.onEditBeforeClose( result );
            },
            onClose: result => {
                this.onEditClose( result );
            }
        } );
    }

    /**
     * 获取更新弹出框组件
     */
    protected getEditDialogComponent(): any {
        return this.getCreateDialogComponent();
    }

    /**
     * 获取更新弹出框标题
     */
    protected getEditDialogTitle() {
        return null;
    }

    /**
     * 获取更新弹出框数据
     */
    protected getEditDialogData( data ): any {
        if ( !data ) {
            return null;
        }
        return { id: data.id, data };
    }

    /**
     * 获取编辑弹出框宽度
     */
    protected getEditDialogWidth() {
        return this.getDialogWidth();
    }

    /**
     * 更新弹出框打开前回调函数，返回 false 阻止打开
     */
    protected onEditBeforeOpen() {
        return true;
    }

    /**
     * 更新弹出框关闭前回调函数，返回 false 阻止关闭
     * @param result 返回结果
     */
    protected onEditBeforeClose( result ) {
        return true;
    }

    /**
     * 打开修改页面抽屉框
     */
    openEditDrawer( data ) {
        this.util.drawer.open( {
            component: this.getEditDrawerComponent(),
            title: this.getEditDrawerTitle(),
            data: this.getEditDrawerData( data ),
            width: this.getEditDrawerWidth(),
            disableClose: true,
            onBeforeOpen: () => {
                return this.onCreateBeforeOpen();
            },
            onBeforeClose: result => {
                return this.onCreateBeforeClose( result );
            },
            onClose: result => {
                this.onEditClose( result );
            }
        } );
    }

    /**
     * 获取更新抽屉框组件
     */
    protected getEditDrawerComponent(): any {
        return this.getCreateDrawerComponent();
    }

    /**
     * 获取更新抽屉框标题
     */
    protected getEditDrawerTitle() {
        return null;
    }

    /**
     * 获取更新抽屉框数据
     */
    protected getEditDrawerData( data ): any {
        if ( !data ) {
            return null;
        }
        return { id: data.id, data };
    }

    /**
     * 获取编辑抽屉框宽度
     */
    protected getEditDrawerWidth() {
        return this.getDrawerWidth();
    }

    /**
     * 更新抽屉框关闭回调函数
     * @param result 返回结果
     */
    protected onEditClose( result ) {
        if ( result ) {
            this.query();
        }
    }

    /**
     * 打开详情页面弹出框
     */
    openDetailDialog( data ) {
        this.util.dialog.open( {
            component: this.getDetailDialogComponent(),
            title: this.getDetailDialogTitle(),
            data: this.getDetailDialogData( data ),
            width: this.getDetailDialogWidth(),
            showOk: false
        } );
    }

    /**
     * 获取详情弹出框组件
     */
    protected getDetailDialogComponent(): any {
        return {};
    }

    /**
     * 获取更新弹出框标题
     */
    protected getDetailDialogTitle() {
        return null;
    }

    /**
     * 获取详情弹出框数据
     */
    protected getDetailDialogData( data ): any {
        return this.getEditDialogData( data );
    }

    /**
     * 获取详情弹出框宽度
     */
    protected getDetailDialogWidth() {
        return this.getDialogWidth();
    }

    /**
     * 打开详情页面抽屉框
     */
    openDetailDrawer( data ) {
        this.util.drawer.open( {
            component: this.getDetailDrawerComponent(),
            title: this.getDetailDrawerTitle(),
            data: this.getDetailDrawerData( data ),
            width: this.getDetailDrawerWidth(),
            disableClose: false,
            onClose: result => {
                this.onEditClose( result );
            }
        } );
    }

    /**
     * 获取详情抽屉框组件
     */
    protected getDetailDrawerComponent(): any {
        return {};
    }

    /**
     * 获取更新抽屉框标题
     */
    protected getDetailDrawerTitle() {
        return null;
    }

    /**
     * 获取详情抽屉框数据
     */
    protected getDetailDrawerData( data ): any {
        return this.getEditDrawerData( data );
    }

    /**
     * 获取详情抽屉框宽度
     */
    protected getDetailDrawerWidth() {
        return this.getDrawerWidth();
    }
}
