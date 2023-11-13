<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题号" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '320px' }"
          placeholder="选择编程语言"
        >
          <a-option>java</a-option>
          <!--          <a-option>cpp</a-option>-->
          <!--          <a-option>go</a-option>-->
          <!--          <a-option>html</a-option>-->
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
        <a-button
          type="primary"
          status="success"
          @click="onlyMe"
          style="width: 100px; margin-left: 20px"
          >只看我的
        </a-button>
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
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
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

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
  userId: undefined,
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
    title: "题号",
    dataIndex: "questionId",
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
    width: 120,
  },
  {
    title: "题目 id",
    dataIndex: "questionId",
    width: 120,
  },
  {
    title: "提交者 id",
    dataIndex: "userId",
    tooltip: true,
    ellipsis: true,
    width: 120,
  },
  {
    title: "创建时间",
    slotName: "createTime",
    width: 120,
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
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
    current: 1,
  };
};
const store = useStore();
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
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
