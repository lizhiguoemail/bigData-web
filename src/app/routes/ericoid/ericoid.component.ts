import {
    Component,
    Inject,
    OnDestroy,
    Optional,
    OnInit,
    Injector,
    AfterViewInit,
    HostListener
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ComponentBase} from '@utils';
import { EmpInfoViewModel } from '../model/empInfo-view-model';
import { LabelTotalViewModel } from '../model/labelTotal-view-model';
import { SkillCertViewModel } from '../model/skillCert-view-model';
import { SmartResultViewModel } from '../model/smartResult-view-model';
import { SocialSecurityViewModel } from '../model/socialSecurity-view-model';
import { TrainRecordsViewModel } from '../model/trainRecords-view-model';
import { UserInfoViewModel } from '../model/userInfo-view-model';

@Component({
    selector: 'app-ericoid',
    templateUrl: './ericoid.component.html',
    styleUrls: ['./ericoid.component.less'],
})
export class EricoidComponent extends ComponentBase implements OnInit, OnDestroy, AfterViewInit {
    /*
      * 默认基本信息
     */
    uncur = 'information';
    /*
      * 基本信息
     */
    information: any;
    /*
      * 就业信息
     */
    obtain: any;
    /*
      * 社保信息
     */
    social: any;
    /*
      * 技能培训信息
     */
    skill: any;
    /**
     * 当前时间
     */
    currentTime: string;
    /**
     * 当前时间定时器
     */
    currentTimer: any;
    /**
     * 身份证号
     */
    cardNo = '';
    /**
     * 用户信息
     */
    userInfo: UserInfoViewModel;
    /**
     * 人员标签
     */
    personalLabel: any;
    /**
     * 技能证书
     */
    skillCert: Array<SkillCertViewModel>;
    /**
     * 社保信息
     */
    socialSecurity: SocialSecurityViewModel;
    /**
     * 培训经历
     */
    trainRecords: Array<TrainRecordsViewModel>;
    /**
     * 分析结果
     */
    smartResult: Array<SmartResultViewModel>;
    /**
     * 收入信息
     */
    incomeInfo: any;
    /**
     * 查询社保、收入和就业数量统计信息
     */
    labelTotal: LabelTotalViewModel;
    /**
     * 就业信息
     */
    empInfo: EmpInfoViewModel;
    /**
     * 社保信息加载中
     */
    labelTotalLoading: boolean;
    /**
     * 初始化首页
     */
    constructor(injector: Injector) {
        super(injector);
        this.userInfo = new UserInfoViewModel();
        this.skillCert = new Array<SkillCertViewModel>();
        this.socialSecurity = new SocialSecurityViewModel();
        this.trainRecords = new Array<TrainRecordsViewModel>();
        this.smartResult = new Array<SmartResultViewModel>();
        this.labelTotal = new LabelTotalViewModel();
        this.empInfo = new EmpInfoViewModel();
    }

    /**
     * 初始化页面
     */
    ngOnInit(): void {
        $.getScript('/assets/scripts/flexible.js');
        this.cardNo = this.data; // this.util.router.getQueryParam('card');

        this.loadUserInfo();
        this.loadPersonalLabel();
        this.loadSkillCert();
        this.loadSocialSecurity();
        this.loadTrainRecords();
        // this.loadIncomeInfo();
        this.loadSmartResult();
        this.loadLabelTotal();
        this.loadEmpInfo();
    }

    /**
     * 当前时间
     */
    loadCurrentTime() {
        this.currentTimer = setInterval(() => {
            this.currentTime = this.util.helper.formatDate(new Date(), 'YYYY年MM月DD日 HH:mm:ss');
        }, 1000);
    }

    /**
     * 加载个人信息
     */
    loadUserInfo() {
        this.util.webapi.get<UserInfoViewModel>(`api/ldl_v/personal/userInfo?cardNo=${this.cardNo}`).handle({
            ok: (resp) => {
                if (resp) this.userInfo = resp;
            }
        });
    }

    /**
     * 加载人员标签
     */
    loadPersonalLabel() {
        this.util.webapi.get<any>(`api/ldl_v/personal/personal_label?cardNo=${this.cardNo}`).handle({
            ok: (resp) => {
                if (resp) this.personalLabel = resp;
            }
        });
    }
    /**
     * 加载技能证书情况
     */
    loadSkillCert() {
        this.util.webapi.get<SkillCertViewModel[]>(`api/ldl_v/personal/skill_cert?cardNo=${this.cardNo}`).handle({
            ok: (resp) => {
                if (resp) this.skillCert = resp;
            }
        });
    }
    /**
     * 加载社保信息
     */
    loadSocialSecurity() {
        this.util.webapi.get<SocialSecurityViewModel>(`api/ldl_v/personal/social_security?cardNo=${this.cardNo}`).handle({
            ok: (resp) => {
                if (resp) this.socialSecurity = resp;
            }
        });
    }
    /**
     * 加载培训经历
     */
    loadTrainRecords() {
        this.util.webapi.get<TrainRecordsViewModel[]>(`api/ldl_v/personal/train_records?cardNo=${this.cardNo}`).handle({
            ok: (resp) => {
                if (resp) this.trainRecords = resp;
            }
        });
    }
    /**
     * 加载收入信息
     */
    loadIncomeInfo() {
        this.util.webapi.get<any>(`api/ldl_v/personal/income_info?cardNo=${this.cardNo}`).handle({
            ok: (resp) => {
                if (resp) this.incomeInfo = resp;
            }
        });
    }
    /**
     * 加载智能分析结果
     */
    loadSmartResult() {
        this.util.webapi.get<SmartResultViewModel[]>(`api/ldl_v/personal/smart?cardNo=${this.cardNo}`).handle({
            ok: (resp) => {
                if (resp) {
                    this.smartResult = resp;
                }
            }
        });
    }
    /**
     * 加载社保、收入和就业数量统计信息
     */
    loadLabelTotal() {
        this.util.webapi.get<LabelTotalViewModel>(`api/ldl_v/personal/label_total?cardNo=${this.cardNo}`).handle({
            before: () => { this.labelTotalLoading = true; return true; },
            ok: (resp) => {
                if (resp) {
                    this.labelTotal = resp;
                }
            },
            complete: () => { this.labelTotalLoading = false }
        });
    }
    /**
     * 加载就业信息
     */
    loadEmpInfo() {
        this.util.webapi.get<EmpInfoViewModel>(`api/ldl_v/personal/emp_info?cardNo=${this.cardNo}`).handle({
            ok: (resp) => {
                if(resp) {
                    this.empInfo = resp;
                }
            }
        });
    }
    /**
     * 页面销毁
     */
    ngOnDestroy(): void {
        clearInterval(this.currentTimer);
    }
    /**
     * 页面加载后
     */
    ngAfterViewInit() {
        this.information = document.getElementById('information');
        this.obtain = document.getElementById('obtain');
        this.social = document.getElementById('social');
        this.skill = document.getElementById('skill');
        this.setDialogHeight();
    }
    /**
     * 监听事件
     */
    @HostListener('window:resize')
    _resize() {
        this.setDialogHeight();
    }
    /**
     * 设置高度
     */
    setDialogHeight() {
        const bodyHeight = $(document.body).innerHeight();
        $('#container').height(bodyHeight);
    }
    /**
     * 关闭窗口
     */
    close() {
        this.util.dialog.close();
    }

    /*
    触发锚点定位  scrollIntoView::滑动效果
    */
    move(e) {
        this.uncur = e;
        switch (e) {
            case 'information':
                this.information.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
                break;
            case 'obtain':
                this.obtain.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
                break;
            case 'social':
                this.social.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
                break;
            case 'skill':
                this.skill.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
                break;
            default:
                this.information.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
                break;
        }
    }

}
