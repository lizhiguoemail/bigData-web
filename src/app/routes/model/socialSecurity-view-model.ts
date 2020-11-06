import { ViewModel } from '@utils';

/**
 * 社保信息
 */
export class SocialSecurityViewModel extends ViewModel {
    /**
     * 养老保险状态
     */
    pensionJoinStatus;
    /**
     * 养老保险时间
     */
    pensionJoinTime;
    /**
     * 失业保险状态
     */
    unempInsuranceJoinStatus;
    /**
     * 失业保险时间
     */
    unempInsuranceJoinTime;
    /**
     * 工伤保险状态
     */
    injuryInsuranceJoinStatus;
    /**
     * 工伤保险时间
     */
    injuryInsuranceJoinTime;
}
