<template>
  <div class="forget-password" style="height: 45rem">
    <Row type="flex" justify="center">
      <i-col span="24" style="text-align: center;padding: 1rem 0">
        <h2>找回密码</h2>
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="12" style="padding: 1rem 0">
        <Steps :current="state.currentStep" style="margin: auto">
          <Step title="确认账号"></Step>
          <Step title="安全验证"></Step>
          <Step title="重置密码"></Step>
        </Steps>
      </i-col>
    </Row>
    <i-form
      ref="formValidate"
      :model="state.formValidate"
      :rules="state.ruleValidate"
      :label-width="0"
    >
      <Row type="flex" justify="start" v-if="state.isTrue==='confirm'">
        <i-col span="4" offset="6">
          <Form-item prop="phoneOrEmail">
            <i-input size="large" v-model="state.formValidate.phoneOrEmail" placeholder="请输入邮箱或手机"></i-input>
          </Form-item>
          <div id="slide-wrapper">
            <input type="hidden" value id="lockable" />
            <div id="slider">
              <span id="label">
                <!--<Icon type="arrow-right-c" :size="20" style="margin-top: .5rem"></Icon>-->
              </span>
              <span id="lableTip">拖动滑块验证</span>
            </div>
          </div>
          <Form-item>
            <Button long type="primary" @click="confirmAccount" :disabled="state.loginDisabled">下一步</Button>
          </Form-item>
        </i-col>
      </Row>
      <Row type="flex" justify="start" v-else-if="state.isTrue==='verify'">
        <i-col span="4" offset="6">
          <span>{{state.validateType}}</span>
          <span>{{state.errorPhoneOrEmail}}</span>

          <Form-item>
            <i-input size="large" v-model="state.verifyCode" placeholder="请输入验证码" style="width:50%"></i-input>
            <Button
              size="large"
              style="width:30%;float:right"
              @click="getQrCode"
              v-if="!state.verifyCodeLoding"
            >获取验证码</Button>
            <Button
              size="large"
              :disabled="true"
              style="width:7rem;float:right"
              v-else
            >{{state.verifyCodeLodingTime}}s</Button>
          </Form-item>
          <Form-item>
            <Button type="primary" long @click="safeValidate">下一步</Button>
          </Form-item>
        </i-col>
      </Row>
      <Row type="flex" justify="start" v-else-if="state.isTrue==='reset'">
        <i-col span="4" offset="6">
          <Form-item prop="passwd">
            <i-input
              type="password"
              size="large"
              v-model="state.formValidate.passwd"
              placeholder="请输入新密码"
            ></i-input>
          </Form-item>
          <Form-item prop="passwdCheck">
            <i-input
              type="password"
              size="large"
              v-model="state.formValidate.passwdCheck"
              placeholder="确认密码"
            ></i-input>
          </Form-item>
          <Form-item>
            <Button type="primary" long @click="resetPasswd">确定</Button>
          </Form-item>
        </i-col>
      </Row>
      <Row type="flex" justify="center" v-else>
        <i-col span="12" style="text-align: center">
          <p style="text-align: center;font-size: 1rem">恭喜,千投量化网{{state.errorPhoneOrEmail}}重置密码成功</p>
          <Button type="primary" @click="midiaLogin">前往登录</Button>
        </i-col>
      </Row>
    </i-form>
  </div>
</template>
<script>
import { reactive, computed } from "@vue/composition-api";
export default {
  setup(props, { root }) {
    const state = reactive({
      loginDisabled: true,
      verifyCodeLoding: false,
      verifyCodeId: "",
      verifyCode: "",
      verifyCodeLodingTime: 60,
      currentStep: 0,
      formValidate: {
        phoneOrEmail: "",
        passwd: "",
        passwdCheck: "",
        verifyCode: ""
      },
      ruleValidate: {
        phoneOrEmail: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("邮箱或手机不能为空"));
                state.iconMailTel = "";
              } else if (
                !/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)|(^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$)/.test(
                  value
                )
              ) {
                callback(new Error("邮箱或者手机格式不正确"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        passwd: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("新密码不能为空"));
              } else if (
                !/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/.test(
                  value
                )
              ) {
                callback(new Error("密码支持数字和字母和特殊符号至少两种"));
              } else if (value.length < 6 || value.length > 20) {
                callback(new Error("密码6-20位"));
              } else {
                if (value !== "" && state.formValidate.passwdCheck !== "") {
                  // 对第二个密码框单独验证
                  state.$refs.formValidate.validateField("passwdCheck");
                }
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        passwdCheck: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("新密码不能为空"));
              } else if (
                !/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/.test(
                  value
                )
              ) {
                callback(new Error("密码支持数字和字母和特殊符号至少两种"));
              } else if (value.length < 6 || value.length > 20) {
                callback(new Error("密码6-20位"));
              } else {
                if (value !== "" && state.formValidate.passwdCheck !== "") {
                  // 对第二个密码框单独验证
                  state.$refs.formValidate.validateField("passwdCheck");
                }
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      },
      //        验证方式  手机或者邮箱
      validateType: "",
      img: "",
      //        切换条件
      isTrue: "confirm",
      errorPhoneOrEmail: computed(() => {
        return (
          state.formValidate.phoneOrEmail.substring(0, 3) +
          "******" +
          state.formValidate.phoneOrEmail.substring(9)
        );
      })
    });
    //        确认账号
    const confirmAccount = () => {};
    //      安全验证
    //      首先获取验证码
    const getQrCode = () => {};
    //      然后进行验证
    const safeValidate = () => {};
    //最后找回密码
    const resetPasswd = () => {};
    //重置后可以直接登录
    const midiaLogin = () => {
      root.$router.push("/login");
    };
    //      获取图片验证码
    const getImgQrCode = () => {
      state.img = "/image/getimagecode?random=" + Math.random();
    };
    return {
      state,
      getImgQrCode,
      midiaLogin,
      resetPasswd,
      safeValidate,
      getQrCode,
      confirmAccount
    };
  }
};
</script>
<style scoped>
#slide-wrapper {
  width: 100%;
  position: relative;
  background: #ecf0f1;
  margin: 1rem auto;
}

#slider {
  padding: 0.5rem 1rem;
  position: relative;
  border-radius: 2px;
  background-color: #fdeb9c;
  overflow: hidden;
  text-align: center;
}

#slider.success {
  background-color: #e5ee9f;
}

#label {
  width: 2rem;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #e67e22;
  background-image: url("../../assets/img/jiantou.png");
  z-index: 999;
  cursor: pointer;
}
</style>
