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
            <h2>JudyOJ在线判题评测系统</h2>
            <h4>
              基于Vue和Spring Boot、Spring Cloud
              Alibaba构建的前后端分离，分布式架构的评测系统，但是部署是单体式项目，问就是云服务器内存不够了🤣
            </h4>
            <h4>📌目前仅支持Java语言，后续有空会继续扩展😊</h4>
            <h4>📌支持ACM模式，核心代码模式，对数器模式三种判题模式</h4>
            <h4>
              📌网站使用技术栈：Vue3+Vuex+ArcoDesign组件库+SpringBoot2.7+Docker
            </h4>
            <h4>
              📌使用到的组件：Markdown富文本编辑器,Monaca Editor摩纳哥代码编辑器
            </h4>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="碎碎念" :bordered="false" :style="{ width: '100%' }">
            <p
              style="
                font-family: 'Arial', sans-serif;
                font-size: 16px;
                line-height: 1.5;
              "
            >
              🎯这个项目前前后后做了有一个多月，之前我对前端是处于仅仅了解三件套的状态，现在会使用vue3了，在制作网站的过程中感觉前端还挺有趣的😂，网站也不够美观
              请大家多多关照😘。中间遇到了不少难题，但多多少少都克服了
              ,现在做出的前端网站已经符合我的预期了——用来给我刷算法，未来我在使用这个网站刷题的过程中我也会不断完善不断优化的😁。
              <br />
              ——Judy 2023.11.13
              <br />
              <br />
              <br />
              <br />
              欢迎大家提出建议，邮箱mzyy867734122@163.com
            </p>
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
