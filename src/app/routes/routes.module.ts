import {NgModule} from '@angular/core';

import {SharedModule} from '@shared';
import {UtilModule, util} from '@utils';
import {RouteRoutingModule} from './routes-routing.module';
import {AnalysisComponent} from './analysis/analysis.component';
import {JobsComponent} from './jobs/jobs.component';
import {SkillsComponent} from './skills/skills.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {ManpowerComponent} from './manpower/manpower.component';
import {EricoidComponent} from './ericoid/ericoid.component';
import {NavComponent} from './nav/nav.component';
import { CommonAreaComponent } from './common/area.component';
import { CommonTradesComponent } from './common/trades.component';

import { DistributionChartComponent } from './charts/distribution.component';
import { ShanxiMapComponent } from './charts/shanxi.component';
import { TalentTeamChartComponent } from './charts/talent-team.component';
import { LoaderChartComponent } from './charts/loader.component';
import { CountToChartComponent } from './charts/count-to.component';
import { WordCloudChartComponent } from './charts/word-cloud.component';
import { AgeAnalysisChartComponent } from './charts/age-analysis.component';
import { DegreeAnalysisChartComponent } from './charts/degree-analysis.component';
import { GenderAnalysisChartComponent } from './charts/gender-analysis.component';
import { HealthAnalysisChartComponent } from './charts/health-analysis.component';
import { IncomeAnalysisChartComponent } from './charts/income-analysis.component';
import { JobIntentionStatisticsChartComponent } from './charts/job-intention-statistics.component';
import { LaborOutputSituationStatisticsChartComponent } from './charts/labor-output-situation-statistics.component';
import { ShanxiJobsMapComponent } from './charts/shanxi-jobs-map.component';
import { ShanxiSkillsMapComponent } from './charts/shanxi-skills-map.component';
import { ShanxiStatisticsMapComponent } from './charts/shanxi-statistics-map.component';
import { SkillCertStatisticsChartComponent } from './charts/skill-cert-statistics.component';
import { SkillImproveStatisticsChartComponent } from './charts/skill-improve-statistics.component';
import { TrainingAgeDistributionChartComponent } from './charts/training-age-distribution.component';
import { TrainingCompareChartComponent } from './charts/training-compare.component';
import { TrainingIntentionAnalysisChartComponent } from './charts/training-intention-analysis.component';
import { TrainingIntentionStatisticsChartComponent } from './charts/training-intention-statistics.component';
import { TrainingJobTop5ChartComponent } from './charts/training-job-top5.component';
import { WorkAnalysisChartComponent } from './charts/work-analysis.component';
import { WorkFlexibleAnalysisChartComponent } from './charts/work-flexible-analysis.component';
import { WorkSituationAnalysisChartComponent } from './charts/work-situation-analysis.component';
import { WorkSituationStatisticsChartComponent } from './charts/work-situation-statistics.component';
import { WorkStatisticsAnalysisChartComponent } from './charts/work-statistics-analysis.component';
import { WorkTrainingAnalysisChartComponent } from './charts/work-training-analysis.component';
import { AreaAnalysisDialogComponent } from './dialog/area-analysis-dialog.component';
import { UserAnalysisDialogComponent } from './dialog/user-analysis-dialog.component';
import { PersonIncomeChartComponent } from './charts/person-income.component';
import { SmartAnalysisDialogComponent } from './dialog/smart-analysis-dialog.component';
import { SmartPersonAnalysisDialogComponent } from './dialog/smart-person-analysis-dialog.component';

const COMPONENTS = [
    AnalysisComponent,
    NavComponent,
    JobsComponent,
    SkillsComponent,
    StatisticsComponent,
    ManpowerComponent,
    EricoidComponent,
    CommonAreaComponent,
    CommonTradesComponent,
    DistributionChartComponent,
    ShanxiMapComponent,
    TalentTeamChartComponent,
    LoaderChartComponent,
    CountToChartComponent,
    WordCloudChartComponent,
    AgeAnalysisChartComponent,
    DegreeAnalysisChartComponent,
    GenderAnalysisChartComponent,
    HealthAnalysisChartComponent,
    IncomeAnalysisChartComponent,
    JobIntentionStatisticsChartComponent,
    LaborOutputSituationStatisticsChartComponent,
    ShanxiJobsMapComponent,
    ShanxiSkillsMapComponent,
    ShanxiStatisticsMapComponent,
    SkillCertStatisticsChartComponent,
    SkillImproveStatisticsChartComponent,
    TrainingAgeDistributionChartComponent,
    TrainingCompareChartComponent,
    TrainingIntentionAnalysisChartComponent,
    TrainingIntentionStatisticsChartComponent,
    TrainingJobTop5ChartComponent,
    WorkAnalysisChartComponent,
    WorkFlexibleAnalysisChartComponent,
    WorkSituationAnalysisChartComponent,
    WorkSituationStatisticsChartComponent,
    WorkStatisticsAnalysisChartComponent,
    WorkTrainingAnalysisChartComponent,
    PersonIncomeChartComponent,
];
const COMPONENTS_NOROUNT = [
    AreaAnalysisDialogComponent,
    UserAnalysisDialogComponent,
    SmartAnalysisDialogComponent,
    SmartPersonAnalysisDialogComponent,
    ManpowerComponent,
    EricoidComponent
];

@NgModule({
    imports: [SharedModule, UtilModule, RouteRoutingModule],
    declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
    entryComponents: COMPONENTS_NOROUNT
})
export class RoutesModule {
}
