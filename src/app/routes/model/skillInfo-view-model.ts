import { ViewModel } from '@utils';

/**
 * 查询技能信息
 */
export class SkillInfoViewModel extends ViewModel {
    /**
     * 技能证书
     */
    skillsCertificate;
    /**
     * 工种名称
     */
    jobName;
    /**
     * 工作等级
     */
    jobLevel;
    /**
     * 获证时间
     */
    obtainedTime;
    /**
     * 技能情况
     */
    skillSituation;
}
