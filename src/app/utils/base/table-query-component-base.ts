import { AfterViewInit, forwardRef, Injector, ViewChild } from '@angular/core';
import { QueryParameter, ViewModel } from '../core/model';
import { Table } from '../zorro/table-wrapper.component';
import { QueryComponentBase } from './query-component-base';

/**
 * 表格查询基类
 */
export abstract class TableQueryComponentBase<TViewModel extends ViewModel, TQuery extends QueryParameter> extends QueryComponentBase implements AfterViewInit {
    /**
     * 查询参数
     */
    queryParam: TQuery;
    /**
     * 表格组件
     */
    @ViewChild(forwardRef(() => Table), { static: true }) protected table: Table<TViewModel>;

    /**
     * 初始化组件
     * @param injector 注入器
     */
    constructor(injector: Injector) {
        super(injector);
        this.queryParam = this.createQuery();
    }

    /**
     * 创建查询参数
     */
    protected createQuery(): TQuery {
        return {} as TQuery;
    }

    /**
     * 视图加载完成
     */
    ngAfterViewInit() {
        if (!this.table) {
            return;
        }
        this.table.loadAfter = result => {
            this.loadAfter(result);
        };
    }

    /**
     * 数据加载完成操作
     * @param result 返回值
     */
    loadAfter(result) {
    }

    /**
     * 查询
     * @param button 按钮
     */
    query(button?) {
        this.table.query({
            button,
            pageIndex: 1
        });
    }

    /**
     * 延迟搜索
     * @param button 按钮
     */
    search(button?) {
        this.table.search({
            button,
            delay: this.getDelay()
        });
    }

    /**
     * 删除
     * @param button 按钮
     * @param id 标识
     */
    delete(button?, id?) {
        this.table.delete({
            button,
            id,
            handler: () => {
                this.deleteAfter();
            }
        });
    }

    /**
     * 批量删除
     * @param button 按钮
     * @param id 标识
     */
    deleteBatch(button?, id?) {
        this.table.deleteBatch({
            button,
            ids: id,
            handler: () => {
                this.deleteAfter();
            }
        });
    }

    /**
     * 删除后操作
     */
    protected deleteAfter = () => {
    }

    /**
     * 刷新
     * @param button 按钮
     * @param handler 刷新后回调函数
     */
    refresh(button?, handler?: (data) => void) {
        handler = handler || this.refreshAfter;
        this.queryParam = this.createQuery();
        this.table.refresh(this.queryParam, button, handler);
    }

    /**
     * 设置表格密度
     * @param size 大小
     */
    setSise(size: string) {
        switch (size.toLowerCase()){
            case 'd':
                this.table.tableSize = 'default';
                break;
            case 'm':
                this.table.tableSize = 'middle';
                break;
            case 's':
                this.table.tableSize = 'small';
                break;
        }
    }

    /**
     * 刷新完成后操作
     */
    protected refreshAfter = data => {
    }

    /**
     * 清空复选框
     */
    clearCheckboxs() {
        this.table.clearChecked();
    }

    /**
     * 获取勾选的实体列表
     */
    getCheckedNodes() {
        return this.table.getChecked();
    }

    /**
     * 获取勾选的实体列表长度
     */
    getCheckedLength(): number {
        return this.table.getCheckedLength();
    }

    /**
     * 获取勾选的实体标识列表
     */
    getCheckedIds() {
        return this.table.getCheckedIds();
    }

    /**
     * 获取勾选的单个节点
     */
    getCheckedNode() {
        return this.table.getCheckedNode();
    }
    /**
     * 打开创建页面弹出框
     */
    openDialog(options?: {
        component?,
        title?,
        data?
        width?,
        style?,
        beforeOpen?: () => boolean;
        beforeClose?: (value) => boolean;
        close?: (value) => void;

    }) {
        options = options || {};
        this.util.dialog.open({
            component: options.component,
            title: options.title,
            data: { data: options.data },
            width: options.width,
            style: options.style,
            disableClose: true,
            showFooter: false,
            onBeforeOpen: () => {
                if (options.beforeOpen) {
                    return options.beforeOpen();
                }
            },
            onBeforeClose: result => {
                if (options.beforeClose) {
                    return options.beforeClose(result);
                }
            },
            onClose: result => {
                if (options.close) {
                    options.close(result);
                }
            }
        });
    }
}
