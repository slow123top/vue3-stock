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
            <Form-item label="邮箱" prop="bindEmail">
              <i-input size="large" v-model="state.formValidate.bindEmail" placeholder="请输入要绑定的邮箱"></i-input>
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
            &nbsp;恭喜,成功绑定邮箱{{state.hasBind}}到千投量化网
          </p>
        </i-col>
      </Row>
    </i-col>
    <!--修改手机号-->
    <i-col span="10" v-else>
      <Row type="flex" justify="center">
        <i-col span="24" v-if="state.verifySucc==='confirm'">
          <!--<Tooltip content="请选择验证方式" placement="left">-->
          <i-select size="large" v-model="state.oldTool" placeholder="选择当前验证方式">
            <i-option
              v-for="(item,index) in state.verifyTool"
              :value="item.value"
              :key="index"
            >{{item.label}}</i-option>
          </i-select>
          <!--</Tooltip>-->
          <i-input
            size="large"
            v-model="state.verifyCode"
            placeholder="请输入验证码"
            style="width: 50%;margin-top: 1rem"
          ></i-input>
          <Button
            size="large"
            type="primary"
            style="width:7rem;margin-top:1rem;float:right"
            @click="getModiQrCode"
            v-if="!state.verifyCodeLoding"
          >发送验证码</Button>
          <Button
            size="large"
            type="primary"
            :disabled="true"
            style="width:7rem;margin-top:1rem;float:right"
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
            <Form-item label="邮箱" prop="newEmail">
              <i-input size="large" v-model="state.formValidate1.newEmail" placeholder="请输入新邮箱"></i-input>
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
        </i-col>
        <i-col span="24" v-else>
          <p style="text-align: center;font-size: 2rem">
            <Icon type="checkmark-circled" color="#3eb94e"></Icon>
            &nbsp;恭喜,成功修改邮箱为{{state.changeEmail}}
          </p>
        </i-col>
      </Row>
    </i-col>
  </Row>
</template>
<script>
import { changeEmail } from "../../utils/tools";
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
      formValidate: {
        bindEmail: ""
      },
      formValidate1: {
        newEmail: ""
      },
      verifySucc: "confirm",
      bindConfirm: "fail",
      ruleValidate: {
        bindEmail: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("邮箱不能为空"));
                //          (^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)|
              } else if (
                !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)
              ) {
                callback(new Error("邮箱格式不正确"));
              }
            },
            trigger: "blur"
          }
        ]
      },
      ruleValidate1: {
        newEmail: [
          { required: true, message: "请填写邮箱", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" }
        ]
      },
      hasBind: computed(() => {
        return changeEmail(state.formValidate.bindEmail);
      }),
      changeEmail: computed(() => {
        return changeEmail(state.formValidate1.newEmail);
      }),
      verifyTool: computed(() => {
        if (state.user.phone !== "" && state.user.email !== "") {
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
              value: state.user.realEmail,
              label: state.user.email
            }
          ];
        }
      })
    });
    const getQrCode = name => {
      //          向绑定的邮箱发送验证码
      state.$refs[name].validate(valid => {
        if (valid) {
          root.verifyCodeLoding = true;
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
    const bind = name => {
      //          立即绑定
      root.$refs[name].validate(valid => {
        if (valid) {
          if (state.verifyCode === "") {
            // that.$Message.error("请输入验证码");
          }
        }
      });
    };
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
    const verify = () => {
      const that = this;
      if (that.verifyCode === "") {
        // that.$Message.error("请输入验证码");
      }
    };
    const getNewQrCode = name => {
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
    const modeify = () => {
      // root.$refs[name].validate(valid => {
      // });
    };
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
