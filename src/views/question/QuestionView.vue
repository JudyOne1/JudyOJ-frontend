<template>
  <div id="QuestionView">
    <a-form
      :model="searchParams"
      layout="inline"
      style="width: 80%; margin: auto auto"
    >
      <a-form-item field="title" label="题目名称" style="min-width: 240px">
        <a-input v-model="searchParams.title" placeholder="请输入题目名称" />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 240px">
        <a-input-tag v-model="searchParams.tags" placeholder="请输入标签" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
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
      style="max-width: 80%; margin: auto auto; text-align: center"
    >
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        <a-space wrap>
          {{
            `${
              record.submitNum ? record.acceptedNum / record.submitNum : "0"
            }% (${record.acceptedNum}/${record.submitNum})`
          }}
        </a-space>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doQuestionPage(record)">
            做题
          </a-button>
        </a-space>
        <a-space>
          <a-button
            style="margin-left: 10px"
            type="primary"
            status="success"
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
  Page_Question_,
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import * as querystring from "querystring";
import { useRouter } from "vue-router";
import moment from "moment";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  pageSize: 8,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
    console.log(dataList.value);
  } else {
    message.error("加载失败，" + res.message);
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

// {id: "1", title: "A+ D", content: "新的题目内容", tags: "["二叉树"]", answer: "新的答案", submitNum: 0,…}

const columns = [
  {
    title: "题号",
    tooltip: true,
    ellipsis: true,
    dataIndex: "id",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
    width: 120,
  },
  {
    title: "题目名称",
    tooltip: true,
    ellipsis: true,
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
    width: 150,
  },
  {
    title: "创建时间",
    slotName: "createTime",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
    width: 120,
  },
  {
    slotName: "optional",
    width: 200,
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
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

const router = useRouter();

const doQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

const doQuestionPageWithAns = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
    query: {
      showAnswers: "true", // 添加一个名为showAnswers的查询参数，值为'true'
    },
  });
};
</script>

<style scoped>
#manageQuestionView {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
