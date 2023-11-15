<template>
  <div id="QuestionSubmitInfoView">
    <a-space direction="vertical" size="large" fill>
      <a-descriptions
        :data="dataList"
        title="User Info"
        layout="inline-horizontal"
        size="large"
        style="width: 80%; margin-top: 20px"
        :column="1"
        bordered
        table-layout="fixed"
      />
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Page_Question_,
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
  QuestionSubmitAddRequest,
  QuestionVO,
  UserControllerService,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import * as querystring from "querystring";
import { useRouter } from "vue-router";
import moment from "moment";
import { defineProps, withDefaults } from "vue/dist/vue";
import { editor } from "monaco-editor";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

let queryForm = ref({
  questionId: 1,
  userId: 1,
  submitId: -1,
});
const question = ref<QuestionVO>();
const questionSubmit = ref<QuestionSubmitAddRequest>();

const loadData = async () => {
  const user = await UserControllerService.getLoginUserUsingGet();
  queryForm.value.submitId = props.id as any;
  if (user.code === 0) {
    let userData =
      await QuestionControllerService.getQuestionSubmitByUserUsingPost(
        queryForm.value
      );
    if (userData.code === 0) {
      questionSubmit.value = userData.data;
      const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
        questionSubmit.value?.questionId as any
      );
      if (res.code === 0) {
        question.value = res.data;
        console.log(question.value);
        console.log(question.value?.title);
        console.log(question.value?.id);
      } else {
        message.error("加载失败，" + res.message);
      }
    } else {
      message.error("该题没有提交记录");
    }
  } else {
    message.error("未登录，无法获取对应信息");
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const dataList = ref([
  {
    label: "题目名",
    value: question.value?.title as any,
    span: 3,
  },
  {
    label: "题号",
    value: question.value?.id,
  },
  {
    label: "标签",
    value: "Beijing",
  },
  {
    label: "用户id",
    value: "Beijing",
  },
  {
    label: "用户名",
    value: "Yingdu Building, Zhichun Road, Beijing",
  },
  {
    label: "判题配置",
    value: "Yingdu Building, Zhichun Road, Beijing",
  },
  {
    label: "代码",
    value: "Yingdu Building, Zhichun Road, Beijing",
  },
  {
    label: "Address",
    value: "Yingdu Building, Zhichun Road, Beijing",
  },
]);

const router = useRouter();
</script>

<style scoped>
#manageQuestionSubmitInfoView {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
