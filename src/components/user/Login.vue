<template>
  <div class="login">
    <Row type="flex" justify="center" :style="state.style">
      <i-col :xs="4" :sm="4" :md="5" :lg="4" style>
        <Card>
          <p slot="title" style="text-align: center;font-size: 1rem">登录</p>
          <i-form
            ref="formValidate"
            :model="state.formValidate"
            :rules="state.ruleValidate"
            :label-width="0"
          >
            <Form-item prop="mailTel">
              <i-input
                size="large"
                v-model="state.formValidate.mailTel"
                placeholder="邮箱或手机"
                @on-enter="handleSubmit('formValidate')"
                @on-change="mailTelChange"
              >
                <span slot="prepend">
                  <Icon type="ios-person"></Icon>
                </span>
              </i-input>
            </Form-item>
            <Form-item prop="passwd">
              <i-input
                size="large"
                type="password"
                v-model="state.formValidate.passwd"
                placeholder="请输入密码"
                @on-enter="handleSubmit('formValidate')"
              >
                <span slot="prepend">
                  <Icon type="ios-lock"></Icon>
                </span>
              </i-input>
            </Form-item>
            <div id="slide-wrapper">
              <input type="hidden" value id="lockable" />
              <div id="slider">
                <span id="label"></span>
                <span id="lableTip">拖动滑块验证</span>
              </div>
            </div>
            <Form-item style="margin-bottom: 0;vertical-align: middle">
              <Button
                size="large"
                type="primary"
                :loading="state.logining"
                @click="handleSubmit('formValidate')"
                long
                :disabled="state.loginDisabled"
              >
                <span v-if="!state.logining">登录</span>
                <span v-else>登录中...</span>
              </Button>
            </Form-item>
            <Form-item>
              <span>
                没有账户？立即
                <router-link to="/register">注册</router-link>
              </span>
              <router-link target="_blank" to="/forgetpassword" style="float: right">忘记密码?</router-link>
            </Form-item>
            <Form-item label="其他方式登录">
              <a :href="state.weixinImg">
                <img src="../../assets/img/wechat.png" alt />
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
//    import Promise from 'promise'
export default {
  setup(props, { root }) {
    const state = reactive({
      loginDisabled: true,
      weixinImg: "/user/login/wechat",
      logining: false,
      iconQrCode: "",
      style: {
        height: "50rem",
        padding: "10rem 0"
      },
      img: "",
      formValidate: {
        name: "",
        mailTel: "",
        passwd: "",
        qrCode: ""
      },
      ruleValidate: {
        mailTel: [
          { required: true, message: "邮箱或手机不能为空", trigger: "blur" }
        ],
        passwd: [{ required: true, message: "密码不能为空", trigger: "blur" }],
        qrCode: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("验证码不能为空"));
                state.iconQrCode = "";
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    });
    const validateLogin = (name, slider) => {
      root.$refs[name].validate(valid => {
        if (!valid) {
          state.loginDisabled = true;
          slider.reset();
        } else {
          state.loginDisabled = false;
        }
      });
    };
    //验证成功函数
    const handleSubmit = name => {
      root.$refs[name].validate(valid => {
        if (valid) {
          state.logning = true;
          // 提交
        }
      });
    };
    const getQrCode = () => {
      state.img = "/image/getimagecode?random=" + Math.random();
    };
    const mailTelChange = () => {
      //          为了安全  只要邮箱或者手机改变  密码就要清空
      state.formValidate.passwd = "";
    };
    return {
      state,
      mailTelChange,
      handleSubmit,
      getQrCode,
      validateLogin
    };
  }
};
</script>
<style lang="scss" rel="stylesheet" scoped>
.login {
  background-image: url("../../assets/img/loginbg.jpg");
  background-repeat: no-repeat;
}

.ivu-i-input-wrapper-large .ivu-i-input-icon {
  /*color: #3eb94e;*/
}

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
