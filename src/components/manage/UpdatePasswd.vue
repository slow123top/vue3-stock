<template>
  <Row type="flex" justify="center" style="padding: 1rem;height: 100%">
    <i-col span="10">
      <Row type="flex" justify="center">
        <i-col span="24" v-if="state.verifySucc==='confirm'">
          <!--<i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">-->
          <!--<Form-item label="验证工具">-->
          <i-select size="large" v-model="state.oldTool" placeholder="选择当前验证工具">
            <i-option
              v-for="(item,index) in state.verifyTool"
              :value="item.value"
              :key="index"
            >{{item.label}}</i-option>
          </i-select>
          <!--</Form-item>-->
          <!--<Form-item label="验证码">-->
          <i-input
            size="large"
            v-model="state.verifyCode"
            placeholder="请输入验证码"
            style="width: 50%;margin-top: 1rem"
          ></i-input>
          <Button
            size="large"
            type="primary"
            style="width:7rem;float:right;margin-top: 1rem"
            @click="getModiQrCode"
            v-if="!state.verifyCodeLoding"
          >发送验证码</Button>
          <Button
            size="large"
            type="primary"
            :disabled="true"
            style="width:7rem;float:right;margin-top: 1rem"
            v-else
          >重新发送({{state.verifyCodeLodingTime}})</Button>
          <!--</Form-item>-->
          <!--<Form-item>-->
          <Button size="large" long type="primary" @click="verify" style="margin-top: 1rem">下一步</Button>
          <!--</Form-item>-->
          <!--</i-form>-->
        </i-col>
        <i-col span="24" v-else-if="state.verifySucc==='confirmNew'">
          <i-form
            ref="formValidate"
            :model="state.formValidate"
            :rules="state.ruleValidate"
            :label-width="100"
          >
            <Form-item label="新密码" prop="newPasswd">
              <i-input
                size="large"
                type="password"
                v-model="state.formValidate.newPasswd"
                placeholder="请输入新密码"
                :icon="state.iconPasswd"
              ></i-input>
            </Form-item>
            <Form-item label="确认密码" prop="confirmPasswd" :lable-width="150">
              <i-input
                size="large"
                type="password"
                v-model="state.formValidate.confirmPasswd"
                placeholder="请再次输入新密码"
                :icon="state.iconPasswdCheck"
              ></i-input>
            </Form-item>
            <Form-item>
              <Button size="large" long type="primary" @click="modifyPasswd('formValidate')">确认修改</Button>
            </Form-item>
          </i-form>
        </i-col>
        <i-col span="24" v-else>
          <p style="text-align: center;font-size: 2rem">
            <Icon type="checkmark-circled" color="#3eb94e"></Icon>&nbsp;密码修改成功
          </p>
        </i-col>
      </Row>
    </i-col>
  </Row>
</template>
<script>
import { reactive } from "@vue/composition-api";
export default {
  setup(props, { root }) {
    const state = reactive({
      // 验证密码和确认密码
      validatePasswd: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("密码不能为空"));
          state.iconPasswd = "";
        } else if (
          !/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/.test(
            value
          )
        ) {
          callback(new Error("密码支持数字和字母和特殊符号至少两种"));
          state.iconPasswd = "";
        } else if (value.length < 6 || value.length > 20) {
          callback(new Error("密码6-20位"));
          state.iconPasswd = "";
        } else {
          if (value !== "" && this.formValidate.confirmPasswd !== "") {
            // 对第二个密码框单独验证
            root.$refs.formValidate.validateField("confirmPasswd");
          }
          callback();
          state.iconPasswd = "checkmark-circled";
        }
      },
      validatePassCheck: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
          this.iconPasswdCheck = "";
        } else if (value !== state.formValidate.newPasswd) {
          callback(new Error("两次输入密码不一致"));
          state.iconPasswdCheck = "";
        } else {
          callback();
          state.iconPasswdCheck = "checkmark-circled";
        }
      },
      setval: "",
      modal: false,
      verifyTool: [],
      isBindOrEmail: false,
      verifyCodeLoding: false,
      verifyCodeLodingTime: 60,
      verifyCode: "",
      user: {},
      iconPasswd: "",
      iconPasswdCheck: "",
      formValidate: {
        newPasswd: "",
        confirmPasswd: ""
      },
      oldTool: "",
      verifySucc: "confirm",
      ruleValidate: {
        newPasswd: [{ validator: state.validatePasswd, trigger: "blur" }],
        confirmPasswd: [{ validator: state.validatePassCheck, trigger: "blur" }]
      }
    });
    const getModiQrCode = () => {
      state.verifyCodeLoding = true;
      state.setval = setInterval(function() {
        if (state.verifyCodeLodingTime === 1) {
          state.verifyCodeLoding = false;
          state.verifyCodeLodingTime = 60;
          clearInterval(state.setval);
        } else {
          state.verifyCodeLoding = true;
          state.verifyCodeLodingTime--;
        }
      }, 1000);
    };

    return {
      state,
      getModiQrCode
    };
  }
};
</script>
<style>
.ivu-input-wrapper-large .ivu-input-icon {
  color: #3eb94e;
}
</style>
