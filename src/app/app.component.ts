import {Component, OnInit, Renderer2, ElementRef} from '@angular/core';
import {TitleService} from '@core';
import {Router, NavigationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'app-root',
    template: `
        <div id="app">
            <router-outlet></router-outlet>
        </div> `,
    styles: [
            `
            #app {
                width: 100%;
                height: 100%;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
        `
    ]
})
export class AppComponent implements OnInit {
    title = 'loading...';

    constructor(
        el: ElementRef,
        renderer: Renderer2,
        private router: Router,
        private titleSrv: TitleService,
    ) {
        titleSrv.suffix = '劳动力建档立卡大数据分析平台';
    }

    ngOnInit() {
        this.router.events.pipe(filter((evt) => evt instanceof NavigationEnd)).subscribe(() => {
            this.titleSrv.setTitle();
        });
    }
}
