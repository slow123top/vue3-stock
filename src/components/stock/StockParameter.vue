<template>
  <div>
    <!--取消智能回测-->
    <!--提示扣点操作-->
    <Row type="flex" justify="start" :gutter="16" style="width: 100%">
      <i-col
        span="24"
        style="padding: .5rem;border-radius: 10px;background-color: #495060;margin-bottom:.5rem"
      >
        <indicator-list :secondaryScreenOnlyOnce="state.secondaryScreenOnlyOnce"></indicator-list>
      </i-col>
      <i-col
        span="24"
        style="background: #2C3E50;padding:.5rem;border-radius:10px;margin-bottom:.5rem"
      >
        <i-form ref="formValidate" :label-width="200" :model="state.formValidate" inline>
          <Row
            type="flex"
            justify="start"
            style="background:#fff;margin-bottom:1rem;border-radius:10px"
          >
            <i-col span="21" style="border-right:1px solid">
              <Row type="flex" justify="center" style="border-bottom:1px solid;height:2rem">
                <i-col span="8">
                  <Radio-group v-model="state.andOrNot" @on-change="changeAndOrNot">
                    <Radio label="and" :disabled="state.isOneA">并且</Radio>
                    <Radio label="or" :disabled="state.isOneA">或者</Radio>
                    <Radio label="not" :disabled="state.isOneA">依次剔除掉</Radio>
                    <Radio label="customize" :disabled="state.isOneA">自定义</Radio>
                  </Radio-group>
                  <Poptip placement="right">
                    <Icon type="information-circled" :size="25" style="cursor: pointer"></Icon>
                    <div class="api" slot="content" style="font-size:0.875rem;">
                      <p>此处用于处理多个入市、出市或风控指标的组合关系；</p>ABC 并且: 满足A 并且 满足B 并且满足C；
                      <br />ABC 或者: 满足A 或者 满足B 或者 满足C；
                      <br />ABC依次剔除掉: 满足A 同时不能满足B 同时不能满足C；
                      <br />若选择“自定义”，则下方的指标组合编辑区域允许进行更复杂的设定，可填入“(”、“)”、“&”、“|”、“$”；
                      <br />其中左右括号均为英文括号，后三种符号依次表示“并且”、“或者”、“剔除掉”的意思；
                      <br />入市、出市和风控是分开处理的；
                      <br />二次筛选指标不介入该与或非组合计算。
                    </div>
                  </Poptip>
                </i-col>
              </Row>
              <ul
                class="selected-indexs"
                style="width: 100%;height: 25rem;overflow: auto;font-size:0.875rem;padding:.5rem;color:#34495e"
              >
                <li
                  v-for="(item,indexs) in state.selectedIndexs"
                  :key="indexs"
                  :style="item.className === ''?state.style_ABC[item.selectModelClass]:state.style_ABC[item.type.substring(0,1)]"
                >
                  <Tooltip
                    v-if="item.selectModelClass === 'intoMarket'"
                    :content="'入市'+item.number"
                    placement="top"
                  >
                    <span>{{item.modelName}}</span>
                  </Tooltip>
                  <Tooltip
                    v-else-if="item.selectModelClass === 'outMarket'"
                    :content="'出市'+item.number"
                    placement="top"
                  >
                    <span>{{item.modelName}}</span>
                  </Tooltip>
                  <Tooltip v-else :content="'风控'+item.number" placement="left">
                    <span>{{item.modelName}}</span>
                  </Tooltip>
                  <Poptip placement="right" v-if="!item.className">
                    <Button
                      shape="circle"
                      icon="help"
                      size="small"
                      style="background-color: #55595c;color: #fff"
                      @click="getIndexInfo(indexs)"
                    ></Button>
                    <div class="api" slot="content" style="font-size:0.8rem">
                      <ul>
                        <li v-for="(info,index) in state.modelInfo" :key="index">{{info}}</li>
                      </ul>
                    </div>
                  </Poptip>
                  <!-- {{$route.path}} -->
                  <span style="float: left">
                    <Tooltip
                      v-if="item.type.indexOf('A')!==-1"
                      :content="'入市'+item.className"
                      placement="top"
                    >
                      <p
                        v-if="item.className !== ''"
                        style="width: 31rem;text-align: right"
                      >{{item.message}}</p>
                    </Tooltip>
                    <Tooltip
                      v-else-if="item.type.indexOf('sell')!==-1"
                      :content="'出市'+item.className.replace('sell','A')"
                      placement="top"
                    >
                      <p
                        v-if="item.className !== ''"
                        style="width: 31rem;text-align: right"
                      >{{item.message}}</p>
                    </Tooltip>
                    <Tooltip v-else :content="item.className" placement="top">
                      <p
                        v-if="item.className !== ''"
                        style="width: 31rem;text-align: right"
                      >{{item.message}}</p>
                    </Tooltip>
                  </span>
                  <Form-item
                    v-for="(select,index) in item.selects"
                    :prop="'selectedIndexs.'+indexs+'.selects.'+index+'.value'"
                    :label-width="5"
                    :key="index"
                    style="float: left;margin: 0"
                  >
                    <Button
                      v-if="!select.locked"
                      size="small"
                      icon="ios-unlocked-outline"
                      @click="lockPara(indexs,index,'selects')"
                    ></Button>
                    <Button
                      v-else
                      size="small"
                      icon="locked"
                      @click="unlockPara(indexs,index,'selects')"
                    ></Button>
                  </Form-item>
                  <Form-item
                    v-for="(param,index) in item.params"
                    :prop="'selectedIndexs.'+indexs+'.params.'+index+'.value'"
                    :label-width="5"
                    :rules="param.validator"
                    :key="index"
                    style="float: left;margin: 0;font-size:1rem"
                    :show-message="param.showMessage"
                  >
                  </Form-item>
                  <Form-item
                    v-for="(select_1,index) in item.select1"
                    :prop="'selectedIndexs.'+indexs+'.select1.'+index+'.value'"
                    :label-width="5"
                    :rules="select_1.validator"
                    :key="index"
                    :show-message="select_1.showMessage"
                    style="float: left;margin: 0"
                  >
                    <i-select
                      v-model="select_1.value"
                      style="width:5rem"
                      @on-change="getSelectIndex(select_1.value,indexs)"
                    >
                      <i-option
                        v-for="(option1,indexss) in select_1.optionList"
                        :value="option1.value"
                        :key="indexss"
                      >{{ option1.label }}</i-option>
                    </i-select>
                  </Form-item>
                  <Form-item
                    v-for="(param_2,index) in item.params2"
                    :prop="'selectedIndexs.'+indexs+'.params2.'+index+'.value'"
                    :label-width="5"
                    :rules="param_2.validator"
                    :key="index"
                    :show-message="param_2.showMessage"
                    style="float: left;margin: 0"
                  >
                  </Form-item>
                  <Form-item
                    v-for="(select_2,index) in item.select2"
                    :prop="'selectedIndexs.'+indexs+'.select2.'+index+'.value'"
                    :label-width="5"
                    :rules="select_2.validator"
                    :key="index"
                    :show-message="select_2.showMessage"
                    style="float: left;margin: 0"
                  >
                    <i-select
                      v-model="select_2.value"
                      style="width:5rem"
                      @on-change="getSelectIndex(select_2.value,indexs)"
                    >
                      <i-option
                        v-for="(option2,indexss) in select_2.optionList"
                        :value="option2.value"
                        :key="indexss"
                      >{{ option2.label }}</i-option>
                    </i-select>
                  </Form-item>
                  <Form-item
                    v-for="(radio, index) in item.radios"
                    :label-width="5"
                    :key="index"
                    style="float: left;margin: 0;font-size:1rem"
                  >
                    <Radio-group v-model="radio.value" style="margin-left: 1rem">
                      <Radio :label="radio.value1">{{radio.label1}}</Radio>
                      <Radio :label="radio.value2">{{radio.label2}}</Radio>
                      <Radio v-if="radio.threeFlag" :label="radio.value3">{{radio.label3}}</Radio>
                    </Radio-group>
                    <Button
                      v-if="!radio.locked"
                      size="small"
                      icon="ios-unlocked-outline"
                      @click="lockPara(indexs,index,'radios')"
                    ></Button>
                    <Button
                      v-else
                      size="small"
                      icon="locked"
                      @click="unlockPara(indexs,index,'radios')"
                    ></Button>
                  </Form-item>
                  <!-- <Button type="primary" shape="circle" icon="ios-search"></Button> -->
                  <Button
                    type="text"
                    shape="circle"
                    size="large"
                    style="float: right"
                    icon="close"
                    @click="handleRemove(indexs)"
                  ></Button>
                </li>
              </ul>
              <ul style="border-top: 1px solid;padding: .5rem">
                <li v-if="state.intoMarketList.length" class="symbol-ship">
                  <Form-item
                    label="入市指标及其关系："
                    prop="andOrNotIntoMarketLeft"
                    :label-width="150"
                    :rules="state.andOrNotIntoMarketLeftValidate"
                  >
                    <i-input
                      type="text"
                      style="width: 3rem"
                      v-model="state.formValidate.andOrNotIntoMarketLeft"
                      :disabled="!state.isCustomise"
                      @on-blur="intoMarketErrorLogo"
                    ></i-input>
                  </Form-item>
                  <Form-item
                    v-for="(intoMarket,index) in state.formValidate.intoMarketListTemp"
                    :label-width="60"
                    :prop="'intoMarketListTemp.'+index+'.nextRelationship'"
                    :rules="state.andOrNotIntoMarketMiddleValidate"
                    :label="intoMarket.selectModelClass === 'intoMarket'?intoMarket.number:intoMarket.className"
                    :key="index"
                  >
                    <i-input
                      v-if="index !== state.intoMarketList.length-1"
                      type="text"
                      style="width: 3rem;text-align: center"
                      v-model="intoMarket.nextRelationship"
                      :disabled="!state.isCustomise"
                      @on-blur="intoMarketErrorLogo"
                    ></i-input>
                  </Form-item>
                  <Form-item
                    prop="andOrNotIntoMarketRight"
                    :label-width=".5"
                    :rules="state.andOrNotIntoMarketRightValidate"
                  >
                    <i-input
                      type="text"
                      style="width: 3rem"
                      v-model="state.formValidate.andOrNotIntoMarketRight"
                      :disabled="!state.isCustomise"
                      @on-blur="intoMarketErrorLogo"
                    ></i-input>
                  </Form-item>
                  <span class="error-logo" v-if="!state.intoMarketCanRun">自定义入市指标及其关系格式有误</span>
                </li>
                <li v-if="state.outMarketList.length" class="symbol-ship">
                  <Form-item
                    label="出市指标及其关系："
                    prop="andOrNotOutMarketLeft"
                    :label-width="150"
                    :rules="state.andOrNotIntoMarketLeftValidate"
                  >
                    <i-input
                      type="text"
                      style="width: 3rem"
                      v-model="state.formValidate.andOrNotOutMarketLeft"
                      :disabled="!state.isCustomise"
                      @on-blur="outMarketErrorLogo"
                    ></i-input>
                  </Form-item>
                  <Form-item
                    v-for="(outMarket,index) in state.formValidate.outMarketListTemp"
                    :label-width="60"
                    :prop="'outMarketListTemp.'+index+'.nextRelationship'"
                    :rules="state.andOrNotIntoMarketMiddleValidate"
                    :label="outMarket.selectModelClass === 'outMarket'?outMarket.number:outMarket.className"
                    :key="index"
                  >
                    <i-input
                      v-if="index !== state.outMarketList.length-1"
                      type="text"
                      style="width: 3rem"
                      v-model="outMarket.nextRelationship"
                      :disabled="!state.isCustomise"
                      @on-blur="outMarketErrorLogo"
                    ></i-input>
                  </Form-item>
                  <Form-item
                    prop="andOrNotIntoMarketRight"
                    :label-width=".5"
                    :rules="state.andOrNotIntoMarketRightValidate"
                  >
                    <i-input
                      type="text"
                      style="width: 3rem"
                      v-model="state.formValidate.andOrNotOutMarketRight"
                      :disabled="!state.isCustomise"
                      @on-blur="outMarketErrorLogo"
                    ></i-input>
                  </Form-item>
                  <span class="error-logo" v-if="!state.outMarketCanRun">自定义出市指标及其关系格式有误</span>
                </li>
                <li v-if="state.windCtrlList.length" class="symbol-ship">
                  <Form-item
                    label="风控指标及其关系："
                    prop="andOrNotOutMarketLeft"
                    :label-width="150"
                    :rules="state.andOrNotIntoMarketLeftValidate"
                  >
                    <i-input
                      type="text"
                      style="width: 3rem"
                      v-model="state.formValidate.andOrNotWindCtrlLeft"
                      :disabled="!state.isCustomise"
                      @on-blur="windCtrlErrorLogo"
                    ></i-input>
                  </Form-item>
                  <Form-item
                    v-for="(windCtrl,index) in state.formValidate.windCtrlListTemp"
                    :label-width="60"
                    :prop="'windCtrlListTemp.'+index+'.nextRelationship'"
                    :rules="state.andOrNotIntoMarketMiddleValidate"
                    :label="windCtrl.selectModelClass === 'windCtrl'?windCtrl.number:windCtrl.className"
                    :key="index"
                  >
                    <i-input
                      v-if="index !== state.windCtrlList.length-1"
                      type="text"
                      style="width: 3rem"
                      v-model="windCtrl.nextRelationship"
                      :disabled="!state.isCustomise"
                      @on-blur="windCtrlErrorLogo"
                    ></i-input>
                  </Form-item>
                  <Form-item
                    prop="andOrNotIntoMarketRight"
                    :label-width=".5"
                    :rules="state.andOrNotIntoMarketRightValidate"
                  >
                    <i-input
                      type="text"
                      style="width: 3rem"
                      v-model="state.formValidate.andOrNotWindCtrlRight"
                      :disabled="!state.isCustomise"
                      @on-blur="windCtrlErrorLogo"
                    ></i-input>
                  </Form-item>
                  <span class="error-logo" v-if="!state.windCtrlCanRun">自定义风控指标及其关系格式有误</span>
                </li>
                <li v-if="state.secondList.length" class="symbol-ship">
                  <Form-item label="二次筛选指标：" :label-width="150"></Form-item>
                  <Form-item
                    :label="state.secondList[0].className"
                    prop="andOrNotOutMarketLeft"
                    :label-width=".5"
                  ></Form-item>
                </li>
              </ul>
            </i-col>
            <i-col span="3" style="padding:.5rem">
              <Form-item
                :label-width="10"
                prop="controller.modelName"
                style="margin-bottom: 1rem"
                :rules="state.controllerValidator.modelName"
              >
                <Tooltip content="模型名称,长度最大为20" placement="left">
                  <i-input
                    v-model="state.modelName"
                    placeholder="模型名称"
                    :maxlength="20"
                  ></i-input>
                </Tooltip>
              </Form-item>
              <Form-item prop="controller.backStart" style="margin-bottom: 1rem" :label-width="10">
                <Tooltip content="回测起点 （最早从 2006-01-04 开始）" placement="left">
                  <Date-picker
                    v-model="state.backStart"
                    :editable="false"
                    :clearable="false"
                    :options="state.startTimeOption"
                    type="date"
                    placeholder="回测起点,格式:2011-01-01"
                    @on-change="changeStartDate"
                  ></Date-picker>
                </Tooltip>
              </Form-item>
              <Form-item prop="controller.backEnd" style="margin-bottom: 1rem" :label-width="10">
                <Tooltip
                  :content="'回测终点 （最晚到 ' +state.endTime+' 结束）'"
                  placement="left"
                >
                  <Date-picker
                    v-model="state.backEnd"
                    :editable="false"
                    :clearable="false"
                    :options="state.endTimeOption"
                    type="date"
                    placeholder="回测终点,格式:2011-01-01"
                    @on-change="changeEndDate"
                  ></Date-picker>
                </Tooltip>
              </Form-item>
              <Form-item
                prop="controller.buyRate"
                style="margin-bottom: 1rem"
                :rules="state.controllerValidator.buyRate"
                :label-width="10"
              >
                <Tooltip content="买入费率‱（万分之）" placement="left">
                  <i-input v-model="$store.state.controller.buyRate" placeholder="买入费率"></i-input>
                </Tooltip>
              </Form-item>
              <Form-item
                prop="controller.sellRate"
                style="margin-bottom: 1rem"
                :rules="state.controllerValidator.sellRate"
                :label-width="10"
              >
                <Tooltip content="卖出费率‱（万分之）" placement="left">
                  <i-input v-model="$store.state.controller.sellRate" placeholder="卖出费率"></i-input>
                </Tooltip>
              </Form-item>
              <Form-item
                prop="controller.pressureRate"
                style="margin-bottom: 1rem"
                :rules="state.controllerValidator.pressureRate"
                :label-width="10"
              >
                <Tooltip content="模型压力费率‱（万分之）" placement="left">
                  <i-input v-model="$store.state.controller.pressureRate" placeholder="模型压力费率"></i-input>
                </Tooltip>
              </Form-item>
              <Form-item
                style="margin-bottom: 1rem"
                prop="controller.maxDailyHold"
                :rules="state.controllerValidator.maxHold"
                :label-width="10"
              >
                <Tooltip content="最大每日持有股数" placement="left">
                  <i-input v-model="$store.state.controller.maxDailyHold" placeholder="最大每日持有股数"></i-input>
                </Tooltip>
              </Form-item>
              <Form-item
                prop="controller.holdDate"
                :rules="state.controllerValidator.holdDate"
                style="margin-bottom: 1rem"
                :label-width="10"
              >
                <Tooltip content="持有期" placement="left">
                  <i-input v-model="$store.state.controller.holdDate" placeholder="持有期"></i-input>
                </Tooltip>
              </Form-item>
              <Form-item
                prop="controller.stopProfit"
                :rules="state.controllerValidator.stopProfit"
                style="margin-bottom: 1rem"
                :label-width="10"
              >
                <Tooltip content="止盈%（百分之）" placement="left">
                  <i-input v-model="$store.state.controller.stopProfit" placeholder="止盈"></i-input>
                </Tooltip>
              </Form-item>
              <Form-item
                prop="controller.stopLoss"
                :rules="state.controllerValidator.stopLoss"
                :label-width="10"
              >
                <Tooltip content="止损%（百分之）" placement="left">
                  <i-input v-model="$store.state.controller.stopLoss" placeholder="止损"></i-input>
                </Tooltip>
              </Form-item>
            </i-col>
          </Row>
          <Row type="flex" justify="center">
            <i-col span="8">
              <Button-group>
                <Button type="primary" size="large" @click="switchModel">切换随机模型</Button>
                <Button
                  type="primary"
                  size="large"
                  :disabled="state.canReduction"
                  @click="empty"
                >清空已选指标</Button>
                <Button
                  type="primary"
                  size="large"
                  :disabled="state.canReduction"
                  @click="indexRevert"
                >初始化指标</Button>
                <!--<Button type="primary" size="large" :disabled="canDetailReport" @click="detailReport">详细报告</Button>-->
              </Button-group>
            </i-col>
          </Row>
        </i-form>
      </i-col>
    </Row>
  </div>
</template>
<script>
//导入controller校验器
import {
  holdDate_validator,
  buyRate_validator,
  sellRate_validator,
  pressureRate_validator,
  maxHold_validator,
  stopProfit_validator,
  stopLoss_validator,
  modelName_validator
} from "../../service/validator";
// import axios from "axios";
//导入指标信息
import { createModelIndexs, MY_MODEL_INDEXS } from "../../service/indexinfo";
//  导入生成模型信息函数
import {
  resolveIndicator,
  classifyIndicator,
  indicatorToDes
} from "../../service/model";
//  远程调用接口
import {
  // loginTimeoutPrompt,
  // jumpLogin,
  checkStr,
  isBracketBalance
} from "../../utils/tools";
import IndicatorList from "./IndicatorList";
import { computed, reactive } from "@vue/composition-api";
//  import $ from 'jquery'
//  加密算法
//  import {AES,enc} from 'crypto-js'
export default {
  setup(props, { root }) {
    const state = reactive({
      selectedIndexs:root.$store.state.selectedIndexs,
      modelName:root.$store.state.controller.modelName,
      backStart:root.$store.state.controller.backStart,
      endTime:root.$store.state.model,
      backEnd:root.$store.state.controller.backEnd,
      userType: root.$store.state.user.userType,
      andOrNot: root.$store.state.andOrNot,
      geneticWaitingModal: false,
      geneticMessage: "",
      primaryTimes: 1,
      intermediateTimes: 0,
      advancedTimes: 0,
      geneticPointInsuff: false,
      geneticLoading: false,
      errorLogo: "",
      intoMarketCanRun: 1,
      outMarketCanRun: 1,
      windCtrlCanRun: 1,
      activeName: "1-1",
      modalNoPoint: false,
      needPoints: "",
      geneticSetTime: "",
      geneticModal: false,
      geneticLevel: 0,
      loopTime: "",
      modelIndex: "",
      selectModelClass: "intoMarket",
      myModelModal: true,
      runPoll: "",
      runMessage: "",
      startTimeOption: {
        disabledDate(date) {
          return (
            date &&
            date.valueOf() <
              new Date(root.$store.state.model.startTime) - 86400000
          );
        }
      },
      endTimeOption: {
        disabledDate(date) {
          return (
            date && date.valueOf() > new Date(root.$store.state.model.endTime)
          );
        }
      },
      style_ABC: {
        //            出市样式
        s: {
          "margin-bottom": "1rem",
          "text-align": "center",
          "line-height": "2.2rem",
          "background-color": "#e2f0e4",
          "border-radius": "5px"
        },
        //          入市样式
        A: {
          "margin-bottom": "1rem",
          "text-align": "center",
          "line-height": "2.2rem",
          "background-color": "#c9e5f5",
          "border-radius": "5px"
        },
        intoMarket: {
          "margin-bottom": "1rem",
          "text-align": "center",
          "line-height": "2.2rem",
          "background-color": "#c9e5f5",
          "border-radius": "5px"
        },
        outMarket: {
          "margin-bottom": "1rem",
          "text-align": "center",
          "line-height": "2.2rem",
          "background-color": "#e2f0e4",
          "border-radius": "5px"
        },
        //          二次筛选样式#F7BA29
        B: {
          "margin-bottom": "1rem",
          "text-align": "center",
          "line-height": "2.2rem",
          "background-color": "rgba(247,186,41,.1)",
          "border-radius": "5px"
        },
        //          风控样式
        C: {
          "margin-bottom": "1rem",
          "text-align": "center",
          "line-height": "2.2rem",
          "background-color": "rgba(255,73,73,.1)",
          "border-radius": "5px"
        },
        windCtrl: {
          "margin-bottom": "1rem",
          "text-align": "center",
          "line-height": "2.2rem",
          "background-color": "rgba(255,73,73,.1)",
          "border-radius": "5px"
        }
      },
      modelInfo: [],
      modelId: "",
      myModels: root.$store.state.myModels,
      myModelsLen: root.$store.state.myModels.length,
      parentIndex: 0,
      selectValue: 100000,
      queryIndexInit: "",
      indicators: MY_MODEL_INDEXS,
      indexs: createModelIndexs,
      modal: false,
      runParam: "",
      isGetRunStatus: "",
      isRunning: false,
      andOrNotSymbolIntoMarket: "&",
      andOrNotIntoMarketLeft: "",
      andOrNotIntoMarketLeftValidate: [],
      andOrNotIntoMarketMiddleValidate: [
      ],
      andOrNotIntoMarketRightValidate: [
      ],
      andOrNotSymbolOutMarket: "&",
      andOrNotSymbolWindCtrl: "&",
      loading: false,
      modalRedPoint: false,
      formValidate: {
        intoMarketListTemp: [],
        outMarketListTemp: [],
        windCtrlListTemp: [],
        secondListTemp: [],
        andOrNotIntoMarketLeft:
          root.$store.state.symbol.andOrNotIntoMarketLeft,
        andOrNotIntoMarketRight:
          root.$store.state.symbol.andOrNotIntoMarketRight,
        andOrNotOutMarketLeft: root.$store.state.symbol.andOrNotOutMarketLeft,
        andOrNotOutMarketRight:
          root.$store.state.symbol.andOrNotOutMarketRight,
        andOrNotWindCtrlLeft: root.$store.state.symbol.andOrNotWindCtrlLeft,
        andOrNotWindCtrlRight: root.$store.state.symbol.andOrNotWindCtrlRight,
        currentInputIndex: root.$store.state.currentInputIndex,
        //          仅仅是选股指标
        selectedIndexs: root.$store.state.selectedIndexs,
        controller: root.$store.state.controller
      },
      controllerValidator: {
        holdDate: [
          {
            validator: holdDate_validator,
            trigger: "blur"
          }
        ],
        buyRate: [
          {
            validator: buyRate_validator,
            trigger: "blur"
          }
        ],
        sellRate: [
          {
            validator: sellRate_validator,
            trigger: "blur"
          }
        ],
        pressureRate: [
          {
            validator: pressureRate_validator,
            trigger: "blur"
          }
        ],
        maxHold: [
          {
            validator: maxHold_validator,
            trigger: "blur"
          }
        ],
        modelName: [
          {
            validator: modelName_validator,
            trigger: "blur"
          }
        ],
        stopProfit: [
          {
            validator: stopProfit_validator,
            trigger: "blur"
          }
        ],
        stopLoss: [
          {
            validator: stopLoss_validator,
            trigger: "blur"
          }
        ]
      },
      intoMarketList: computed(() => {
        let symbol = {
          and: "&",
          or: "|",
          not: "$"
        };
        //        console.log(state.formValidate.selectedIndexs);
        let temp = state.formValidate.selectedIndexs.filter(function(item) {
          return (
            item.type.indexOf("A") !== -1 ||
            (item.className === "" && item.selectModelClass === "intoMarket")
          );
        });
        if (root.$store.state.andOrNot !== "customize") {
          for (let i = 0; i < temp.length; i++) {
            temp[i].nextRelationship = symbol[root.$store.state.andOrNot];
          }
        } else {
          //            若中间有的框框为空  则默认为and
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].nextRelationship === "") {
              temp[i].nextRelationship = symbol["and"];
            }
          }
        }
        //        let temp1 = JSON.parse(JSON.stringify(temp));
        state.formValidate.intoMarketListTemp = temp;
        return temp;
      }),

      //      已选风控指标列表
      windCtrlList: computed(() => {
        let symbol = {
          and: "&",
          or: "|",
          not: "$"
        };
        let temp = state.formValidate.selectedIndexs.filter(function(item) {
          return (
            item.type.indexOf("C") !== -1 ||
            (item.className === "" && item.selectModelClass === "windCtrl")
          );
        });
        if (root.$store.state.andOrNot !== "customize") {
          for (let i = 0; i < temp.length; i++) {
            temp[i].nextRelationship = symbol[root.$store.state.andOrNot];
          }
        } else {
          //            若中间有的框框为空  则默认为and
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].nextRelationship === "") {
              temp[i].nextRelationship = symbol["and"];
            }
          }
        }
        state.formValidate.windCtrlListTemp = temp;
        return temp;
      }),
      //      已选二次筛选指标列表
      secondList: computed(() => {
        let temp = state.formValidate.selectedIndexs.filter(function(item) {
          return item.type.indexOf("B") !== -1;
        });
        state.formValidate.secondListTemp = temp;
        return temp;
      }),

      //        是否只有一个选股指标  若只有一个或者为空  禁用与或非功能
      isOneA: computed(() => {
        let oneA = state.formValidate.selectedIndexs.filter(function(item) {
          return item.className.indexOf("A") !== -1;
        });
        let oneM = state.formValidate.selectedIndexs.filter(function(item) {
          return item.className === "";
        });
        if (
          oneA.length + oneM.length === 0 ||
          oneA.length + oneM.length === 1
        ) {
          return true;
        }
        return false;
      }),
      //      判断按钮是否可用  当校验失败时不可用
      canRun: computed(() => {
        let canRun = 1;
        const controllerCanRun =
          root.$store.state.controller.sellRateCanRun *
          root.$store.state.controller.buyRateCanRun *
          root.$store.state.controller.holdDateCanRun *
          root.$store.state.controller.pressureRateCanRun *
          root.$store.state.controller.maxHoldCanRun *
          root.$store.state.controller.modelNameCanRun *
          root.$store.state.controller.stopProfitCanRun *
          root.$store.state.controller.stopLossCanRun *
          state.intoMarketCanRun *
          state.outMarketCanRun *
          state.windCtrlCanRun;
        if (state.formValidate.selectedIndexs.length === 0) {
          return canRun * controllerCanRun;
        } else {
          for (let i = 0; i < state.formValidate.selectedIndexs.length; i++) {
            for (
              let j = 0;
              j < state.formValidate.selectedIndexs[i].params.length;
              j++
            ) {
              canRun =
                canRun * root.formValidate.selectedIndexs[i].params[j].canRun;
            }
          }
          return canRun * controllerCanRun;
        }
      }),
      //      目前二次筛选指标只能选一个
      secondaryScreenOnlyOnce: computed(() => {
        return state.formValidate.selectedIndexs.some(function(item) {
          return item.className.indexOf("B") !== -1;
        });
      }),
      //      目前风控指标只能选一个
      windControlOnlyOnce: computed(() => {
        return state.formValidate.selectedIndexs.some(function(item) {
          return item.className.indexOf("C") !== -1;
        });
      }),
      canReduction: computed(() => {
        return !root.$store.state.selectedIndexs.length;
      }),
      canDetailReport: computed(() => {
        return root.$store.state.runResultIsEmpty(
          root.$store.state.model.report
        );
      }),
      routerPath: computed(() => {
        return root.$router.path;
      }),
      queryIndexs: computed(() => {
        let temp = [];
        //          把所有的指标  类名和名字存入要查询的数组
        state.indexs.price.forEach(ele => {
          temp.push({
            value: ele.number,
            label: ele.message
          });
        });
        state.indexs.marketValue.forEach(ele => {
          temp.push({
            value: ele.number,
            label: ele.message
          });
        });
        state.indexs.listingDate.forEach(ele => {
          temp.push({
            value: ele.number,
            label: ele.message
          });
        });
        state.indexs.code.forEach(ele => {
          temp.push({
            value: ele.number,
            label: ele.message
          });
        });
        state.indexs.trade.forEach(ele => {
          temp.push({
            value: ele.number,
            label: ele.message
          });
        });
        state.indexs.classic.forEach(ele => {
          temp.push({
            value: ele.number,
            label: ele.message
          });
        });
        return temp;
      }),
      isCustomise: computed(() => {
        return root.$store.state.andOrNot === "customize";
      }),
      outMarketList: computed(() => {
        let symbol = {
          and: "&",
          or: "|",
          not: "$"
        };
        var temp = state.formValidate.selectedIndexs.filter(function(item) {
          return (
            item.type.indexOf("sell") !== -1 ||
            (item.className === "" && item.selectModelClass === "outMarket")
          );
        });
        //        console.log(state.formValidate.selectedIndexs);
        if (root.$store.state.andOrNot !== "customize") {
          for (let i = 0; i < temp.length; i++) {
            temp[i].nextRelationship = symbol[root.$store.state.andOrNot];
          }
        } else {
          //            若中间有的框框为空  则默认为and
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].nextRelationship === "") {
              temp[i].nextRelationship = symbol["and"];
            }
          }
        }
        //        犯了浅拷贝和赋值的错误
        //        let temp1 = JSON.parse(JSON.stringify(temp));
        //        实现深拷贝
        for (let i = 0; i < temp.length; i++) {
          temp[i]["className"] = temp[i]["className"].replace("sell", "A");
        }
        state.formValidate.outMarketListTemp = temp;
        return temp;
      })

      //        输入框失去焦点时  抛出错误标志
    });
    const intoMarketErrorLogo = () => {
      state.errorLogo = "intoMarket";
    };
    const outMarketErrorLogo = () => {
      state.errorLogo = "outMarket";
    };
    const windCtrlErrorLogo = () => {
      state.errorLogo = "windCtrl";
    };
    const select = name => {
      state.activeName = name;
    };
    const selectIndex = () => {
     
    };
    //修改回测日期触发
    const changeStartDate = date => {
      let start = new Date(date).getTime();
      let end = new Date(state.formValidate.controller.backEnd).getTime();
      if ((end - start) / 86400000 < 30) {
        state.$message.error("回测区间最小是30天");
        state.formValidate.controller.backEnd = new Date(date).setDate(
          new Date(date).getDate() + 30
        );
      }
    };
    const changeEndDate = date => {
      let start = new Date(state.formValidate.controller.backStart).getTime();
      let end = new Date(date).getTime();
      if ((end - start) / 86400000 < 30) {
        state.$message.error("回测区间最小是30天");
        state.formValidate.controller.backStart = new Date(date).setDate(
          new Date(date).getDate() - 30
        );
      }
    };
    //      选择出市值标
    const selectIndexSell = () => {};
    const run = () => {
      // //          日期格式化
      // const that = state;
      // const hasA = that.formValidate.selectedIndexs.some(function(item) {
      //   return item.className.indexOf("A") !== -1;
      // });
      // const hasB = that.formValidate.selectedIndexs.some(function(item) {
      //   return item.className.indexOf("B") !== -1;
      // });
      // const hasM = that.formValidate.selectedIndexs.some(function(item) {
      //   return item.className === "";
      // });
      // if (!hasA && !hasM) {
      //   //            如果模型数量大于1的话
      //   state.$message.warning("请选择选股指标或者我的模型");
      // } else if (!hasB) {
      //   state.$message.warning("请选择二次筛选指标");
      // } else {
      //   let modelPara = combineIndicator(
      //     that.formValidate,
      //     that.$store.state.controller
      //   );
      //   if (modelPara.split(/A|B|C/).length - 1 > 60) {
      //     //                  若最后的选股指标个数超过20个，报错
      //     that.$message.error("您所选的指标过多，无法回测");
      //   } else {
      //     let intoMarketStr = checkStr(
      //       state.formValidate.andOrNotIntoMarketLeft,
      //       state.formValidate.andOrNotIntoMarketRight,
      //       state.formValidate.intoMarketListTemp
      //     );
      //     let outMarketStr = checkStr(
      //       state.formValidate.andOrNotOutMarketLeft,
      //       state.formValidate.andOrNotOutMarketRight,
      //       state.formValidate.outMarketListTemp
      //     );
      //     let windCtrlStr = checkStr(
      //       state.formValidate.andOrNotWindCtrlLeft,
      //       state.formValidate.andOrNotWindCtrlRight,
      //       state.formValidate.windCtrlListTemp
      //     );
      //     if (!isBracketBalance(intoMarketStr)) {
      //       state.intoMarketCanRun = 0;
      //     } else if (!isBracketBalance(outMarketStr)) {
      //       state.outMarketCanRun = 0;
      //     } else if (!isBracketBalance(windCtrlStr)) {
      //       state.windCtrlCanRun = 0;
      //     } else {
      //       //              console.log(modelPara);
      //       //                  判断自定义的指标之间的关系格式是否正确
      //       //              满足回测条件  开始回测
      //       that.modal = true;
      //       //                取消回测按钮先屏蔽
      //       that.isRunning = true;
      //       //                  选股指标不超过20个
      //       that.modelId = generateUUID();
      //     }
      //   }
      // }
    };
    //      用户取消扣点操作
    const cancelRedPoint = () => {
      state.modalRedPoint = false;
    };
    //      用户继续扣点操作
    const redPoint = () => {
      const that = state;
      that.modalRedPoint = false;
      that.modal = true;
    };
    //      正在排队时，取消智能回测  通知后端停止
    const cancelGeneticTest = () => {
      // const that = state;
      // postRemoteReqTodo("/stock/genetic/cancelgeneticcalculation", {}).then(
      //   res => {
      //     let data = res.data;
      //     that.geneticWaitingModal = false;
      //     that.geneticLoading = false;
      //     clearTimeout(that.geneticSetTime);
      //     if (data.status === "SUCCESS") {
      //       that.$message.success("您已成功取消本次智能回测");
      //     } else if (data.status === "USER_NOT_FOUND") {
      //       jumpLogin(that);
      //     } else {
      //       that.$message.error(data.status);
      //     }
      //   }
      // );
    };
    //      改变智能回测的等级时   提示给用户不同的情况
    const changeGeneticLevel = () => {};
    const getGeneticTimes = () => {
      // const that = state;
      // let geneticInfo = [
      //   { name: "初级", value: 300 },
      //   { name: "中级", value: 5000 },
      //   { name: "高级", value: 20000 }
      // ];
      // new Promise(function(resolve, reject) {
      //   postRemoteReqTodo("/stock/genetic/rungeneticmodel/getgenetictime", {})
      //     .then(res => {
      //       let data = res.data;
      //       let status = data.status;
      //       //          console.log(data);
      //       if (status === "SUCCESS") {
      //         let times = data.message.split("-");
      //         that.primaryTimes = times[0];
      //         that.intermediateTimes = times[1];
      //         that.advancedTimes = times[2];
      //         that.geneticPointInsuff = false;
      //         resolve();
      //       } else if (status === "ERROR") {
      //         that.$message.error(data.message);
      //       } else if (status === "USER_NOT_FOUND") {
      //         jumpLogin(that);
      //       }
      //     })
      //     .catch(() => {
      //       that.$message.error("连接服务器异常，请您稍后重试");
      //     });
      // }).then(function() {
      //   that.changeGeneticLevel(0);
      // });
    };
    const geneticTest = () => {
      // const that = state;
      // const hasA = that.formValidate.selectedIndexs.some(function(item) {
      //   return item.className.indexOf("A") !== -1;
      // });
      // const hasB = that.formValidate.selectedIndexs.some(function(item) {
      //   return item.className.indexOf("B") !== -1;
      // });
      // const hasM = that.formValidate.selectedIndexs.some(function(item) {
      //   return item.className === "";
      // });
      // if (!hasA && !hasM) {
      //   //            如果模型数量大于1的话
      //   that.$message.warning("请选择选股指标或者我的模型");
      // } else if (!hasB) {
      //   that.$message.warning("请选择二次筛选指标");
      // } else {
      //   let modelPara = combineIndicator(
      //     that.formValidate,
      //     that.$store.state.controller
      //   );
      //   if (modelPara.split(/A|B|C/).length - 1 > 60) {
      //     //                  若智能回测的指标个数超过20个，报错
      //     that.$message.error("您所选的指标过多，无法回测");
      //   } else {
      //     //               填写回测次数
      //     let intoMarketStr = checkStr(
      //       state.formValidate.andOrNotIntoMarketLeft,
      //       state.formValidate.andOrNotIntoMarketRight,
      //       state.formValidate.intoMarketListTemp
      //     );
      //     let outMarketStr = checkStr(
      //       state.formValidate.andOrNotOutMarketLeft,
      //       state.formValidate.andOrNotOutMarketRight,
      //       state.formValidate.outMarketListTemp
      //     );
      //     let windCtrlStr = checkStr(
      //       state.formValidate.andOrNotWindCtrlLeft,
      //       state.formValidate.andOrNotWindCtrlRight,
      //       state.formValidate.windCtrlListTemp
      //     );
      //     if (!isBracketBalance(intoMarketStr)) {
      //       state.intoMarketCanRun = 0;
      //     } else if (!isBracketBalance(outMarketStr)) {
      //       state.outMarketCanRun = 0;
      //     } else if (!isBracketBalance(windCtrlStr)) {
      //       state.windCtrlCanRun = 0;
      //     } else {
      //       state.intoMarketCanRun = 1;
      //       state.outMarketCanRun = 1;
      //       state.windCtrlCanRun = 1;
      //       that.getGeneticTimes();
      //       that.geneticModal = true;
      //     }
      //   }
      // }
    };
    const okGeneticTest = () => {
      //          选择好等级后  进行智能回测
      const that = state;
      that.geneticLoading = true;
      // let modelPara = combineIndicator(
      //   that.formValidate,
      //   that.$store.state.controller
      // );
      // //        console.log(modelPara);
      // let geneticLevel = [300, 5000, 20000];
      // let startDate = state.$store.state.controller.backStart;
      // let endDate = state.$store.state.controller.backEnd;
      // let dateRange = (
      //   (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      //   31622400000
      // ).toFixed(1);
      // (function geneticRun() {
      //   postRemoteReqTodo("/stock/genetic/rungeneticmodel", {
      //     modelPara: modelPara,
      //     level: that.geneticLevel,
      //     loopTime: Math.ceil(geneticLevel[that.geneticLevel] / dateRange)
      //   })
      //     .then(res => {
      //       //首先清空我的模型  再重新获取
      //       let data = res.data;
      //       that.geneticModal = false;
      //       that.geneticLoading = false;
      //       if (data.status === "SUCCESS") {
      //         that.geneticWaitingModal = false;
      //         clearTimeout(that.geneticSetTime);
      //         that.$router.push("/model/genetictest");
      //       } else if (data.status === "WAITING") {
      //         that.geneticWaitingModal = true;
      //         //            若没有计算资源  每隔2s请求一次
      //         that.geneticSetTime = setTimeout(geneticRun, 2000);
      //       } else if (data.status === "USER_NOT_FOUND") {
      //         that.geneticWaitingModal = false;
      //         loginTimeoutPrompt(that);
      //       } else {
      //         that.geneticWaitingModal = false;
      //         clearTimeout(that.geneticSetTime);
      //         that.$message.error(data.message);
      //       }
      //     })
      //     .catch(() => {
      //       clearTimeout(that.geneticSetTime);
      //       that.$message.error("连接服务器异常，请您稍后重试");
      //     });
      // })();
    };
    //      切换模型
    const switchModel = () => {
      state.formValidate.andOrNotIntoMarketLeft = "";
      state.formValidate.andOrNotIntoMarketRight = "";
      state.formValidate.andOrNotOutMarketLeft = "";
      state.formValidate.andOrNotOutMarketRight = "";
      state.formValidate.andOrNotWindCtrlLeft = "";
      state.formValidate.andOrNotWindCtrlRight = "";
      // this.getRandomModel(state.formValidate.selectedIndexs, state);
    };
    // 指标还原
    const indexRevert = () => {
      let className;
      state.formValidate.selectedIndexs.forEach(ele => {
        if (ele.className !== "") {
          className = ele.className;
          root.$store.commit("SELECT_INDICATOR", {
            indicatorId: className,
            indicators: state.indicators
          });
        } else {
          root.$store.commit("SELECTMODEL", {
            modelIndex: ele.modelIndex,
            index: ele.modelIndex,
            selectModelClass: ele.selectModelClass,
            number: ele.number
          });
        }
      });
      state.formValidate.selectedIndexs.splice(
        0,
        state.formValidate.selectedIndexs.length / 2
      );
    };
    //      单个删除指标
    const handleRemove = index => {
      const that = state;
      let intoMarketList = state.formValidate.intoMarketListTemp.filter(
        function(item) {
          return (
            item.className !==
              that.formValidate.selectedIndexs[index].className &&
            item.type.indexOf("A") !== -1
          );
        }
      );
      let outMarketList = state.formValidate.outMarketListTemp.filter(function(
        item
      ) {
        return (
          item.className !==
            that.formValidate.selectedIndexs[index].className &&
          item.type.indexOf("sell") !== -1
        );
      });
      let windCtrlList = state.formValidate.windCtrlListTemp.filter(function(
        item
      ) {
        return (
          item.className !==
            that.formValidate.selectedIndexs[index].className &&
          item.type.indexOf("C") !== -1
        );
      });
      state.formValidate.selectedIndexs.splice(index, 1);
      //                console.log(intoMarketList);
      let intoMarketStr = checkStr(
        state.formValidate.andOrNotIntoMarketLeft,
        state.formValidate.andOrNotIntoMarketRight,
        intoMarketList
      );
      let outMarketStr = checkStr(
        state.formValidate.andOrNotOutMarketLeft,
        state.formValidate.andOrNotOutMarketRight,
        outMarketList
      );
      let windCtrlStr = checkStr(
        state.formValidate.andOrNotWindCtrlLeft,
        state.formValidate.andOrNotWindCtrlRight,
        windCtrlList
      );
      if (!isBracketBalance(intoMarketStr)) {
        state.intoMarketCanRun = 0;
      } else if (!isBracketBalance(outMarketStr)) {
        state.outMarketCanRun = 0;
      } else if (!isBracketBalance(windCtrlStr)) {
        state.windCtrlCanRun = 0;
      } else {
        state.intoMarketCanRun = 1;
        state.outMarketCanRun = 1;
        state.windCtrlCanRun = 1;
      }
    };
    //解锁某一个指标的参数
    const unlockPara = (indexs, index, param) => {
      state.formValidate.selectedIndexs[indexs][param][index].locked = 0;
    };
    //      锁定某一个参数
    const lockPara = (indexs, index, param) => {
      state.formValidate.selectedIndexs[indexs][param][index].locked = 1;
    };
    //s锁定某一个指标  只限于智能回测
    const lockIndicator = index => {
      state.formValidate.selectedIndexs[index].locked = 1;
    };
    const unlockIndicator = index => {
      root.$store.state.selectedIndexs[index].locked = 0;
    };
    //      获取当前指标指向  获取当前指标单个输入框指向
    const getParentIndex = (index, childIndex) => {
      root.$store.commit("GET_CURRENT_DIRCTION", {
        parentIndex: index,
        childIndex: childIndex
      });
    };
    //      获取下拉选项的指向
    const getSelectIndex = (value, index) => {
      state.formValidate.currentInputIndex.parentIndex = index;
    };
    // 清空指标
    const empty = () => {
      //          左右两边的符号也要清除掉
      state.formValidate.andOrNotIntoMarketLeft = "";
      state.formValidate.andOrNotIntoMarketRight = "";
      state.formValidate.andOrNotOutMarketLeft = "";
      state.formValidate.andOrNotOutMarketRight = "";
      state.formValidate.andOrNotWindCtrlLeft = "";
      state.formValidate.andOrNotWindCtrlRight = "";
      state.formValidate.selectedIndexs.splice(
        0,
        state.formValidate.selectedIndexs.length
      );
    };
    //      查看详细报告
    const detailReport = () => {
      state.$router.push("/model/singletest");
    };
    // 选择指标是模型的情况下   添加模型
    const selectModel = index => {
      state.modelIndex = index;
      //        state.selectModelClass = 'intoMarket';
      root.$store.commit("SELECTMODEL", {
        modelIndex: index,
        index: index,
        number: "MODEL" + index,
        selectModelClass: "intoMarket"
      });
    };
    //出市指标是模型的情况下
    const selectModelOutMarket = index => {
      state.modelIndex = index;
      //        state.selectModelClass = 'outMarket';
      root.$store.commit("SELECTMODEL", {
        modelIndex: index,
        index: index,
        number: "MODEL" + index,
        selectModelClass: "outMarket"
      });
    };
    //      风控指标选择指标是模型的情况下
    const selectModelWindCtrl = index => {
      state.modelIndex = index;
      //        state.selectModelClass = 'windCtrl';
      root.$store.commit("SELECTMODEL", {
        modelIndex: index,
        index: index,
        number: "MODEL" + index,
        selectModelClass: "windCtrl"
      });
    };

    //      模糊查询输入框操作   选择指标改变时触发函数queryIndexChange,添加指标到所选指标中
    const queryIndexChange = value => {
      let indexClass;
      const that = state;
      state.indexs.price.forEach(ele => {
        if (ele.number === value) {
          indexClass = "price-index";
        }
      });
      state.indexs.marketValue.forEach(ele => {
        if (ele.number === value) {
          indexClass = "market-value-index";
        }
      });
      state.indexs.listingDate.forEach(ele => {
        if (ele.number === value) {
          indexClass = "listing-date-index";
        }
      });
      state.indexs.code.forEach(ele => {
        if (ele.number === value) {
          indexClass = "code-index";
        }
      });
      state.indexs.trade.forEach(ele => {
        if (ele.number === value) {
          indexClass = "trade-index";
        }
      });
      state.indexs.classic.forEach(ele => {
        if (ele.number === value) {
          indexClass = "classic-index";
        }
      });
      state.indexs.secondaryScreen.forEach(ele => {
        if (ele.number === value) {
          indexClass = "secondary-screen";
        }
      });
      state.indexs.windControl.forEach(ele => {
        if (ele.number === value) {
          indexClass = "wind-control";
        }
      });
      root.$store.commit("SELECTINDEXS", {
        indexClass: indexClass,
        indexId: value,
        indexs: that.indexs
      });
      //
    };
    const cancelTest = () => {
      const that = state;
      that.modal = false;
    };
    //      获取指标信息
    const getIndexInfo = index => {
      const that = state;
      that.modelInfo.splice(0, that.modelInfo.length);
      let selectedIndexsTemp = [];
      let symbol = {
        andOrNotIntoMarketLeft: "",
        andOrNotIntoMarketRight: "",
        andOrNotOutMarketLeft: "",
        andOrNotOutMarketRight: "",
        andOrNotWindCtrlLeft: "",
        andOrNotWindCtrlRight: ""
      };
      let controller = {};
      resolveIndicator(
        selectedIndexsTemp,
        root.$store.state.selectedIndexs[index].modelPara,
        controller,
        symbol
      );
      if (
        root.$store.state.selectedIndexs[index].selectModelClass ===
        "intoMarket"
      ) {
        //            只显示入市指标及其关系
        //          that.modelInfo = indicatorToDes(classifyIndicator(selectedIndexsTemp, 'A', 'intoMarket'), symbol.andOrNotIntoMarketLeft, symbol.andOrNotIntoMarketRight);
        state.modelInfo = indicatorToDes.apply(state, [
          classifyIndicator(selectedIndexsTemp, "A", "intoMarket"),
          symbol.andOrNotIntoMarketLeft,
          symbol.andOrNotIntoMarketRight
        ]);
        state.modelInfo.unshift("入市指标及其关系如下：");
      } else if (
        root.$store.state.selectedIndexs[index].selectModelClass === "outMarket"
      ) {
        if (
          root.$store.state.selectedIndexs[index].modelPara.indexOf(
            "[SELL]"
          ) === -1
        ) {
          state.modelInfo = ["出市指标：无"];
        } else {
          //            that.modelInfo = indicatorToDes(classifyIndicator(selectedIndexsTemp, 'sell', 'outMarket'), symbol.andOrNotOutMarketLeft, symbol.andOrNotOutMarketRight);
          state.modelInfo = indicatorToDes.call(
            state,
            classifyIndicator(selectedIndexsTemp, "sell", "outMarket"),
            symbol.andOrNotOutMarketLeft,
            symbol.andOrNotOutMarketRight
          );
          state.modelInfo.unshift("出市指标及其关系如下：");
        }
      } else {
        if (
          root.$store.state.selectedIndexs[index].modelPara.indexOf(
            "[DAN_CON]"
          ) === -1
        ) {
          state.modelInfo = ["风控指标：无"];
        } else {
          that.modelInfo = indicatorToDes(
            classifyIndicator(selectedIndexsTemp, "C", "windCtrl"),
            symbol.andOrNotWindCtrlLeft,
            symbol.andOrNotWindCtrlRight
          );
          state.modelInfo.unshift("风控指标及其关系如下：");
        }
      }
    };
    const indexDes = () => {
      state.$Notice.open({
        //          title: '指标说明',
        desc:
          '<ul style="font-size: 1rem">' +
          '<li style="margin-top: .5rem"><span style="font-weight:bold;color: #80848f">选股指标（左侧灰色）：</span><span>包括价格类指标到经典类指标，与我的模型至少要选择一个；</span></li>' +
          '<li style="margin-top: .5rem"><span style="font-weight:bold;color: #3091f2">二次筛选指标（左侧蓝色）：</span><span>您必须选择一个；</span></li>' +
          '<li style="margin-top: .5rem"><span style="font-weight:bold;color: #19be6b">风控指标（绿色）：</span><span>您可选可不选，若选择只能选择一个；</span></li>' +
          '<li style="margin-top: .5rem"><span style="font-weight:bold;color: #FF9933">我的模型（左侧橙色）：</span><span>也就是已经保存的模型，与选股指标至少选择一个。我的模型通过与或非功能，可以和其他任意选股指标或者模型自由组合。</span></li></ul>',
        duration: 0
      });
    };
    const changeAndOrNot = () => {};
    return {
      state,
      changeAndOrNot,
      indexDes,
      getIndexInfo,
      cancelTest,
      queryIndexChange,
      selectModelWindCtrl,
      selectModelOutMarket,
      selectModel,
      detailReport,
      empty,
      getSelectIndex,
      getParentIndex,
      unlockIndicator,
      intoMarketErrorLogo,
      lockIndicator,
      lockPara,
      unlockPara,
      handleRemove,
      indexRevert,
      switchModel,
      okGeneticTest,
      geneticTest,
      getGeneticTimes,
      changeGeneticLevel,
      cancelGeneticTest,
      redPoint,
      cancelRedPoint,
      run,
      selectIndexSell,
      changeEndDate,
      changeStartDate,
      selectIndex,
      select,
      windCtrlErrorLogo,
      outMarketErrorLogo
    };
  },
  components: {
    IndicatorList
  }
};
</script>
<style rel="stylesheet" lang="scss" scoped>
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
}

.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}

.layout-nav {
  width: 420px;
  margin: 0 auto;
}

.layout-assistant {
  width: 300px;
  margin: 0 auto;
  height: inherit;
}

.layout-content {
  height: 50rem;
  background: #fff;
  border-radius: 4px;
}

.layout-copy {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}

ul.index li {
  /*font-size: 1rem;*/
  cursor: pointer; // text-align: center;
  // border-bottom: 1px solid;
  transition: 500ms;
}

ul.index li:hover {
  color: #000000;
}

ul.selected-index {
  /*font-size: 1rem;*/
  div.index-name {
    width: 40%;
    text-align: right;
    /*border: 1px dashed #0f9ae0;*/
    border-right: none;
  }
  li {
    margin-top: 0.5rem;
  }
}

.demo-spin-col {
  height: 100px;
  position: relative;
  /*border: 1px solid #eee;*/
}

input {
  padding: 0;
}

.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
  margin-top: -1rem;
}

.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
  background: #fff;
  height: 15rem;
  overflow: auto;
  padding: 1rem;
  padding-bottom: 0;
}

.ivu-form-item-content {
  font-size: 0.875rem;
  & > .ivu-form-item-error-tip {
    padding-top: 1px;
  }
}

.ivu-form .ivu-form-item > .ivu-form-item-label {
  font-size: 0.875rem;
}

.ivu-radio-group > .ivu-radio-wrapper {
  font-size: 0.875rem;
}

.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav {
  /*width: 100%;*/
  & > .ivu-tabs-tab {
    &:nth-last-of-type(1) {
      background-color: #ff9933;
      color: #fff;
      &:hover {
        color: #2d8cf0;
      }
    }
    &:nth-last-of-type(2) {
      background-color: #19be6b;
      color: #fff;
      &:hover {
        color: #2d8cf0;
      }
    }
    &:nth-last-of-type(3) {
      background-color: #3091f2;
      color: #fff;
      &:hover {
        color: #2d8cf0;
      }
    }
    &:nth-last-of-type(n + 4) {
      background-color: #80848f;
      color: #fff;
      &:hover {
        color: #2d8cf0;
      }
    }
  }
  /*#f8f8f9*/
  & > .ivu-tabs-tab-active {
    &:nth-last-of-type(1) {
      background-color: #fff;
      color: #2d8cf0;
    }
    &:nth-last-of-type(2) {
      background-color: #fff;
      color: #2d8cf0;
    }
    &:nth-last-of-type(3) {
      background-color: #fff;
      color: #2d8cf0;
    }
    &:nth-last-of-type(n + 4) {
      background-color: #fff;
      color: #2d8cf0;
    }
  }
}

span.error-logo {
  color: #ff0000;
  font-size: 1rem;
  line-height: 2;
}
</style>