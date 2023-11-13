<template>
  <div id="ViewQuestionView">
    <a-row>
      <a-col :md="9" :xs="24">
        <a-tabs default-active-key="question">
          <a-scrollbar style="height: 100%; overflow: auto">
            <div style="height: 450px; width: 500px">
              <a-tab-pane key="question" title="题目">
                <a-card v-if="question" :title="question.title">
                  <a-descriptions
                    title="判题条件"
                    :column="{ xs: 1, md: 2, lg: 3 }"
                  >
                    <a-descriptions-item label="时间限制ms">
                      {{ question.judgeConfig.timeLimit ?? 0 }}
                    </a-descriptions-item>
                    <a-descriptions-item label="内存限制kb">
                      {{ question.judgeConfig.memoryLimit ?? 0 }}
                    </a-descriptions-item>
                    <a-descriptions-item label="堆栈限制kb">
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
                  <MdViewer
                    :value="question.content || '出现未知错误，请联系管理员'"
                  />
                </a-card>
              </a-tab-pane>
            </div>
          </a-scrollbar>
          <a-tab-pane key="comments" title="评论" disabled>
            评论区开发中
          </a-tab-pane>
          <a-tab-pane key="idea" title="思路" disabled>
            思路区开发中
          </a-tab-pane>
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
              :style="{ width: '150px' }"
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
              :style="{ width: '220px' }"
              placeholder="选择做题模式"
              @change="changeMode"
            >
              <a-option disabled>如果无法获取代码请刷新网站</a-option>
              <a-option :disabled="ACMdisabled">ACM模式</a-option>
              <a-option :disabled="CCMdisabled">核心代码模式</a-option>
              <a-option :disabled="CMdisabled">计数器模式</a-option>
            </a-select>
          </a-form-item>
          <a-button
            type="outline"
            @click="handleBtn"
            shape="round"
            status="success"
            style="margin-left: 40px"
            >复制代码
          </a-button>
          <a-popconfirm content="如果无法格式化代码请刷新网站" type="warning">
            <a-button
              type="outline"
              @click="handleFormat"
              style="margin-left: 10px; margin-bottom: 10px"
              shape="round"
              status="danger"
              >格式化代码
            </a-button>
          </a-popconfirm>
          <a-button
            type="outline"
            @click="reload"
            style="margin-left: 10px; margin-bottom: 10px"
            shape="round"
            status="warning"
            >刷新
          </a-button>
        </a-form>
        <code-editor
          v-model="localCode"
          :value="localCode as string"
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
import {
  onMounted,
  ref,
  watchEffect,
  withDefaults,
  defineProps,
  watch,
  toRaw,
} from "vue";
import {
  QuestionControllerService,
  QuestionVO,
  QuestionSubmitAddRequest,
  UserControllerService,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import { editor } from "monaco-editor";
import * as http from "http";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
// 如果页面地址包含 showAnswers=true，视为展示页面
const showPage = route.query.showAnswers === "true";

window.onload = function () {
  message.info({
    content: "如果没有题目数据请刷新页面",
    closable: true,
  });
};
const handleFormat = () => {
  if (form.value.modeSelect === 1) {
    editor.getModels()[0]?.setValue(ACMdefaultcode.toString());
  } else if (form.value.modeSelect === 0) {
    editor.getModels()[0]?.setValue("");
    message.error("请选择判题模式");
  } else {
    editor.getModels()[0]?.setValue(CCMdefaultcode.toString());
  }
};
//获取编辑器中的文本
const handleBtn = () => {
  // 创建一个textarea元素，用于复制代码
  var copyTextarea = document.createElement("textarea");

  // 设置textarea元素的值为代码块中的内容
  copyTextarea.value = localCode;

  // 将textarea元素插入到页面中
  document.body.appendChild(copyTextarea);

  // 选中textarea元素的内容
  copyTextarea.select();
  copyTextarea.setSelectionRange(0, 99999); // 兼容移动设备

  // 复制选中的内容
  document.execCommand("copy");

  // 从页面中移除临时的textarea元素
  document.body.removeChild(copyTextarea);

  // 提示用户代码已经复制
  message.success("代码已复制到剪贴板");
};

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();
const questionSubmit = ref<QuestionSubmitAddRequest>();

let ACMdisabled = true;
let CCMdisabled = true;
let CMdisabled = true;

const form = ref<QuestionSubmitAddRequest>({
  code: "",
  language: "",
  modeSelect: 0,
});

let modeSelectCN = ref("");
const ACMdefaultcode =
  "import java.util.Scanner;\n" +
  "\n" +
  "public class Main {\n" +
  "    public static void main(String[] args) {\n" +
  "\n" +
  "    }\n" +
  "}";
let CCMdefaultcode: string;
let localCode = ACMdefaultcode;

const loadData = async () => {
  if (showPage) {
    const res = await UserControllerService.getLoginUserUsingGet();
    if (res.code === 0) {
      const userData =
        await QuestionControllerService.getQuestionSubmitByUserUsingGet(
          props.id as any,
          res.data?.id as any
        );
      if (userData.code === 0) {
        questionSubmit.value = userData.data;
        editor
          .getModels()[0]
          ?.setValue(questionSubmit.value?.code ?? "未知错误");
      } else {
        message.error("该题没有提交记录");
      }
    } else {
      message.error("未登录，无法获取对应信息");
    }
  }
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  const defaultCode = await QuestionControllerService.getDefaultCodeUsingGet(
    props.id as any
  );
  if (defaultCode.code === 0) {
    CCMdefaultcode = defaultCode.data ? defaultCode.data.toString() : "";
  }

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

const router = useRouter();

/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  console.log(form.value);
  if (res.code === 0) {
    message.success("提交成功");
    router.push({
      path: `/question_submit`,
    });
  } else {
    message.error("提交失败," + res.message);
  }
};
const changeMode = () => {
  console.log("mode change");
  switch (modeSelectCN.value) {
    case "ACM模式":
      // modeSelectCN = ref("1");
      form.value.modeSelect = 1;
      editor.getModels()[0]?.setValue(ACMdefaultcode.toString());
      break;
    case "核心代码模式":
      // modeSelectCN = ref("2");
      form.value.modeSelect = 2;
      editor.getModels()[0]?.setValue(CCMdefaultcode.toString());
      break;
    case "计数器模式":
      // modeSelectCN = ref("4");
      editor.getModels()[0]?.setValue(CCMdefaultcode.toString());
      form.value.modeSelect = 4;
      break;
  }
};
const changeCode = (value: string) => {
  form.value.code = value;
  localCode = value;
};

const reload = () => {
  window.location.reload();
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
