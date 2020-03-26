<template>
  <div>
    <Modal v-model="state.modalQrcode" width="360" :mask-closable="false" :closable="false">
      <p slot="header" style="font-size: 1rem;text-align:center">
        <span>微信支付</span>
      </p>
      <div style="text-align:center;min-height: 40%;font-size: 1rem;color:#ff0000">
        <div>￥{{Number(state.formValidate.recharge).toFixed(2)}}</div>
        <div>支付完成前,请不要关闭此页面</div>
      </div>
      <div slot="footer">
        <Button type="warning" size="large" long @click="close">关闭</Button>
      </div>
    </Modal>

    <Row type="flex" justify="center" style="padding: 1rem;height: 100%">
      <i-col span="12">
        <i-form
          ref="formValidate"
          :model="state.formValidate"
          :rules="state.ruleValidate"
          :label-width="200"
        >
          <Form-item label="充值" prop="recharge">
            <i-input
              size="large"
              v-model="state.formValidate.recharge"
              placeholder="1元代表1个千投量化点数"
              style="width:20rem"
            ></i-input>
          </Form-item>
          <Form-item label="充值方式">
            <RadioGroup v-model="state.pay" fill="#FF9933" @change="changePay">
              <Radio label="ZHIFUBAO">支付宝</Radio>
              <Radio label="WEIXIN">微信</Radio>
            </RadioGroup>
          </Form-item>
          <Form-item v-if="!(state.pay==='WEIXIN')">
            <Button
              size="large"
              type="primary"
              :loading="state.loadingZhifubao"
              @click="submitAlipay('formValidate')"
              style="width: 20rem"
            >
              <span v-if="!state.loadingZhifubao">支付宝支付</span>
              <span v-else>加载中...</span>
            </Button>
          </Form-item>
          <Form-item v-else>
            <Button
              size="large"
              type="primary"
              :loading="state.loadingWeixin"
              @click="getQrCode('formValidate')"
              style="width: 20rem"
            >
              <span v-if="!state.loadingWeixin">生成二维码</span>
              <span v-else>加载中...</span>
            </Button>
          </Form-item>
        </i-form>
        <div id="payJump"></div>
      </i-col>
    </Row>
  </div>
</template>
<script>
import { reactive } from "@vue/composition-api";
export default {
  setup(props, { root }) {
    const state = reactive({
      modal: false,
      loadingZhifubao: false,
      loadingWeixin: false,
      pay: "ZHIFUBAO",
      poll: "",
      size: 0,
      modalQrcode: false,
      formValidate: {
        recharge: ""
      },
      ruleValidate: {
        recharge: [
          {
            validator: (rule, value, callback) => {
              if (
                value === "" ||
                !/^(([1-9]\d*)(\.\d{1,2})?)$|(0\.0?([1-9]\d?))$/.test(value)
              ) {
                callback(new Error("请输入合法金额,格式如:1或者0.1或者0.01"));
              } else {
                if (value > 1000000) {
                  callback(new Error("单次充值限额为1000000"));
                } else {
                  callback();
                }
              }
            },
            trigger: "blur"
          }
        ]
      }
    });
    const getPoint = () => {};

    //        关闭模态框
    const close = () => {
      //          取消轮询
      clearInterval(this.poll);
      //          关闭模态窗口
      state.modalQrcode = false;
    };
    //        转换支付方式
    const changePay = pay => {
      if (pay === "WEIXIN") {
        state.formValidate.isQrCode = false;
      }
    };
    //      微信支付
    const getQrCode = name => {
      root.$refs[name].validate(valid => {
        if (valid) {
          state.loadingWeixin = true;
        }
      });
    };
    const submitAlipay = name => {
      root.$refs[name].validate(valid => {
        if (valid) {
          state.loadingZhifubao = true;
        }
      });
    };
    return {
      state,
      submitAlipay,
      getQrCode,
      changePay,
      close,
      getPoint
    };
  }
};
</script>
<style>
</style>
