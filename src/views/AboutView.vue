<template>
  <div class="about">
    <div
      :style="{
        boxSizing: 'border-box',
        width: '100%',
        padding: '40px',
        backgroundColor: 'var(--color-fill-2)',
      }"
    >
      <a-row :gutter="20" :style="{ marginBottom: '20px' }">
        <a-col :span="8">
          <a-card hoverable :style="{ width: '360px' }">
            <template #cover>
              <div
                :style="{
                  height: '310px',
                  overflow: 'hidden',
                }"
              >
                <img
                  :style="{ width: '100%', transform: 'translateY(-20px)' }"
                  alt="dessert"
                  src="https://judyblogimg.oss-cn-shenzhen.aliyuncs.com/test01.jfif"
                />
              </div>
            </template>
            <a-card-meta title="">
              <template #description>
                <div style="display: flex; flex-direction: row">
                  <h1 style="margin: 0px 20px auto">Judy</h1>
                  <a-button
                    type="outline"
                    style="width: 30%; margin-left: 120px"
                    @click="goToBlog"
                    class="button"
                    >我的博客
                  </a-button>
                </div>
                <br />
                <h3 style="margin: 0px 0px 20px 20px">大三学生 | jvav程序猿</h3>
              </template>
            </a-card-meta>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="网站介绍" :bordered="false" :style="{ width: '100%' }">
            <template #extra>
              <a-link>More</a-link>
            </template>
            Card content
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="碎碎念" :bordered="false" :style="{ width: '100%' }">
            <template #extra>
              <a-link>More</a-link>
            </template>
            Card content
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";

const goToBlog = async () => {
  window.location.href = "http://judyblog.top";
};
</script>

<style scoped></style>
