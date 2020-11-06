import { ViewModel } from '@utils';

/**
 * 就业信息
 */
export class EmpInfoViewModel extends ViewModel {
    /**
     * 就失业情况
     */
    regardingUnemployment;
    /**
     * 工作时间
     */
    workTime;
    /**
     * 单位类型
     */
    companyType;
    /**
     * 单位名称
     */
    companyName;
    /**
     * 单位地址
     */
    companyAddress;
    /**
     * 工种
     */
    typeOfWork;
    /**
     * 享受政策
     */
    enjoyPolicy;
    /**
     * 灵活就业方式
     */
    flexibleEmployment;
    /**
     * 新业态就业方式
     */
    newFormsOfEmployment;
    /**
     * 失业类型
     */
    typeOfUnemployment;
}
