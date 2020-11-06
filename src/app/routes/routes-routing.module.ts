import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {environment} from '@env/environment';
import {LayoutDefaultComponent, LayoutPassportComponent} from '@layout';
import {AnalysisComponent} from './analysis/analysis.component';
import {Authorize} from '@utils';
import {JobsComponent} from './jobs/jobs.component';
import {SkillsComponent} from './skills/skills.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {ManpowerComponent} from './manpower/manpower.component';
import {EricoidComponent} from './ericoid/ericoid.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutDefaultComponent,
        // canActivateChild: [Authorize],
        children: [
            {path: '', redirectTo: 'statistics', pathMatch: 'full'},
            {path: 'analysis', component: AnalysisComponent, data: {title: '综合分析'}},
            {path: 'jobs', component: JobsComponent, data: {title: '精准就业'}},
            {path: 'skills', component: SkillsComponent, data: {title: '精准技能提升'}},
            {path: 'statistics', component: StatisticsComponent, data: {title: '监测与统计'}},
            {path: 'manpower', component: ManpowerComponent, data: {title: '人力分析'}},
            {path: 'ericoid', component: EricoidComponent, data: {title: '人力分析'}},
            {path: 'exception', loadChildren: () => import('./exception/exception.module').then((m) => m.ExceptionModule),},
        ],
    },
    // passport
    {path: 'passport', component: LayoutPassportComponent, loadChildren: () => import('./passport/passport.module').then(m => m.PassportModule), data: {title: '认证'}},
    {path: '**', redirectTo: 'exception/404'},
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: environment.useHash,
        }),
    ],
    exports: [RouterModule],
})
export class RouteRoutingModule {
}
