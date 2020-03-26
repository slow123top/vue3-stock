<template>
  <div>
    <Modal v-model="state.modal" :mask-closable="false" width="360">
      <Spin fix size="large">
        <Icon
          type="load-c"
          size="18"
          class="demo-spin-icon-load"
          style="line-height: 2rem;border-radius: 20px"
        ></Icon>
        <div>加载中...</div>
      </Spin>
      <div slot="footer"></div>
    </Modal>
    <Row type="flex" justify="center" style="background: #f7f7f7;height: 50rem;">
      <i-col span="3" style="text-align: center;background-color: #1c2438">
        <i-menu
          :active-name="state.activeName"
          theme="dark"
          width="auto"
          @on-select="selectTitle"
          @on-open-change="onOpenChange"
          style="border-radius: 10px 0 0 0"
        >
          <Submenu name="user">
            <template slot="title">
              <Icon type="person"></Icon>个人中心
            </template>
            <Menu-item name="phone">
              <Icon type="android-phone-portrait"></Icon>
              <span v-if="!state.isBindPhone">绑定手机</span>
              <span v-else>修改手机{{state.phone}}</span>
            </Menu-item>
            <Menu-item
              name="email"
              style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
            >
              <Icon type="email"></Icon>
              <span v-if="!state.isBindEmail">绑定邮箱</span>
              <span v-else>修改邮箱{{state.email}}</span>
            </Menu-item>
            <Menu-item name="user-update" v-if="state.isBindPhone||state.isBindEmail">
              <Icon type="ios-compose"></Icon>修改密码
            </Menu-item>
            <Menu-item name="user-wallet">
              <Icon type="bag"></Icon>我的钱包
            </Menu-item>
          </Submenu>
          <Submenu name="recharge">
            <template slot="title">
              <Icon type="social-yen"></Icon>
              <span>充值中心</span>
            </template>
            <Menu-item name="recharge-point">
              <Icon type="pricetags"></Icon>充值点数
            </Menu-item>
            <Menu-item name="recharge-card">
              <Icon type="card"></Icon>购买回测卡
            </Menu-item>
          </Submenu>
          <Submenu name="pay">
            <template slot="title">
              <Icon type="ios-keypad"></Icon>
              <span>消费记录</span>
            </template>
            <Menu-item name="deduct-point">
              <Icon type="ios-drag"></Icon>消费点数记录
            </Menu-item>
            <Menu-item name="pay-point">
              <Icon type="record"></Icon>充值点数记录
            </Menu-item>
            <Menu-item name="pay-card">
              <Icon type="clipboard"></Icon>购买回测卡记录
            </Menu-item>
            <!---->
          </Submenu>
          <Submenu name="pay">
            <template slot="title">
              <Icon type="navigate"></Icon>
              <span>操作指引</span>
            </template>
            <Menu-item name="create-model">
              <Icon type="arrow-graph-up-right"></Icon>
              <span class="layout-text">创建模型</span>
            </Menu-item>
            <Menu-item name="my-model">
              <Icon type="ios-home"></Icon>
              <span class="layout-text">我的模型</span>
            </Menu-item>
            <Menu-item name="history-model">
              <Icon type="ios-analytics"></Icon>
              <span class="layout-text">回测历史</span>
            </Menu-item>
          </Submenu>
        </i-menu>
      </i-col>
      <i-col span="21" style="background-color: #1c2438;height: 100%;">
        <div style="background-color: #fff;height: 100%;width:100%;">
          <router-view></router-view>
        </div>
      </i-col>
      <!--<i-col></i-col>-->
    </Row>
  </div>
</template>
<script>
import { reactive, computed } from "@vue/composition-api";
export default {
  setup(props, { root }) {
    const state = reactive({
      modal: false,
      isBindPhone: computed(() => {
        if (root.$store.state.isBindPhone !== "") {
          return root.$store.state.isBindPhone;
        }
      }),
      isBindEmail: computed(() => {
        if (root.$store.state.isBindEmail !== "") {
          return root.$store.state.isBindEmail;
        }
      }),
      phone: computed(() => {
        if (root.$store.state.phone !== "") {
          return root.$store.state.phone;
        }
      }),
      email: computed(() => {
        if (root.$store.state.email !== "") {
          return root.$store.state.email;
        }
      }),
      activeName: computed(() => {
        if (root.$route.path === "/personalInfo/updatepasswd") {
          return "user-update";
        } else if (root.$route.path === "/personalInfo/recharge") {
          return "recharge-point";
        } else if (root.$route.path === "/personalInfo/buycard") {
          return "recharge-card";
        } else if (root.$route.path === "/personalInfo/mywallet") {
          return "user-wallet";
        } else if (root.$route.path === "/personalInfo/deducpoints") {
          return "deduct-point";
        } else if (root.$route.path === "/personalInfo/rechargerecord") {
          return "pay-point";
        } else if (root.$route.path === "/personalInfo/buycardrecord") {
          return "pay-card";
        } else if (root.$route.path === "/personalInfo/phone") {
          return "phone";
        } else if (root.$route.path === "/personalInfo/email") {
          return "email";
        }
      })
    });
    const selectTitle = name => {
      switch (name) {
        case "user-update":
          //              修改密码
          root.$router.push("/personalInfo/updatepasswd");
          break;
        case "phone":
          //              修改密码
          root.$router.push("/personalInfo/phone");
          break;
        case "email":
          //              修改密码
          root.$router.push("/personalInfo/email");
          break;
        case "recharge-point":
          //              充点
          root.$router.push("/personalInfo/recharge");
          break;
        case "recharge-card":
          //              购卡
          root.$router.push("/personalInfo/buycard");
          break;
        case "user-wallet":
          root.$router.push("/personalInfo/mywallet");
          break;
        //            扣点数记录
        case "deduct-point":
          root.$router.push("/personalInfo/deducpoints");
          //            this.$router.push('/mywallet');
          break;
        case "pay-point":
          root.$router.push("/personalInfo/rechargerecord");
          break;
        case "pay-card":
          root.$router.push("/personalInfo/buycardrecord");
          break;
        case "create-model":
          //              创建模型
          root.$router.push("/model/selectStock");
          break;
        case "my-model":
          //              我的模型
          root.$router.push("/model/personalModel");
          break;
        case "history-model":
          //              回测历史
          root.$router.push("/model/history");
          break;
        default:
          break;
      }
    };
    const onOpenChange = () => {
    };
    return {
      state,
      onOpenChange,
      selectTitle
    };
  }
};
</script>
<style rel="stylesheet" lang="scss" scoped>
</style>
