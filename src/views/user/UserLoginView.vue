<template>
  <div id="userLogin">
    <!--    <h1>This is an login page</h1>-->
    <a-form
      style="max-width: 480px; margin: 0 auto"
      label-align="left"
      auto-label-width
      :model="form"
      @submit="handleSubmit"
    >
      <h2>用户登录</h2>
      <a-form-item field="userAccount" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item field="userPassword" tooltip="密码不少于8位" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          style="width: 480px"
          html-type="submit"
          shape="round"
          >登录
        </a-button>
        <a-button
          type="secondary"
          style="width: 180px; margin-left: 15px"
          @click="goToRegisterPage"
          shape="round"
          >还没账号？点我注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
const form = reactive({
  userAccount: "",
  userPassword: "",
});
const handleSubmit = async () => {
  if (form.userPassword == "") {
    message.info("请输入密码");
    return;
  } else if (form.userAccount == "") {
    message.info("请输入账号");
    return;
  }
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    // alert("login success");
    //登录成功，回到主页
    message.success("登录成功");
    await store.dispatch("user/getLoginUser");
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    message.error("失败原因: " + res.message);
  }
  // alert(JSON.stringify(form));
};

const goToRegisterPage = () => {
  router.push({
    path: "/user/register",
    replace: true,
  });
};
</script>
