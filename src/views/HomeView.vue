<template>
  <div class="home">
    <code-editor :value="value" :handle-change="onChange" />
    <md-editor :value="value" :handle-change="onChange" />
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue";
import HelloWorld from "@/components/HelloWorld.vue";
import MdEditor from "@/components/MdEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue"; // @ is an alias to /src

const value = ref();

const onChange = (v: string) => {
  value.value = v;
  console.log(v);
};
</script>
