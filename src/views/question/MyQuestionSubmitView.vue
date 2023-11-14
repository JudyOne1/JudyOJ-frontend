<template>
  <div id="MyQuestionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题目id" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '200px' }"
          placeholder="选择编程语言"
        >
          <a-option>java</a-option>
          <a-option disabled>cpp</a-option>
          <a-option disabled>go</a-option>
          <a-option disabled>html</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="questionId" label="题目状态" style="min-width: 240px">
        <a-select
          v-model="searchParams.status"
          :style="{ width: '200px' }"
          placeholder="请选择判题状态"
        >
          <a-option value="0">待判题</a-option>
          <a-option value="1">判题中</a-option>
          <a-option value="2">判题完成</a-option>
          <a-option value="3">判题失败</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>

        <a-button
          type="outline"
          status="warning"
          @click="reset"
          style="width: 50px; margin-left: 20px"
          >重置
        </a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #judgeInfo="{ record }">
        <a-space wrap>
          <a-tag
            v-for="(value, key) of record.judgeInfo"
            :key="key"
            color="blue"
            bordered
            >{{ key }}:{{ value ? value : "暂无数据" }}
          </a-tag>
        </a-space>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button
            type="primary"
            size="small"
            shape="round"
            @click="doQuestionPage(record)"
          >
            查看详情
          </a-button>
        </a-space>
        <a-space>
          <a-button
            style="margin-left: 10px"
            type="primary"
            status="success"
            size="small"
            shape="round"
            @click="doQuestionPageWithAns(record)"
          >
            提交记录
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import { useStore } from "vuex";

const tableRef = ref();
const store = useStore();
const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
  userId: store.state.user.loginUser.id,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
  //判题状态（0 - 待判题、1 - 判题中、2 - 成功、3 - 失败）
  dataList.value.map((item) => {
    switch (item.status) {
      case 0:
        item.status = "待判题";
        break;
      case 1:
        item.status = "判题中...";
        break;
      case 2:
        item.status = "判题完成";
        break;
      case 3:
        item.status = "判题失败";
        break;
    }
  });
  dataList.value.map((item) => {
    item.judgeInfo = JSON.stringify(item.judgeInfo);
    item.judgeInfo = JSON.parse(item.judgeInfo);
  });
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

const columns = [
  {
    title: "题目名称",
    dataIndex: "questionVO.title",
    tooltip: true,
    ellipsis: true,
    width: 120,
  },
  {
    title: "提交号",
    dataIndex: "id",
    tooltip: true,
    ellipsis: true,
    width: 120,
  },
  {
    title: "编程语言",
    dataIndex: "language",
    width: 90,
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "判题状态",
    dataIndex: "status",
    width: 100,
  },
  {
    title: "题目 id",
    dataIndex: "questionId",
    tooltip: true,
    ellipsis: true,
    width: 120,
  },
  // {
  //   title: "提交者 id",
  //   dataIndex: "userId",
  //   tooltip: true,
  //   ellipsis: true,
  //   width: 120,
  // },
  {
    title: "创建时间",
    slotName: "createTime",
    width: 180,
  },
  {
    slotName: "optional",
    width: 240,
  },
];

const doQuestionPageWithAns = (question: QuestionSubmitQueryRequest) => {
  router.push({
    path: `/view/question/${question.questionId}`,
    query: {
      showAnswers: "true", // 添加一个名为showAnswers的查询参数，值为'true'
    },
  });
};
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    userId: store.state.user.loginUser.id,
    current: page,
  };
};

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionInfoPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    userId: store.state.user.loginUser.id,
    current: 1,
  };
};

const onlyMe = () => {
  if (!store.state.user) {
    message.error("请登录");
    return;
  }
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    userId: store.state.user.loginUser.id,
    current: 1,
  };
};

const reset = () => {
  if (!store.state.user) {
    message.error("请登录");
    return;
  }
  // 这里需要重置搜索页号
  searchParams.value = {
    questionId: undefined,
    language: undefined,
    pageSize: 10,
    current: 1,
    userId: undefined,
  };
};
</script>

<style scoped>
#MyQuestionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
