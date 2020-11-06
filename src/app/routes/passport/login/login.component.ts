import { Component, Inject, OnDestroy, Optional, OnInit, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentBase, TokenService } from '@utils';

@Component({
  selector: 'app-passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class UserLoginComponent extends ComponentBase implements OnInit, OnDestroy {
  params: any = {};
  data = {
    userName: 'admin',
    userPwd: '123456'
  };
  /**
   * 初始化
   * @param injector 注入器
   */
  constructor(injector: Injector, private tokenService: TokenService) {
    super(injector);
  }
  /**
   * 页面初始化
   */
  ngOnInit(): void {
    this.params = {
      particles: {
        number: {
          value: 50,
        },
        color: {
          value: '#222222'
        },
        shape: {
          type: 'circle',
          stroke: {
            // width: 0.3
          }
        },
      }
    };
  }
  /**
   * 提交验证
   */
  submit(){
    if (this.data.userName === 'admin' && this.data.userPwd === '123456') {
      this.tokenService.set({
        id: '123',
        name: 'admin',
        token: 'tokenwerosdjfalsjkdf;alsdfkhalsjdfl;ajsdf'
      });
      this.util.router.navigateByUrl('/');
    } else {
      this.util.message.error('请输入正确的用户名和密码');
    }
  }
  /**
   * 页面销毁
   */
  ngOnDestroy(): void {
  }
}
