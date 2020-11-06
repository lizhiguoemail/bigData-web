import { QueryParameter } from '@utils';

/**
 * 查询参数
 */
export class UserAnalysisQuery extends QueryParameter {
    /**
     * 地区代码
     */
    code;
    /**
     * 类型
     */
    lx;
    /**
     * 人员类型
     */
    rylx;
}
