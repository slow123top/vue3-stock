<template>
  <div class="register">
    <Row type="flex" justify="center" :style="state.style">
      <i-col span="4">
        <Card style="font-size:1rem">
          <p slot="title" style="text-align: center;font-size: 1rem">注册</p>
          <i-form
            ref="formValidate"
            :model="state.formValidate"
            :rules="state.ruleValidate"
            :label-width="0"
            style="font-size:1rem"
          >
            <Form-item prop="name" style="vertical-align: middle">
              <i-input
                size="large"
                v-model="state.formValidate.name"
                placeholder="昵称,长度为1-20"
                :icon="state.iconNickName"
                :maxlength="20"
                @on-enter="handleSubmit('formValidate')"
              ></i-input>
            </Form-item>
            <Form-item prop="mailTel">
              <i-input
                size="large"
                v-model="state.formValidate.mailTel"
                placeholder="邮箱或手机"
                :icon="state.iconMailTel"
                @on-enter="handleSubmit('formValidate')"
              ></i-input>
            </Form-item>
            <Form-item prop="qrCode" v-if="state.qrCodeDis">
              <i-input
                size="large"
                v-model="state.formValidate.qrCode"
                placeholder="请输入验证码"
                style="width:50%"
                :icon="state.iconQrCode"
                @on-enter="handleSubmit('formValidate')"
              ></i-input>
              <Button
                size="large"
                type="primary"
                style="width:7rem;float:right"
                @click="getQrCode"
                v-if="!state.verifyCodeLoding"
              >获取验证码</Button>
              <Button
                size="large"
                type="primary"
                :disabled="true"
                style="width:7rem;float:right"
                v-else
              >{{state.verifyCodeLodingTime}}s</Button>
            </Form-item>
            <Form-item prop="passwd">
              <i-input
                size="large"
                type="password"
                v-model="state.formValidate.passwd"
                placeholder="密码（6-20位，支持字母、数字和特殊符号至少两种）"
                :icon="iconPasswd"
                @on-enter="handleSubmit('formValidate')"
              ></i-input>
            </Form-item>
            <Form-item prop="passwdCheck">
              <i-input
                size="large"
                type="password"
                v-model="state.formValidate.passwdCheck"
                placeholder="确认密码"
                :icon="state.iconPasswdCheck"
                @on-enter="handleSubmit('formValidate')"
              ></i-input>
            </Form-item>
            <Form-item style="margin-bottom: 0">
              <Button size="large" type="primary" @click="handleSubmit('formValidate')" long>注册</Button>
            </Form-item>
            <Form-item>
              <span style="margin-left: 4rem">
                已有账户？立即
                <router-link to="/login">登录</router-link>
              </span>
            </Form-item>
            <Form-item label="其他方式登录">
              <!--<a href="#"><img src="../../img/qq1.png" alt=""></a>-->
              <a :href="state.weixinImg">
                <img src="../../assets/img/wechat.png" alt="微信登录" />
              </a>
            </Form-item>
          </i-form>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
import { reactive } from "@vue/composition-api";
export default {
  setup(props, { root }) {
    const state = reactive({
      weixinImg: +"/user/login/wechat",
      weixinImgSrc: +"/img/wechat.png",
      iconNickName: "",
      iconPasswd: "",
      iconPasswdCheck: "",
      iconMailTel: "",
      iconQrCode: "",
      verifyCodeId: "",
      qrCodeDis: false,
      verifyCodeLoding: false,
      verifyCodeLodingTime: 60,
      style: {
        "min-height": "50rem",
        padding: "5rem 0"
      },
      img: "",
      formValidate: {
        name: "",
        mailTel: "",
        qrCode: "",
        date: "",
        time: "",
        desc: "",
        passwd: "",
        passwdCheck: "",
        verificationCode: ""
      },
      ruleValidate: {
        name: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("昵称不能为空"));
                state.iconNickName = "";
              }
            },
            trigger: "blur"
          }
        ],
        passwd: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("密码不能为空"));
                state.iconPasswd = "";
              } else if (
                !/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/.test(
                  value
                )
              ) {
                callback(new Error("密码支持数字和字母和特殊符号至少2种"));
                state.iconPasswd = "";
              } else if (value.length < 6 || value.length > 20) {
                callback(new Error("密码6-20位"));
                state.iconPasswd = "";
              } else {
                if (value !== "" && this.formValidate.passwdCheck !== "") {
                  // 对第二个密码框单独验证
                  root.$refs.formValidate.validateField("passwdCheck");
                }
                callback();
                state.iconPasswd = "checkmark-circled";
              }
            },
            trigger: "blur"
          }
        ],
        passwdCheck: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
                state.iconPasswdCheck = "";
              } else if (value !== this.formValidate.passwd) {
                callback(new Error("两次输入密码不一致"));
                state.iconPasswdCheck = "";
              } else {
                callback();
                state.iconPasswdCheck = "checkmark-circled";
              }
            },
            trigger: "blur"
          }
        ],
        qrCode: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("验证码不能为空"));
                state.iconQrCode = "";
              }
            },
            trigger: "blur"
          }
        ],
        mailTel: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("邮箱或手机不能为空"));
                state.iconMailTel = "";
                state.qrCodeDis = false;
              } else if (
                !/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)|(^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$)/.test(
                  value
                )
              ) {
                callback(new Error("邮箱或者手机格式不正确"));
                state.qrCodeDis = false;
                state.iconMailTel = "";
              }
            },
            trigger: "blur"
          }
        ]
      }
    });
    const handleSubmit = () => {};
    const getQrCode = () => {};
    return {
      state,
      handleSubmit,
      getQrCode
    };
  }
};
</script>
<style lang="scss" rel="stylesheet">
.register {
  background-image: url("../../assets/img/loginbg.jpg");
  background-repeat: no-repeat;
}

.ivu-input-wrapper-large .ivu-input-icon {
  color: #3eb94e;
}

/*.login{*/

/*min-height: 40rem;*/

/*}*/
</style>
