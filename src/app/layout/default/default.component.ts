import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { NavigationEnd, NavigationError, RouteConfigLoadStart, Router } from '@angular/router';

@Component({
    selector: 'app-layout-default',
    templateUrl: './default.component.html',
    // NOTICE: If all pages using OnPush mode, you can turn it on and all `cdr.detectChanges()` codes
    // changeDetection: ChangeDetectionStrategy.OnPush
    styleUrls: [`./default.component.css`]
})
export class LayoutDefaultComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(
        bm: BreakpointObserver,
        mediaMatcher: MediaMatcher,
        router: Router,
        private resolver: ComponentFactoryResolver,
        private el: ElementRef,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private doc: any, // private cdr: ChangeDetectorRef
    ) {
    }

    ngAfterViewInit(): void {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}
