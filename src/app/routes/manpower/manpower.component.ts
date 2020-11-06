import {
    Component,
    Inject,
    OnDestroy,
    Optional,
    OnInit,
    Injector, AfterContentInit, HostListener,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentBase } from '@utils';
import { SmartAnalysisDialogComponent } from '../dialog/smart-analysis-dialog.component';
import { SmartPersonAnalysisDialogComponent } from '../dialog/smart-person-analysis-dialog.component';
import { EricoidComponent } from '../ericoid/ericoid.component';
import { EmpInfoViewModel } from '../model/empInfo-view-model';
import { LabelTotalViewModel } from '../model/labelTotal-view-model';
import { SeekJobInfoViewModel } from '../model/seekJobIInfo-view-model';
import { SkillCertViewModel } from '../model/skillCert-view-model';
import { SkillInfoViewModel } from '../model/skillInfo-view-model';
import { SmartResultViewModel } from '../model/smartResult-view-model';
import { SocialSecurityViewModel } from '../model/socialSecurity-view-model';
import { TrainRecordsViewModel } from '../model/trainRecords-view-model';

import { UserInfoViewModel } from '../model/userInfo-view-model';
@Component({
    selector: 'app-manpower',
    templateUrl: './manpower.component.html',
    styleUrls: ['./manpower.component.less'],
})
export class ManpowerComponent extends ComponentBase implements OnInit, AfterContentInit, OnDestroy {
    /**
     * 图片集合
     */
    imageSets: any;
    /**
     * 图片数
     */
    imageLen = 0;
    /**
     * 图片间隔角度
     */
    imageIntervalAngle = 0;
    /**
     * 已旋转角度
     */
    imageRotatingAngle = 0;
    /**
     * 定时器
     */
    animationTimer: any;
    /**
     * 椭圆X长度
     */
    ellipticX = 240;
    /**
     * 椭圆Y
     */
    ellipticY = 65;
    /**
     * 圆心X
     */
    centerX = 320;
    /**
     * 圆心Y
     */
    centerY = 50;
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
    }

    /**
     * 初始化页面
     */
    ngOnInit(): void {
        $.getScript('/assets/scripts/flexible.js');
        this.cardNo = this.data; // this.util.router.getQueryParam('card');
        this.loadCurrentTime();
        this.loadUserInfo();
        this.loadPersonalLabel();
        this.loadSkillCert();
        this.loadSocialSecurity();
        this.loadTrainRecords();
        // this.loadIncomeInfo();
        this.loadSmartResult();
        this.loadLabelTotal();
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
                    setTimeout(() => { this.initBall(); }, 100);
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
     * 页面加载后
     */
    ngAfterContentInit(): void {
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
    /**
     * 初始化小球
     */
    initBall() {
        this.imageSets = document.getElementById('div1').getElementsByClassName('ball'); // 图片集合
        this.imageLen = this.imageSets.length; // 图片数
        this.imageIntervalAngle = 360 / this.imageLen; // 图片间隔角度
        this.start();
        this.loadEvent();
    }
    /**
     * 动画开始
     */
    start() {
        this.animationTimer = setInterval(() => {
            this.setImageInfo();
            this.imageRotatingAngle++;
        }, 100);
    }

    /**
     * 动画停止
     */
    stop() {
        clearInterval(this.animationTimer);
    }

    /**
     * 设置小球信息
     */
    setImageInfo() {
        for (let i = 0; i < this.imageLen; i++) {
            this.imageSets[i].style.visibility = 'visible';
            this.imageSets[i].style.left = this.centerX + this.ellipticX * Math.cos((this.imageIntervalAngle * i + this.imageRotatingAngle) / 180 * Math.PI) + 'px';
            this.imageSets[i].style.top = this.centerY + this.ellipticY * Math.sin((this.imageIntervalAngle * i + this.imageRotatingAngle) / 180 * Math.PI) + 'px';
            this.imageSets[i].style.width = Math.sin((this.imageIntervalAngle * i + this.imageRotatingAngle) / 180 * Math.PI) * 20 + 50 + 'px';
            const currentAngle = (this.imageIntervalAngle * i + this.imageRotatingAngle);
            if (currentAngle % 360 > 200 && currentAngle % 360 < 350) {
                this.imageSets[i].style.visibility = 'hidden';
            }
            if (currentAngle % 360 > 240 && currentAngle % 360 < 330) {
                $('.ball').css('font-size', '10px');
            }
        }
    }

    /**
     * 为小球加载事件
     */
    loadEvent() {
        for (let i = 0; i < this.imageLen; i++) {
            this.imageSets[i].onmouseover = () => {
                this.stop();
            };
            this.imageSets[i].onmouseout = () => {
                this.start();
            };
            this.imageSets[i].onclick = () => {
                this.ballClick(i);
            };
        }
    }
    /**
     * 点击小球
     */
    ballClick(idx) {
        this.openDialog({
            component: SmartAnalysisDialogComponent,
            title: `分析结果⇨${this.smartResult[idx].type}`,
            data: this.smartResult[idx],
            width: '800px'
          })
    }
    /**
     * 弹出建档立卡窗口
     */
    openPersonArchivesDialog() {
        if(!this.userInfo.name) {
            this.util.message.warn('用户信息为空');
            return;
        }
        this.data = [
            `姓名：${this.userInfo.name}`,
            `性别：${this.userInfo.gender}`,
            `民族：${this.userInfo.nation}`,
            `年龄：${this.userInfo.age}`,
            `身份证号：${this.userInfo.cardNo}`,
            `户籍：${this.userInfo.address}`,
            `文化程度：${this.userInfo.education}`,
            `健康状态：${this.userInfo.bodyState}`,
            `是否务农：${this.userInfo.farmer}`,
            `特殊人群：${this.userInfo.specialCrowd}`,
        ];
        this.openDialog({
            component: SmartPersonAnalysisDialogComponent,
            title: `建档立卡信息`,
            data: this.data,
            width: '800px'
          })
    }
    /**
     * 培训求职加载中
     */
    trainingLoading: boolean;
    /**
     * 弹出培训求职窗口
     */
    openTrainingDialog() {
        this.util.webapi.get<SeekJobInfoViewModel>(`api/ldl_v/personal/seek_job_info?cardNo=${this.cardNo}`).handle({
            before: () => { this.trainingLoading = true; return true; },
            ok: (resp) => {
                if (resp) {
                    this.data = [
                        `对外劳务输出意愿: ${resp.exportLabor}`,
                        `意向国家: ${resp.intentionCountry}`,
                        `期望工作地点: ${resp.expectedPlace}`,
                        `期望薪资: ${resp.expectedSalary}`,
                        `工种: ${resp.typeOfWork}`,
                    ];
                    this.openDialog({
                        component: SmartPersonAnalysisDialogComponent,
                        title: `培训求职信息`,
                        data: this.data,
                        width: '800px'
                      })
                }
            },
            complete: () => { this.trainingLoading = false }
        });
    }
    /**
     * 技能信息加载中
     */
    skillsLoading: boolean;
    /**
     * 弹出技能信息窗口
     */
    openSkillsDialog() {
        this.util.webapi.get<SkillInfoViewModel>(`api/ldl_v/personal/skill_info?cardNo=${this.cardNo}`).handle({
            before: () => { this.skillsLoading = true; return true; },
            ok: (resp) => {
                if (resp) {
                    this.data = [
                        `技能证书: ${resp.skillsCertificate}`,
                        `工种名称: ${resp.jobName}`,
                        `工作等级: ${resp.jobLevel}`,
                        `获证时间: ${resp.obtainedTime}`,
                        `技能情况: ${resp.skillSituation}`
                    ];
                    this.openDialog({
                        component: SmartPersonAnalysisDialogComponent,
                        title: `技能信息`,
                        data: this.data,
                        width: '800px'
                      })
                }
            },
            complete: () => { this.skillsLoading = false }
        });
    }
    /**
     * 就业信息加载中
     */
    jobLoading: boolean;
    /**
     * 弹出就业信息窗口
     */
    openJobDialog() {
        this.util.webapi.get<EmpInfoViewModel>(`api/ldl_v/personal/emp_info?cardNo=${this.cardNo}`).handle({
            before: () => { this.jobLoading = true; return true; },
            ok: (resp) => {
                if (resp) {
                    this.data = [
                        `就失业情况: ${resp.regardingUnemployment}`,
                        `单位类型: ${resp.companyType}`,
                        `单位名称: ${resp.companyName}`,
                        `单位地址: ${resp.companyAddress}`,
                        `工种: ${resp.typeOfWork}`,
                        `享受政策: ${resp.enjoyPolicy}`,
                        `灵活就业方式: ${resp.flexibleEmployment}`,
                        `新业态就业方式: ${resp.newFormsOfEmployment}`,
                        `失业类型: ${resp.typeOfUnemployment}`
                    ];
                    this.openDialog({
                        component: SmartPersonAnalysisDialogComponent,
                        title: `就业信息`,
                        data: this.data,
                        width: '800px'
                      })
                }
            },
            complete: () => { this.jobLoading = false }
        });
    }
    /**
     * 打开人员详情
     * @param data 数据
     */
    openUserDialog(idCardNo) {
        this.openDialog({
            component: EricoidComponent,
            // title: data.name,
            data: idCardNo,
            width: '100%',
            style: { top: '-1px' }
        })
    }
    /**
     * 页面销毁
     */
    ngOnDestroy(): void {
        clearInterval(this.currentTimer);
        clearInterval(this.animationTimer);
    }
}
