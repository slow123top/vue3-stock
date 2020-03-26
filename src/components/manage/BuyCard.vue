<template>
  <div>
    <Modal :mask-closable="false" v-model="state.modalBuy" title="提示" @on-ok="okBuy" width="600">
      <p style="font-size: 1rem">您将消费{{state.price.actualPrice}}点数，是否继续？</p>
    </Modal>
    <Row type="flex" justify="center" style="padding: 1rem 0;height: 100%">
      <i-col span="12">
        <i-form ref="formValidate" :label-width="100">
          <Form-item label="回测卡种类" prop="recharge">
            <RadioGroup type="button" v-model="state.cardNumber" @change="changeCard">
              <Radio
                v-for="card in state.cardInfo"
                :label="card.cardNumber"
                :key="card.cardName"
                :disabled="card.disabled"
              >{{card.cardName}}</Radio>
            </RadioGroup>
          </Form-item>
          <Form-item label="回测卡信息">
            <p style="font-size: 0.875rem;color: #ff0000">{{state.help}}</p>
          </Form-item>
          <Form-item label="购买量">
            <RadioGroup size="small" type="button" v-model="state.amount" @change="changeAmount">
              <Radio
                :label="item.amount"
                v-for="item in state.buyCardAmount"
                :key="item.selectName"
              >
                <span v-if="!item.isSelected" class="r-month">{{item.notSelectName}}</span>
                <span class="r-month" v-else>{{item.selectName}}</span>
              </Radio>
              <Tooltip
                effect="light"
                v-for="item in state.buyCardAmountDiscount"
                :content="item.content"
                placement="top"
                :key="item.content"
              >
                <Radio :label="item.amount">
                  <span v-if="!item.isSelected" class="r-month">
                    {{item.notSelectName}}
                    <img src="../../assets/img/discount(2).png" alt="折扣" />
                  </span>
                  <span class="r-month" v-else>
                    {{item.selectName}}
                    <img src="../../assets/img/discount(2).png" alt="折扣" />
                  </span>
                </Radio>
              </Tooltip>
            </RadioGroup>
          </Form-item>
          <Form-item class="demo-spin-col">
            <Spin fix v-if="state.loading" style="text-align: left">正在计算价格...</Spin>消费点数：
            <span
              style="font-size: 1rem;color: #FF0000;font-weight: bold"
            >{{state.price.actualPrice}}点</span>
          </Form-item>
          <Form-item>
            <Button size="large" type="primary" @click="buyCard">
              <span v-if="state.buy">立即购买</span>
              <span v-else>续费</span>
            </Button>
            <router-link to="/personalInfo/recharge">点数不够？立即充值</router-link>
          </Form-item>
        </i-form>
      </i-col>
    </Row>
  </div>
</template>
<script>
import { reactive, computed } from "@vue/composition-api";
export default {
  setup() {
    const state = reactive({
      buy: true,
      modal: false,
      modalBuy: false,
      fillPointMessage: "",
      cardNumber: "",
      cardIndex: 0,
      amount: "1",
      price: "",
      loading: false,
      myCards: [],
      cardInfo: [],
      buyCardAmount: [
        {
          amount: "1",
          notSelectName: "1",
          selectName: "1个月",
          isSelected: false
        },
        {
          amount: "2",
          notSelectName: "2",
          selectName: "2个月",
          isSelected: false
        },
        {
          amount: "3",
          notSelectName: "3",
          selectName: "3个月",
          isSelected: false
        },
        {
          amount: "4",
          notSelectName: "4",
          selectName: "4个月",
          isSelected: false
        },
        {
          amount: "5",
          notSelectName: "5",
          selectName: "5个月",
          isSelected: false
        },
        {
          amount: "6",
          notSelectName: "6",
          selectName: "6个月",
          isSelected: false
        },
        {
          amount: "7",
          notSelectName: "7",
          selectName: "7个月",
          isSelected: false
        },
        {
          amount: "8",
          notSelectName: "8",
          selectName: "8个月",
          isSelected: false
        },
        {
          amount: "9",
          notSelectName: "9",
          selectName: "9个月",
          isSelected: false
        }
      ],
      buyCardAmountDiscount: [
        {
          amount: "10",
          content: "买满10个月回测卡，立享官网价格9.5折",
          notSelectName: "10",
          selectName: "10个月",
          isSelected: false
        },
        {
          amount: "11",
          content: "买满11个月回测卡，立享官网价格9折",
          notSelectName: "11",
          selectName: "11个月",
          isSelected: false
        },
        {
          amount: "12",
          content: "买满1年回测卡，立享官网价格8.5折",
          notSelectName: "1年",
          selectName: "1年",
          isSelected: false
        },
        {
          amount: "24",
          content: "买满2年回测卡，立享官网价格7折",
          notSelectName: "2年",
          selectName: "2年",
          isSelected: false
        },
        {
          amount: "36",
          content: "买满3年回测卡，立享官网价格5折",
          notSelectName: "3年",
          selectName: "3年",
          isSelected: false
        }
      ],
      help: computed(
        () =>
          state.cardInfo.length !== 0 &&
          state.cardInfo[state.cardIndex].cardDescription
      )
    });
    const changeCard = para => {
      //          每次改变卡号的时候  判断是续费还是立即购买
      let type = Number(para.split("-")[0]);
      let number = Number(para.split("-")[1]);
      if (state.myCards.length !== 0) {
        for (let i = 0; i < state.myCards.length; i++) {
          if (
            state.myCards[i].type === type &&
            state.myCards[i].cardNumber === number
          ) {
            state.buy = false;
          } else {
            state.buy = true;
          }
        }
      }

      //        加载中
      state.loading = true;
      //        获取当前点卡信息
      state.cardInfo.forEach(function(item, index) {
        if (item.cardNumber === para) {
          state.cardIndex = index;
        }
      });
    };
    const changeAmount = () => {
      state.loading = true;
      for (let i = 0; i < state.buyCardAmount.length; i++) {
        state.buyCardAmount[i].isSelected === true &&
          (state.buyCardAmount[i].isSelected = false);
      }
      for (let i = 0; i < state.buyCardAmountDiscount.length; i++) {
        state.buyCardAmountDiscount[i].isSelected === true &&
          (state.buyCardAmountDiscount[i].isSelected = false);
      }
      if (state.amount === "12") {
        state.buyCardAmountDiscount[2].isSelected = true;
      } else if (state.amount === "24") {
        state.buyCardAmountDiscount[3].isSelected = true;
      } else if (state.amount === "36") {
        state.buyCardAmountDiscount[4].isSelected = true;
      } else if (state.amount === "10") {
        state.buyCardAmountDiscount[0].isSelected = true;
      } else if (state.amount === "11") {
        state.buyCardAmountDiscount[1].isSelected = true;
      } else {
        state.buyCardAmount[Number(state.amount) - 1].isSelected = true;
      }
    };
    const buyCard = () => {
      //          立即购买
      state.modalBuy = true;
    };
    const okBuy = () => {};
    return {
      state,
      okBuy,
      changeAmount,
      changeCard,
      buyCard
    };
  }
};
</script>
<style rel="stylesheet" lang="scss" scoped>
img {
  width: 12px;
  float: right;
}

.r-month {
  display: inline-block;
  width: 3.5rem;
}
</style>
