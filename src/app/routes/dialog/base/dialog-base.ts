import { Component, OnDestroy, OnInit, Injector } from '@angular/core';
import { ComponentBase } from '@utils';
import { TreeNodeInterface } from 'src/app/utils/core/model';

export class DialogComponentBase extends ComponentBase implements OnInit {
    /**
     * 数据列表
     */
    dataList: TreeNodeInterface[];
    /**
     * 
     */
    mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
    /**
     * 初始化首页
     */
    constructor(injector: Injector) {
        super(injector);
    }
    /**
     * 初始化页面
     */
    ngOnInit(): void {
    }
    /**
     * 打开创建页面弹出框
     */
    openDialog(options?: {
        component?,
        title?,
        data?
        width?,
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
    /**
     * 关闭
     * @param array 数据集合
     * @param data 数据
     * @param $event 事件
     */
    collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
      if (!$event) {
        if (data.children) {
          data.children.forEach(d => {
            const target = array.find(a => a.code === d.code)!;
            target.expand = false;
            this.collapse(array, target, false);
          });
        } else {
          return;
        }
      }
    }
    /**
     * 转换树形列表
     * @param root 根节点
     */
    convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
      const stack: TreeNodeInterface[] = [];
      const array: TreeNodeInterface[] = [];
      const hashMap = {};
      stack.push({ ...root, level: 0, expand: false });
  
      while (stack.length !== 0) {
        const node = stack.pop()!;
        this.visitNode(node, hashMap, array);
        if (node.children) {
          for (let i = node.children.length - 1; i >= 0; i--) {
            stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
          }
        }
      }
  
      return array;
    }
    /**
     * 访问节点
     * @param node 节点
     * @param hashMap 摘要
     * @param array 数据集合
     */
    visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
      if (!hashMap[node.code]) {
        hashMap[node.code] = true;
        array.push(node);
      }
    }
}
