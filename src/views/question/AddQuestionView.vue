<template>
  <div id="addQuestionView">
    <h2 style="text-align: center">创建题目</h2>
    <a-form
      :model="form"
      label-align="center"
      style="margin: auto auto; width: 39%"
      layout="vertical"
    >
      <a-form-item field="title" label="标题">
        <a-input
          v-model="form.title"
          placeholder="请输入标题"
          style="width: 450px"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag
          v-model="form.tags"
          placeholder="请选择标签"
          allow-clear
          style="width: 450px"
        />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MdEditor :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
      </a-form-item>
      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制(ms)">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制(kb)">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制(kb)">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <div style="margin-top: 16px" />
      <a-form-item
        label="选择代码判题模式"
        :content-flex="false"
        :merge-props="false"
      >
        <a-checkbox-group
          v-model="modeSelect"
          @change="handleChange"
          label="模式选择"
        >
          <a-checkbox value="1" :disabled="disabledACM" @click="toggleInputACM"
            >ACM模式
          </a-checkbox>
          <a-checkbox value="2" :disabled="disabledCCM" @click="toggleInputCCM"
            >核心代码模式
          </a-checkbox>
          <a-checkbox value="4" @click="toggleInputCM">对数器模式</a-checkbox>
        </a-checkbox-group>
        <a-form-item
          label="测试用例配置"
          :content-flex="false"
          :merge-props="false"
          style="margin-left: 0px; margin-top: 20px"
          v-if="showInputACM"
        >
          <a-form-item
            v-for="(judgeCaseItem, index) of form.judgeCase"
            :key="index"
            no-style
          >
            <a-space
              direction="vertical"
              style="margin-top: 16px; min-width: 300px"
            >
              <a-form-item
                :field="`form.judgeCase[${index}].input`"
                :label="`输入用例 ${index}`"
                :key="index"
              >
                <a-input
                  v-model="judgeCaseItem.input"
                  placeholder="请输入测试输入用例"
                />
              </a-form-item>
              <a-form-item
                :field="`form.judgeCase[${index}].output`"
                :label="`输出用例 ${index}`"
                :key="index"
              >
                <a-input
                  v-model="judgeCaseItem.output"
                  placeholder="请输入测试输出用例"
                />
              </a-form-item>
              <a-button status="danger" @click="handleDelete(index)">
                删除
              </a-button>
            </a-space>
          </a-form-item>
          <div style="margin-top: 32px">
            <a-button @click="handleAdd" type="dashed" status="success"
              >新增测试用例
            </a-button>
          </div>
        </a-form-item>
        <div :style="{ marginTop: '20px' }" v-if="showInputCCM">
          <a-button type="primary" @click="handleClickCCMdefaultCode"
            >核心代码模式-defaultCode编写
          </a-button>
        </div>
        <a-drawer
          :width="340"
          :height="580"
          :visible="visibleCCMdefaultCode"
          :placement="'bottom'"
          @ok="handleOKCCMdefaultCode"
          @cancel="handleCancelCCMdefaultCode"
          unmountOnClose
        >
          <template #title>核心代码模式defaultCode</template>
          <div>
            <code-editor
              :value="form.defaultCode as string"
              language="java"
              :handleChange="changeDefaultCode"
            />
          </div>
        </a-drawer>
        <div :style="{ marginTop: '20px' }" v-if="showInputCCM">
          <a-button type="primary" @click="handleClickCCMhelpCode"
            >核心代码模式-helpCode编写
          </a-button>
        </div>
        <a-drawer
          :width="340"
          :height="580"
          :visible="visibleCCMhelpCode"
          :placement="'bottom'"
          @ok="handleOKCCMhelpCode"
          @cancel="handleCancelCCMhelpCode"
          unmountOnClose
        >
          <template #title>核心代码模式helpCode</template>
          <div>
            <code-editor
              :value="form.helpCode as string"
              language="java"
              :handleChange="changeHelpCode"
            />
          </div>
        </a-drawer>
        <a-form-item
          label="测试用例配置"
          :content-flex="false"
          :merge-props="false"
          style="margin-left: 0px"
          v-if="showInputCCM"
        >
          <a-form-item
            v-for="(judgeCaseItem, index) of form.judgeCase"
            :key="index"
            no-style
          >
            <a-space
              direction="vertical"
              style="margin-top: 16px; min-width: 300px"
            >
              <a-form-item
                :field="`form.judgeCase[${index}].input`"
                :label="`输入用例 ${index}`"
                :key="index"
              >
                <a-input
                  v-model="judgeCaseItem.input"
                  placeholder="请输入测试输入用例"
                />
              </a-form-item>
              <a-form-item
                :field="`form.judgeCase[${index}].output`"
                :label="`输出用例 ${index}`"
                :key="index"
              >
                <a-input
                  v-model="judgeCaseItem.output"
                  placeholder="请输入测试输出用例"
                />
              </a-form-item>
              <a-button status="danger" @click="handleDelete(index)">
                删除
              </a-button>
            </a-space>
          </a-form-item>
          <div style="margin-top: 32px">
            <a-button @click="handleAdd" type="dashed" status="success"
              >新增测试用例
            </a-button>
          </div>
        </a-form-item>
        <div :style="{ marginTop: '20px' }" v-if="showInputCM">
          <a-button type="primary" @click="handleClickCMdefaultCode"
            >对数器模式-defaultCode编写
          </a-button>
        </div>
        <a-drawer
          :width="340"
          :height="580"
          :visible="visibleCMdefaultCode"
          :placement="'bottom'"
          @ok="handleOKCMdefaultCode"
          @cancel="handleCancelCMdefaultCode"
          unmountOnClose
        >
          <template #title>对数器模式defaultCode</template>
          <div>
            <code-editor
              :value="form.defaultCode as string"
              language="java"
              :handleChange="changeDefaultCode"
            />
          </div>
        </a-drawer>
        <div :style="{ marginTop: '20px' }" v-if="showInputCM">
          <a-button type="primary" @click="handleClickCMcountCode"
            >对数器模式-countCode编写
          </a-button>
        </div>
        <a-drawer
          :width="340"
          :height="580"
          :visible="visibleCMcountCode"
          :placement="'bottom'"
          @ok="handleOKCMcountCode"
          @cancel="handleCancelCMcountCode"
          unmountOnClose
        >
          <template #title>对数器模式countCode</template>
          <title>对数器模式countCode</title>
          <div>
            <code-editor
              :value="form.countCode as string"
              language="java"
              :handleChange="changeCountCode"
            />
          </div>
        </a-drawer>
      </a-form-item>
      <div style="margin-top: 16px" />
      <a-form-item>
        <a-button
          type="primary"
          style="min-width: 200px; margin: 10px 10px auto"
          @click="doSubmit"
          shape="round"
          >提交
        </a-button>
        <a-space />
        <a-button
          type="secondary"
          style="min-width: 200px; margin: 10px 10px auto"
          @click="doSubmitAndStayHere"
          shape="round"
          >提交并留在此页面
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";
import CodeEditor from "@/components/CodeEditor.vue";

const modeSelect = ref(["0"]);
const mode = ref(0);

let disabledACM = false;
let disabledCCM = false;
const disableClickACM = () => {
  disabledCCM = !disabledCCM;
};
const disableClickCCM = () => {
  disabledACM = !disabledACM;
};

const handleChange = (values) => {
  mode.value = 0;
  for (let i = 0; i < values.length; i++) {
    mode.value += parseInt(values[i]);
  }
  form.value.mode = mode.value;
};

const visibleCCMhelpCode = ref(false);
const visibleCCMdefaultCode = ref(false);
const visibleCMcountCode = ref(false);
const visibleCMdefaultCode = ref(false);

const handleClickCCMhelpCode = () => {
  visibleCCMhelpCode.value = true;
};
const handleClickCCMdefaultCode = () => {
  visibleCCMdefaultCode.value = true;
};
const handleClickCMcountCode = () => {
  visibleCMcountCode.value = true;
};
const handleClickCMdefaultCode = () => {
  visibleCMdefaultCode.value = true;
};

const handleOKCCMhelpCode = () => {
  visibleCCMhelpCode.value = false;
};
const handleOKCCMdefaultCode = () => {
  visibleCCMdefaultCode.value = false;
};
const handleOKCMcountCode = () => {
  visibleCMcountCode.value = false;
};
const handleOKCMdefaultCode = () => {
  visibleCMdefaultCode.value = false;
};

const handleCancelCCMhelpCode = () => {
  visibleCCMhelpCode.value = false;
};
const handleCancelCCMdefaultCode = () => {
  visibleCCMdefaultCode.value = false;
};
const handleCancelCMcountCode = () => {
  visibleCMcountCode.value = false;
};
const handleCancelCMdefaultCode = () => {
  visibleCMdefaultCode.value = false;
};

let showInputACM = false;
let showInputCCM = false;
let showInputCM = false;
let language = "";

const changeDefaultCode = (value: string) => {
  form.value.defaultCode = value;
};
const changeHelpCode = (value: string) => {
  form.value.helpCode = value;
};
const changeCountCode = (value: string) => {
  form.value.countCode = value;
};

function toggleInputACM() {
  disableClickACM();
  showInputACM = !showInputACM;
}

function toggleInputCCM() {
  disableClickCCM();
  showInputCCM = !showInputCCM;
}

function toggleInputCM() {
  showInputCM = !showInputCM;
}

const route = useRoute();
// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes("update");

let form = ref({
  title: "",
  tags: [],
  answer: "",
  content: "",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
  mode: 0,
  defaultCode:
    "class Solution {\n" +
    "    public static int solute(int[] gifts,int k){\n" +
    "\n" +
    "\n" +
    "    }\n" +
    "}",
  countCode:
    "// for test\n" +
    "public static int[] getRandomArrayNoRepeat(int size) {\n" +
    "int[] arr = new int[(int) (Math.random() * size) + 1];\n" +
    "for (int i = 0; i < arr.length; i++) {\n" +
    "    arr[i] = i;\n" +
    "}\n" +
    "for (int i = 0; i < arr.length; i++) {\n" +
    "    int swapIndex = (int) (Math.random() * arr.length);\n" +
    "    int tmp = arr[swapIndex];\n" +
    "    arr[swapIndex] = arr[i];\n" +
    "    arr[i] = tmp;\n" +
    "}\n" +
    "return arr;\n" +
    "}\n" +
    "\n" +
    "// for test\n" +
    "public static int[] getRandomArray(int size, int max) {\n" +
    "    int[] arr = new int[(int) (Math.random() * size) + 1];\n" +
    "    for (int i = 0; i < arr.length; i++) {\n" +
    "        arr[i] = (int) (Math.random() * max) - (int) (Math.random() * max);\n" +
    "    }\n" +
    "    return arr;\n" +
    "}\n" +
    "\n" +
    "// for test\n" +
    "public static int[][] rightWay(int[] arr) {\n" +
    "    int[][] res = new int[arr.length][2];\n" +
    "    for (int i = 0; i < arr.length; i++) {\n" +
    "        int leftLessIndex = -1;\n" +
    "        int rightLessIndex = -1;\n" +
    "        int cur = i - 1;\n" +
    "        while (cur >= 0) {\n" +
    "            if (arr[cur] < arr[i]) {\n" +
    "                leftLessIndex = cur;\n" +
    "                break;\n" +
    "            }\n" +
    "            cur--;\n" +
    "        }\n" +
    "        cur = i + 1;\n" +
    "        while (cur < arr.length) {\n" +
    "            if (arr[cur] < arr[i]) {\n" +
    "                rightLessIndex = cur;\n" +
    "                break;\n" +
    "            }\n" +
    "            cur++;\n" +
    "        }\n" +
    "        res[i][0] = leftLessIndex;\n" +
    "        res[i][1] = rightLessIndex;\n" +
    "    }\n" +
    "    return res;\n" +
    "}\n" +
    "\n" +
    "// for test\n" +
    "public static boolean isEqual(int[][] res1, int[][] res2) {\n" +
    "    if (res1.length != res2.length) {\n" +
    "        return false;\n" +
    "    }\n" +
    "    for (int i = 0; i < res1.length; i++) {\n" +
    "        if (res1[i][0] != res2[i][0] || res1[i][1] != res2[i][1]) {\n" +
    "            return false;\n" +
    "        }\n" +
    "    }\n" +
    "\n" +
    "    return true;\n" +
    "}\n" +
    "\n" +
    "// for test\n" +
    "public static void printArray(int[] arr) {\n" +
    "    for (int i = 0; i < arr.length; i++) {\n" +
    '        System.out.print(arr[i] + " ");\n' +
    "    }\n" +
    "    System.out.println();\n" +
    "}\n" +
    "\n" +
    "public static void main(String[] args) {\n" +
    "    int size = 10;\n" +
    "    int max = 20;\n" +
    "    int testTimes = 2000000;\n" +
    '    System.out.println("测试开始");\n' +
    "    for (int i = 0; i < testTimes; i++) {\n" +
    "        int[] arr1 = getRandomArrayNoRepeat(size);\n" +
    "        int[] arr2 = getRandomArray(size, max);\n" +
    "        //getNearLessNoRepeat\n" +
    "        if (!isEqual(getNearLessNoRepeat(arr1), rightWay(arr1))) {\n" +
    '            System.out.println("Oops!");\n' +
    "            printArray(arr1);\n" +
    "            break;\n" +
    "        }\n" +
    "        //getNearLess\n" +
    "        if (!isEqual(getNearLess(arr2), rightWay(arr2))) {\n" +
    '            System.out.println("Oops!");\n' +
    "            printArray(arr2);\n" +
    "            break;\n" +
    "        }\n" +
    "    }\n" +
    '    System.out.println("测试结束");\n' +
    "}",
  helpCode:
    "    public static void main(String[] args) {\n" +
    "\n" +
    '        //        String input = "gifts = [5,1,4,3,6], k = 10";\n' +
    "\n" +
    "        ArrayList<ParamsInfo> params = getParamsByClass(args[0]);\n" +
    '        Parameter[] ParameterInfos = reflectMethod("solute", params);\n' +
    "        if (ParameterInfos == null) {\n" +
    '            throw new RuntimeException("出现未知错误");\n' +
    "        }\n" +
    "        if (params.size() != ParameterInfos.length) {\n" +
    '            throw new RuntimeException("系统出现未知错误");\n' +
    "        }\n" +
    "        //-------------------------------------------------------------\n" +
    "        //        int[] gifts;\n" +
    "        //        int k;\n" +
    "        int i = 0;\n" +
    "        //        gifts = JAVAparseStringTo1ArrayNoNull(params.get(i++).getValue());\n" +
    "        //        k = Integer.parseInt(params.get(i).getValue());\n" +
    "        System.out.println(solute(JAVAparseStringTo1ArrayNoNull(params.get(i++).getValue()), Integer.parseInt(params.get(i).getValue())));\n" +
    "        //--------------------------------------------------------------\n" +
    "    }\n",
});

const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};

onMounted(() => {
  loadData();
});

/**
 * 根据题目 id 获取老的数据
 *
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    // json 转 js 对象
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("加载失败，" + res.message);
  }
};
const doSubmitAndStayHere = async () => {
  console.log(form.value);
  // 区分更新还是创建
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("更新成功");
    } else {
      message.error("更新失败，" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("创建成功");
    } else {
      message.error("创建失败，" + res.message);
    }
  }
};
const router = useRouter();
const doSubmit = async () => {
  console.log(form.value);
  // 区分更新还是创建
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("更新成功");
      router.push({
        path: `/manage/question`,
      });
    } else {
      message.error("更新失败，" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("创建成功");
      router.push({
        path: `/manage/question`,
      });
    } else {
      message.error("创建失败，" + res.message);
    }
  }
};
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};
</script>

<style scoped></style>
