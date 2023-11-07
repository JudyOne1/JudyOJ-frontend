<template>
  <div id="ViewQuestionView">
    <a-row>
      <a-col :md="9" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig.timeLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ question.judgeConfig.memoryLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ question.judgeConfig.stackLimit ?? 0 }}
                </a-descriptions-item>
              </a-descriptions>
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
              <MdViewer :value="question.content || '出现问题，请联系管理员'" />
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comments" title="评论"> 评论区开发中</a-tab-pane>
          <a-tab-pane key="idea" title="思路"> 思路开发中</a-tab-pane>
          <a-tab-pane key="answer" title="题解" disabled>
            <!--{{ (question && question.answer) || "暂无题解" }}-->
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="15" :xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item
            field="language"
            label="编程语言"
            style="min-width: 120px"
          >
            <a-select
              v-model="form.language"
              :style="{ width: '120px' }"
              placeholder="选择编程语言"
            >
              <a-option>java</a-option>
              <a-option disabled>cpp</a-option>
              <a-option disabled>js</a-option>
              <a-option disabled>python</a-option>
            </a-select>
          </a-form-item>
          <a-form-item
            field="modeSelectCN"
            label="模式选择"
            style="min-width: 240px"
          >
            <a-select
              v-model="modeSelectCN"
              :style="{ width: '200px' }"
              placeholder="选择编程语言"
            >
              <a-option :disabled="ACMdisabled">ACM模式</a-option>
              <a-option :disabled="CCMdisabled">核心代码模式</a-option>
              <a-option :disabled="CMdisabled">计数器模式</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <code-editor
          v-bind:value="form.code as string"
          :language="form.language"
          :handleChange="changeCode"
        />
        <a-button
          type="primary"
          style="min-width: 200px; margin-top: 20px"
          @click="doSubmit"
        >
          提交代码
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect, withDefaults, defineProps } from "vue";
import {
  QuestionControllerService,
  QuestionVO,
  QuestionSubmitAddRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();

let ACMdisabled = true;
let CCMdisabled = true;
let CMdisabled = true;

const form = ref<QuestionSubmitAddRequest>({
  code: "",
  language: "java",
  modeSelect: 1,
});

let modeSelectCN = "ACM模式";

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  const defaultCode = await QuestionControllerService.getDefaultCodeUsingGet(
    props.id as any
  );
  form.value.code = defaultCode.data;
  console.log(defaultCode);
  console.log(form.value.code);
  if (res.code === 0) {
    question.value = res.data;
    switch (question.value?.mode) {
      case 1:
        ACMdisabled = false;
        break;
      case 2:
        CCMdisabled = false;
        break;
      case 3:
        CCMdisabled = false;
        ACMdisabled = false;
        break;
      case 4:
        CMdisabled = false;
        break;
      case 5:
        CMdisabled = false;
        ACMdisabled = false;
        break;
      case 6:
        CCMdisabled = false;
        CMdisabled = false;
        break;
      case 7:
        ACMdisabled = false;
        CCMdisabled = false;
        CMdisabled = false;
        break;
    }
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  switch (modeSelectCN) {
    case "ACM模式":
      modeSelectCN = "1";
      break;
    case "核心代码模式":
      modeSelectCN = "2";
      break;
    case "计数器模式":
      modeSelectCN = "4";
      break;
  }
  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    modeSelect: parseInt(modeSelectCN),
    questionId: question.value.id,
  });
  console.log(form.value);
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败," + res.message);
  }
};

const changeCode = (value: string) => {
  form.value.code = value;
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
</script>

<style scoped>
#ViewQuestionView {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
