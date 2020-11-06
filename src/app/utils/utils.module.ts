import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from '@angular/core';

// Angular模块
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Util管道
import { BindHtmlUnsafePipe, BusinessTypePipe, CmsChannelType, DataChkStatusPipe, EntBaseChkStatusPipe, 
    FieldFilterPipe, FormatBindGAPipe, IsDeletedPipe, IsDiabledPipe, IsEnabledPipe, 
    LocationTypePipe, LoginStatusPipe, NavicertApplyStatusPipe, NavicertChkStatusPipe, OperatorStatusPipe,
    OperatorTypePipe, ScoreRuleTypePipe, SecurtityHtml } from './pipes/field-filter.pipe';
import { IsTruncatePipe } from './pipes/is-truncate.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { TokenService } from './security/token.service';
import { Session } from './security/session';
import { Authorize } from './security/authorize';

// Util组件
import { Button } from './zorro/button-wrapper.component';
import { CheckboxGroup } from './zorro/checkbox-group-wrapper.component';
import { DatePicker } from './zorro/datepicker-wrapper.component';
import { NumberTextBox } from './zorro/number-textbox-wrapper.component';
import { Radio } from './zorro/radio-wrapper.component';
import { Select } from './zorro/select-wrapper.component';
import { Switch } from './zorro/switch-wrapper.component';
import { Table } from './zorro/table-wrapper.component';
import { TextArea } from './zorro/textarea-wrapper.component';
import { TextBoxSelect } from './zorro/textbox-select-wrapper.component';
import { TextBox } from './zorro/textbox-wrapper.component';
import { TreeSelect } from './zorro/tree-select-wrapper.component';
import { TreeTable } from './zorro/tree-table-wrapper.component';
import { Tree } from './zorro/tree-wrapper.component';

// Util指令
import { DialogWrapperComponent } from './zorro/dialog-wrapper.component';

import { SHARED_ZORRO_MODULES } from '../shared/shared-zorro.module';

// 组件集合
const components = [
    SafeUrlPipe, TruncatePipe, IsTruncatePipe,
    FieldFilterPipe, BindHtmlUnsafePipe, IsDeletedPipe, SecurtityHtml, IsDiabledPipe, IsEnabledPipe, 
    FormatBindGAPipe, NavicertApplyStatusPipe, NavicertChkStatusPipe, DataChkStatusPipe,
    LoginStatusPipe, BusinessTypePipe, OperatorTypePipe, OperatorStatusPipe, ScoreRuleTypePipe,
    LocationTypePipe, EntBaseChkStatusPipe, CmsChannelType,
    Button, TextBox, TextBoxSelect, DatePicker, TextArea, NumberTextBox,
    Select, Radio, CheckboxGroup, Switch, Table, Tree, TreeSelect, TreeTable
];

// 指令集合
const directives = [
];

/**
 * Util模块
 */
@NgModule({
    imports: [
        CommonModule, 
        FormsModule, 
        RouterModule,
        ...SHARED_ZORRO_MODULES,
    ],
    declarations: [
        components, directives
    ],
    exports: [
        components, 
        directives,
        ...SHARED_ZORRO_MODULES,
    ],
    providers: [
        TokenService, Session, Authorize
    ]
})
export class UtilModule {
}
