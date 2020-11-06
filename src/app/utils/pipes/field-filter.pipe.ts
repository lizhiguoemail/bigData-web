import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'fieldFilter',
})
export class FieldFilterPipe implements PipeTransform {

  transform(items: any[], field: string, value: string): any[] {
    // tslint:disable-next-line:curly
    if (!items) return [];
    // tslint:disable-next-line:curly
    if (!value) return items;
    return items.filter(it => it[field].toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

}

@Pipe({
  name: 'bindHtmlUnsafe',
})
export class BindHtmlUnsafePipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: string) {
    const result = input;
    return this.sanitized.bypassSecurityTrustHtml(result);
  }
}

@Pipe({
  name: 'isDeleted',
})
export class IsDeletedPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: number) {
    const result = input === 1 
      ? '<span style=\'color:red;\'>已删除</span>' 
      : '<span style=\'color:green;\'>未删除</span>';
    return this.sanitized.bypassSecurityTrustHtml(result);
  }
}

@Pipe({
  name: 'securtityHtml',
})
export class SecurtityHtml implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: string) {
    return this.sanitized.bypassSecurityTrustHtml(input);
  }
}

@Pipe({
  name: 'isDisabled',
})
export class IsDiabledPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: number) {
    const result = input === 1 
      ? '<span style=\'color:red;\'>已禁用</span>' 
      : '<span style=\'color:green;\'>已启用</span>';
    return this.sanitized.bypassSecurityTrustHtml(result);
  }
}


@Pipe({
  name: 'isEnabled',
})
export class IsEnabledPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: number) {
    const result = input === 1 
      ? '<span style=\'color:green;\'>已启用</span>'
      : '<span style=\'color:red;\'>已禁用</span>';
    return this.sanitized.bypassSecurityTrustHtml(result);
  }
}

@Pipe({
  name: 'formatBindGA',
})
export class FormatBindGAPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: string) {
    let result = '';
    // tslint:disable-next-line: prefer-conditional-expression
    if (input === '' || input === undefined || input.length < 0) {
      result = '<span style=\'color:red;\'>未绑定</span>';
    } else {
      result = '<span style=\'color:green;\'>已绑定</span>';
    }
    return this.sanitized.bypassSecurityTrustHtml(result);
  }
}

@Pipe({
  name: 'navicertApplyStatus',
})
export class NavicertApplyStatusPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: number) {
    let result = '';
    if (input == null) { return result; }
    switch (input) {
      case 0:
        result = '已保存';
        break;
      case 1:
        result = '已提交';
        break;
      case 2:
        result = '已受理';
        break;
      case 3:
        result = '已审核';
        break;
      case 4:
        result = '已发证';
        break;
      default:
        result = '未知';
        break;
    }
    return result;
  }
}

@Pipe({
  name: 'navicertChkStatus',
})
export class NavicertChkStatusPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: number) {
    let result = '未处理';
    if (!input) { return result; }
    switch (input) {
      case 1:
        result = '受理通过';
        break;
      case 2:
        result = '受理驳回';
        break;
      case 3:
        result = '审核通过';
        break;
      case 4:
        result = '审核驳回';
        break;
      default:
        result = '未知';
        break;
    }
    return result;
  }
}

@Pipe({
  name: 'dataChkStatus',
})
export class DataChkStatusPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: number) {
    let result = '';
    switch (input) {
      case 1:
        result = '已提交';
        break;
      case 2:
        result = '已审核';
        break;
      default:
        result = '已保存';
        break;
    }
    return result;
  }
}

@Pipe({
  name: 'loginStatus',
})
export class LoginStatusPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: number) {
    let result = '';
    switch (input) {
      case 0:
        result = '成功';
        break;
      case 1:
        result = '失败';
        break;
      default:
        result = '未知';
        break;
    }
    return result;
  }
}

@Pipe({
  name: 'businessType',
})
export class BusinessTypePipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: number) {
    let result = '';
    switch (input) {
      case 0:
        result = '其它';
        break;
      case 1:
        result = '新增';
        break;
      case 2:
        result = '修改';
        break;
      case 3:
        result = '删除';
        break;
      case 4:
        result = '保存';
        break;
      case 5:
        result = '批量新增';
        break;
      case 6:
        result = '批量修改';
        break;
      case 7:
        result = '批量删除';
        break;
      case 8:
        result = '批量保存';
        break;
      case 9:
        result = '导入';
        break;
      case 10:
        result = '导出';
        break;
      case 11:
        result = '上传';
        break;
      default:
        result = '未知';
        break;
    }
    return result;
  }
}

@Pipe({
  name: 'operatorType',
})
export class OperatorTypePipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: number) {
    let result = '';
    switch (input) {
      case 0:
        result = '其它';
        break;
      case 1:
        result = '后台用户';
        break;
      case 2:
        result = '手机端用户';
        break;
      default:
        result = '未知';
        break;
    }
    return result;
  }
}

@Pipe({
  name: 'operatorStatus',
})
export class OperatorStatusPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: number) {
    let result = '';
    switch (input) {
      case 0:
        result = '成功';
        break;
      case 1:
        result = '异常';
        break;
      default:
        result = '未知';
        break;
    }
    return result;
  }
}

@Pipe({
  name: 'scoreRuleType',
})
export class ScoreRuleTypePipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: number) {
    let result = '';
    switch (input) {
      case 1:
        result = '土地';
        break;
      case 2:
        result = '水';
        break;
      case 3:
        result = '电';
        break;
      case 4:
        result = '税';
        break;
      default:
        result = '未知';
        break;
    }
    return result;
  }
}

@Pipe({
  name: 'locationType',
})
export class LocationTypePipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: string) {
    let result = ''; // 1 卫星定位、2 WiFi定位、3 基站定位、4 未定位
    switch (input) {
      case '1':
        result = '卫星定位';
        break;
      case '2':
        result = 'WiFi定位';
        break;
      case '3':
        result = '基站定位';
        break;
      case '4':
        result = '未定位';
        break;
      default:
        result = '未知';
        break;
    }
    return result;
  }
}
@Pipe({
  name: 'entBaseChkStatus',
})
export class EntBaseChkStatusPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: number) {
    let result = '未审核';
    if (!input) { return result; }
    switch (input) {
      case 1:
        result = '审核通过';
        break;
      case 2:
        result = '审核驳回';
        break;
      default:
        result = '未知';
        break;
    }
    return result;
  }
}

@Pipe({
  name: 'cmsChannelType',
})
export class CmsChannelType implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(input: number) {
    let result = '未知';
    if (!input) { return result; }
    switch (input) {
      case 1:
        result = '新闻';
        break;
      case 2:
        result = '专题';
        break;
      default:
        result = '未知';
        break;
    }
    return result;
  }
}
