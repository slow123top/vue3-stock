<template>
  <div>
    <Menu mode="horizontal" :active-name="state.activeName" @on-select="select">
      <Submenu name="1">
        <template slot="title">入市指标组合</template>
        <Menu-item name="1-1">价格类指标</Menu-item>
        <Menu-item name="1-2">市值类指标</Menu-item>
        <Menu-item name="1-3">上市日期类指标</Menu-item>
        <Menu-item name="1-4">股票池筛选指标</Menu-item>
        <Menu-item name="1-5">交易量类指标</Menu-item>
        <Menu-item name="1-6">经典指标</Menu-item>
        <Menu-item name="1-7" v-if="!$store.state.user.userType">千投定制入市类</Menu-item>
        <Menu-item name="1-8">我的模型入市指标组合</Menu-item>
      </Submenu>
      <Submenu name="2">
        <template slot="title">出市指标组合</template>
        <Menu-item name="2-1">价格类指标</Menu-item>
        <Menu-item name="2-2">市值类指标</Menu-item>
        <Menu-item name="2-3">上市日期类指标</Menu-item>
        <Menu-item name="2-4">股票池筛选指标</Menu-item>
        <Menu-item name="2-5">交易量类指标</Menu-item>
        <Menu-item name="2-6">经典指标</Menu-item>
        <!--<Menu-item name="2-7">定制指标</Menu-item>-->
        <Menu-item name="2-8">我的模型出市指标组合</Menu-item>
      </Submenu>
      <Submenu name="4">
        <template slot="title">风控指标组合</template>
        <Menu-item name="4-1">趋势类指标</Menu-item>
        <Menu-item name="4-2" v-if="!$store.state.user.userType">千投定制风控类</Menu-item>
        <Menu-item name="4-3">我的模型风控指标组合</Menu-item>
      </Submenu>
      <Submenu name="3">
        <template slot="title">二次筛选指标组合</template>
        <Menu-item name="3-1">普通二次筛选类</Menu-item>
        <Menu-item name="3-2" v-if="!$store.state.user.userType">千投定制二次筛选类</Menu-item>
      </Submenu>
    </Menu>
    <Row type="flex" justify="center">
      <i-col span="24" style="height: 15rem;overflow:auto;background-color: #ffffff;padding: .5rem">
        <ul class="index" v-if="state.activeName === '1-1'">
          <li
            :id="state.indexClass.number"
            v-for="indexClass in state.indexs['price']"
            class="price-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndex(indexClass.number)"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="index" v-if="state.activeName === '1-2'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.marketValue"
            class="market-value-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndex(indexClass.number)"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="index" v-if="state.activeName === '1-3'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.listingDate"
            class="listing-date-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndex(indexClass.number)"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="index" v-if="state.activeName === '1-4'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.code"
            class="code-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndex(indexClass.number)"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="index" v-if="state.activeName === '1-5'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.trade"
            class="trade-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndex(indexClass.number)"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="index" v-if="state.activeName === '1-6'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.classic"
            class="classic-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndex(indexClass.number)"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="index" v-if="state.activeName === '1-7'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.customMadeIntoMarket"
            class="classic-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndex(indexClass.number)"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="my-model" v-if="state.activeName === '1-8'">
          <li
            v-for="(item,index) in state.myModels"
            :key="index"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button size="large" style="width:35rem" @click="selectModel(index)">{{item.modelName}}</Button>
          </li>
        </ul>
        <ul class="index" v-if="state.activeName === '2-1'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs['price']"
            class="price-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndexSell(indexClass.number,'sell')"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="index" v-if="state.activeName === '2-2'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.marketValue"
            class="market-value-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndexSell(indexClass.number,'sell')"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="index" v-if="state.activeName === '2-3'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.listingDate"
            class="listing-date-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndexSell(indexClass.number,'sell')"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="index" v-if="state.activeName === '2-4'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.code"
            class="code-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndexSell(indexClass.number,'sell')"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="index" v-if="state.activeName === '2-5'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.trade"
            class="trade-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndexSell(indexClass.number,'sell')"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="index" v-if="state.activeName === '2-6'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.classic"
            class="classic-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndexSell(indexClass.number,'sell')"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="my-model" v-if="state.activeName === '2-8'">
          <li
            v-for="(item,index) in state.myModels"
            :key="index"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectModelOutMarket(index)"
            >{{item.modelName}}</Button>
          </li>
        </ul>

        <ul class="index" v-if="state.activeName === '4-1'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.windControl"
            class="classic-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndex(indexClass.number)"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="index" v-if="state.activeName === '4-2'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.customMadeWindControl"
            class="classic-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndex(indexClass.number)"
            >{{indexClass.message}}</Button>
          </li>
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.ruleWindControl"
            class="classic-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndex(indexClass.number)"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="my-model" v-if="state.activeName === '4-3'">
          <li
            v-for="(item,index) in state.myModels"
            :key="item"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectModelWindCtrl(index)"
            >{{item.modelName}}</Button>
          </li>
        </ul>
        <ul class="index" v-if="state.activeName === '3-1'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.secondaryScreen"
            class="classic-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndex(indexClass.number)"
              :disabled="secondaryScreenOnlyOnce"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
        <ul class="index" v-if="state.activeName === '3-2'">
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.customMadeSecondaryScreen"
            class="classic-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndex(indexClass.number)"
              :disabled="secondaryScreenOnlyOnce"
            >{{indexClass.message}}</Button>
          </li>
          <li
            :id="indexClass.number"
            v-for="indexClass in state.indexs.ruleSecondaryScreen"
            class="classic-index"
            :key="indexClass.number"
            style="display:inline-block;margin-right:.5rem;margin-bottom:.5rem"
          >
            <Button
              size="large"
              style="width:35rem"
              @click="selectIndex(indexClass.number)"
              :disabled="secondaryScreenOnlyOnce"
            >{{indexClass.message}}</Button>
          </li>
        </ul>
      </i-col>
    </Row>
  </div>
</template>
<script>
import { createModelIndexs, MY_MODEL_INDEXS } from "../../service/indexinfo";
import { reactive } from "@vue/composition-api";
export default {
  props: {
    secondaryScreenOnlyOnce: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const state = reactive({
      activeName: "1-1",
      myModels: state.$store.state.myModels,
      indexs: createModelIndexs,
      indicators: MY_MODEL_INDEXS
    });
    const select = name => {
      state.activeName = name;
      //        this.$emit('selectActiveName', name);
    };
    const selectIndex = indicatorId => {
      state.$store.commit("SELECT_INDICATOR", {
        indicators: this.indicators,
        indicatorId: indicatorId
      });
    };
    const selectIndexSell = (indicatorId, sell) => {
      //        标识出出市指标
      let temp = indicatorId.replace("A", sell);
      //        触发vuex 选择指标
      state.$store.commit("SELECT_INDICATOR", {
        indicators: this.indicators,
        indicatorId: temp
      });
    };
    const slectModelOutMarket = index => {
      state.$store.commit("SELECTMODEL", {
        modelIndex: index,
        index: index,
        number: "MODEL" + index,
        selectModelClass: "outMarket"
      });
    };
    const selectModelWindCtrl = index => {
      state.$store.commit("SELECTMODEL", {
        modelIndex: index,
        index: index,
        number: "MODEL" + index,
        selectModelClass: "windCtrl"
      });
    };
    const selectModel = index => {
      state.$store.commit("SELECTMODEL", {
        modelIndex: index,
        index: index,
        number: "MODEL" + index,
        selectModelClass: "intoMarket"
      });
    };
    return {
      state,
      select,
      selectIndex,
      selectIndexSell,
      slectModelOutMarket,
      selectModelWindCtrl,
      selectModel,
    };
  }
};
</script>
<style rel="stylesheet">
</style>
