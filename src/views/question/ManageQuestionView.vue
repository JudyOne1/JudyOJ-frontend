<template>
  <div id="manageQuestionView">
    <a-table
      bordered="ture"
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
      style="width: 80%; margin: auto auto"
    >
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #judgeConfig="{ record }">
        <a-space wrap>
          <a-tag
            v-for="(value, key) of record.judgeConfig"
            :key="key"
            color="blue"
            bordered
            >{{ key }}:{{ value }}
          </a-tag>
        </a-space>
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doUpdate(record)"> 修改</a-button>
          <a-button status="danger" @click="doDelete(record)">删除</a-button>
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
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import * as querystring from "querystring";
import { useRouter } from "vue-router";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
    dataList.value.map((item) => {
      item.tags = JSON.parse(item.tags);
    });
    dataList.value.map((item) => {
      const date = new Date(item.createTime);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 注意月份从0开始，所以要加1
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();

      item.createTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    });
    dataList.value.map((item) => {
      item.judgeConfig = JSON.parse(item.judgeConfig);
    });
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
    title: "id",
    tooltip: true,
    ellipsis: true,
    dataIndex: "id",
    width: 120,
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  // {
  //   title: "内容",
  //   dataIndex: "content",
  // },
  {
    title: "标签",
    slotName: "tags",
  },
  // {
  //   title: "答案",
  //   dataIndex: "answer",
  // },
  {
    title: "提交数",
    dataIndex: "submitNum",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
    width: 100,
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
    width: 100,
  },
  {
    title: "判题配置",
    slotName: "judgeConfig",
  },
  {
    title: "判题用例",
    tooltip: true,
    ellipsis: true,
    dataIndex: "judgeCase",
  },
  // {
  //   title: "用户id",
  //   dataIndex: "userId",
  // },
  {
    title: "创建时间",
    dataIndex: "createTime",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "操作",
    slotName: "optional",
    width: 160,
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const doDelete = async (question: Question) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (res.code === 0) {
    message.success("删除成功");
    loadData();
  } else {
    message.error("删除失败");
  }
};

const router = useRouter();

const doUpdate = (question: Question) => {
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
  });
};
</script>

<style scoped>
#manageQuestionView {
}
</style>
