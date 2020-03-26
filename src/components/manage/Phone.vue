<template>
  <Row type="flex" justify="center" style="padding: 1rem;height: 100%">
    <i-col span="10" v-if="!state.isBind">
      <Row type="flex" justify="center">
        <i-col span="24" v-if="state.bindConfirm==='fail'">
          <i-form
            ref="formValidate"
            :model="state.formValidate"
            :rules="state.ruleValidate"
            :label-width="100"
          >
            <Form-item label="手机号" prop="bindPhone">
              <i-input size="large" v-model="state.formValidate.bindPhone" placeholder="请输入要绑定的手机号"></i-input>
            </Form-item>
            <Form-item label="验证码">
              <i-input
                size="large"
                v-model="state.verifyCode"
                placeholder="请输入验证码"
                style="width: 50%"
              ></i-input>
              <Button
                size="large"
                type="primary"
                style="width:7rem;float:right"
                @click="getQrCode('formValidate')"
                v-if="!state.verifyCodeLoding"
              >发送验证码</Button>
              <Button
                size="large"
                type="primary"
                :disabled="true"
                style="width:7rem;float:right"
                v-else
              >重新发送({{state.verifyCodeLodingTime}})</Button>
            </Form-item>
            <Form-item>
              <Button size="large" long type="primary" @click="bind('formValidate')">立即绑定</Button>
            </Form-item>
          </i-form>
        </i-col>
        <i-col span="24" v-else>
          <p style="text-align: center;font-size: 2rem">
            <Icon type="checkmark-circled" color="#3eb94e"></Icon>
            恭喜,成功绑定手机{{state.hasBind}}到千投量化网
          </p>
        </i-col>
      </Row>
    </i-col>
    <!--修改手机号-->
    <i-col span="10" v-else>
      <Row type="flex" justify="center">
        <i-col span="24" v-if="state.verifySucc==='confirm'">
          <i-select size="large" v-model="state.oldTool" placeholder="选择当前验证方式">
            <i-option
              v-for="item in state.verifyTool"
              :value="item.value"
              :key="item.label"
            >{{item.label}}</i-option>
          </i-select>

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
          <Button size="large" long type="primary" @click="verify" style="margin-top: 1rem">下一步</Button>
        </i-col>
        <!--新手机号-->
        <i-col span="24" v-else-if="state.verifySucc==='confirmNew'">
          <i-form
            ref="formValidate1"
            :model="state.formValidate1"
            :rules="state.ruleValidate1"
            :label-width="100"
          >
            <Form-item label="手机号" prop="newPhone">
              <i-input size="large" v-model="state.formValidate1.newPhone" placeholder="请输入新手机号"></i-input>
            </Form-item>
            <Form-item label="验证码">
              <i-input
                size="large"
                v-model="state.verifyCode"
                placeholder="请输入验证码"
                style="width: 50%"
              ></i-input>
              <Button
                size="large"
                type="primary"
                style="width:7rem;float:right"
                @click="getNewQrCode('formValidate1')"
                v-if="!state.verifyCodeLoding"
              >发送验证码</Button>
              <Button
                size="large"
                type="primary"
                :disabled="true"
                style="width:7rem;float:right"
                v-else
              >重新发送({{state.verifyCodeLodingTime}})</Button>
            </Form-item>
            <Form-item>
              <Button size="large" long type="primary" @click="modeify('formValidate1')">确认修改</Button>
            </Form-item>
          </i-form>
          <!--</i-form>-->
        </i-col>
        <i-col span="24" v-else>
          <p style="text-align: center;font-size: 2rem">
            <Icon type="checkmark-circled" color="#3eb94e"></Icon>
            &nbsp;恭喜,成功修改手机号为{{state.changePhone}}
          </p>
        </i-col>
      </Row>
    </i-col>
  </Row>
</template>
<script>
import { changePhone } from "../../utils/tools";
import { reactive, computed } from "@vue/composition-api";
export default {
  setup(props, { root }) {
    const state = reactive({
      modal: false,
      setval: "",
      user: {},
      oldTool: "",
      isBind: false,
      verifyCodeLoding: false,
      verifyCodeLodingTime: 60,
      verifyCode: "",
      verifyCodeId: "",
      formValidate0: {},
      ruleValidate0: {},
      formValidate: {
        bindPhone: ""
      },
      formValidate1: {
        newPhone: ""
      },
      ruleValidate1: {
        newPhone: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("手机不能为空"));
              } else if (
                !/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(
                  value
                )
              ) {
                callback(new Error("手机格式不正确"));
              }
            },
            trigger: "blur"
          }
        ]
      },
      modi: false,
      bindConfirm: "fail",
      verifySucc: "confirm",
      ruleValidate: {
        bindPhone: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("手机不能为空"));
              } else if (
                !/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(
                  value
                )
              ) {
                callback(new Error("手机格式不正确"));
              }
            },
            trigger: "blur"
          }
        ]
      },
      hasBind: computed(() => {
        return changePhone(state.formValidate.bindPhone);
      }),
      changePhone: computed(() => {
        return changePhone(state.formValidate1.newPhone);
      }),
      verifyTool: computed(() => {
        if (state.user.email !== "" && state.user.phone !== "") {
          return [
            {
              value: state.user.realPhone,
              label: state.user.phone
            },
            {
              value: state.user.realEmail,
              label: state.user.email
            }
          ];
        } else {
          return [
            {
              value: state.user.realPhone,
              label: state.user.phone
            }
          ];
        }
      })
    });
    const getQrCode = name => {
      //          向绑定的手机发送验证码
      root.$refs[name].validate(valid => {
        if (valid) {
          state.verifyCodeLoding = true;
          state.setval = setInterval(function() {
            if (state.verifyCodeLodingTime === 1) {
              clearInterval(state.setval);
              state.verifyCodeLoding = false;
              state.verifyCodeLodingTime = 60;
            } else {
              state.verifyCodeLoding = true;
              state.verifyCodeLodingTime--;
            }
          }, 1000);
        }
      });
    };
    const bind = () => {};
    //      修改手机号先发送验证码
    const getModiQrCode = () => {
      state.verifyCodeLoding = true;
      state.setval = setInterval(function() {
        if (state.verifyCodeLodingTime === 1) {
          clearInterval(state.setval);
          state.verifyCodeLoding = false;
          state.verifyCodeLodingTime = 60;
        } else {
          state.verifyCodeLoding = true;
          state.verifyCodeLodingTime--;
        }
      }, 1000);
    };
    //      验证原来验证方式
    const verify = () => {};
    //      然后验证新的
    const getNewQrCode = name => {
      const that = this;
      root.$refs[name].validate(valid => {
        if (valid) {
          state.verifyCodeLoding = true;
          state.setval = setInterval(function() {
            if (that.verifyCodeLodingTime === 1) {
              clearInterval(state.setval);
              state.verifyCodeLoding = false;
              state.verifyCodeLodingTime = 60;
            } else {
              state.verifyCodeLoding = true;
              state.verifyCodeLodingTime--;
            }
          }, 1000);
        }
      });
    };
    const modeify = () => {};
    return {
      state,
      modeify,
      getNewQrCode,
      verify,
      getModiQrCode,
      bind,
      getQrCode
    };
  }
};
</script>
<style>
.ivu-input-wrapper-large .ivu-input-icon {
  color: #3eb94e;
}
</style>
