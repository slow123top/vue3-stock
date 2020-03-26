<template>
  <div>
    <!--升级和续费-->
    <Modal
      :mask-closable="false"
      v-model="state.modalUpGrade"
      title="回测卡升级"
      @on-ok="okUpGrade"
      width="800"
    >
      <Row type="flex" justify="center" style="font-size: 1rem;">
        <i-col span="24">
          <i-form :label-width="100">
            <Form-item label="可升级到">
              <i-select
                size="large"
                v-model="state.upGrade1"
                @on-change="calUpgradePoint"
                style="width: 15rem"
              >
                <i-option
                  v-for="(item,index) in state.upGradeList"
                  :value="item.value"
                  :key="index"
                >{{item.label}}</i-option>
              </i-select>
            </Form-item>
            <Form-item label="升级卡信息" v-if="state.upGradeList.length">
              <i-input
                v-model="state.upGradeList[currentIndex].cardDescription"
                type="textarea"
                :rows="5"
                readonly
              ></i-input>
            </Form-item>
            <Form-item label="消费点数">
              <p style="font-size: 1rem;color: #ff0000;font-weight: bold">{{state.price.actualPrice}}</p>
            </Form-item>
          </i-form>
        </i-col>
      </Row>
    </Modal>
      <Row type="flex" justify="center" v-show="state.modal" style="padding: 1rem;height: 100%">
        <i-col span="24">
          <p style="font-size: 1rem">
            <span style="color: #2d8cf0">{{$store.state.user.nickName}}</span>&nbsp;剩余点数：
            <span style="font-size: 2rem;color: #ff0000">{{state.myPoint}}</span>
          </p>
        </i-col>
        <i-col span="24" style="margin-top: 1rem">
          <p style="font-size: 1rem">千投量化网回测卡：</p>
          <!--<i-table></i-table>-->
          <i-table :columns="state.columns" :data="state.data"></i-table>
        </i-col>
      </Row>
  </div>
</template>
<script>
import { reactive, computed } from "@vue/composition-api";
export default {
  setup(props, { root }) {
    const state = reactive({
      modal: false,
      price: "",
      myPoint: "",
      myCard: "",
      cardType: ["单次回测卡", "智能回测卡"],
      currentIndex: 0,
      modalUpGrade: false,
      modalRenewalFee: false,
      upGrade1: "",
      //        upGradePoint: '',
      upGradeList: [],
      renewalFee1: "",
      //        renewalFeePoint: '',
      renewalFeeList: [
        {
          value: 1,
          label: "1个月"
        },
        {
          value: 2,
          label: "2个月"
        },
        {
          value: 3,
          label: "3个月"
        },
        {
          value: 4,
          label: "4个月"
        },
        {
          value: 5,
          label: "5个月"
        },
        {
          value: 6,
          label: "6个月"
        },
        {
          value: 7,
          label: "7个月"
        },
        {
          value: 8,
          label: "8个月"
        },
        {
          value: 9,
          label: "9个月"
        },
        {
          value: 10,
          label: "10个月"
        },
        {
          value: 11,
          label: "11个月"
        },
        {
          value: 12,
          label: "1年"
        },
        {
          value: 24,
          label: "2年"
        },
        {
          value: 36,
          label: "3年"
        }
      ],
      columns: [
        {
          title: "卡名",
          key: "cardName",
          align: "center"
        },
        {
          title: "详细信息",
          key: "cardDescription",
          align: "center"
        },
        {
          title: "类型",
          key: "type",
          align: "center"
        },
        {
          title: "到期时间",
          key: "validTime",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    disabled: !state.dataTemp[params.index].canUpgrade
                    //                  size: 'large'
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.upGrade(params.index);
                    }
                  }
                },
                "升级"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "success"
                  },
                  on: {
                    click: () => {
                      this.renewalFee(params.index);
                    }
                  }
                },
                "续费"
              )
            ]);
          }
        }
      ],
      dataTemp: [],
      data: computed(() => {
        let temp = [];
        if (state.dataTemp.length !== 0) {
          state.dataTemp.forEach(function(item) {
            temp.push({
              cardName: item.cardName,
              cardNumber: item.cardNumber,
              type: state.cardType[item.type],
              validTime: new Date(item.validTime).format("yyyy-MM-dd"),
              //              validTime: '',
              cardDescription: item.cardDescription
            });
          });
        }
        return temp;
      })
    });
    const upGrade = index => {
      //升级
      state.currentIndex = index;
    };
    const calUpgradePoint = () => {
      //          计算升级所需点数
    };
    const okUpGrade = () => {
      //          确定升级
    };
    const renewalFee = () => {
      //          续费
      root.$router.push("/personalInfo/buycard");
    };
    return {
      state,
      renewalFee,
      okUpGrade,
      calUpgradePoint,
      upGrade
    };
  }
};
</script>
<style scoped>
</style>
