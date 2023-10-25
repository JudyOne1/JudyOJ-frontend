<template>
  <div>
    <a-row id="globleHeader" align="center" :wrap="false">
      <a-col flex="100px"></a-col>
      <a-col flex="auto">
        <a-menu
          mode="horizontal"
          :selected-keys="selectedKeys"
          @menu-item-click="doMenuClick"
        >
          <a-menu-item
            key="0"
            :style="{ padding: 0, marginRight: '38px' }"
            disabled
          >
            <div class="title-bar">
              <img class="logo" src="../assets/MyLogo.png" />
            </div>
          </a-menu-item>
          <a-menu-item v-for="item in visibleRoutes" :key="item.path"
            >{{ item.name }}
          </a-menu-item>
        </a-menu>
      </a-col>
      <a-col flex="100px">
        <div v-if="flag == true">
          <a
            id="pleaseLogin"
            href="/user/login"
            style="
              font-family: Arial;
              font-size: 16px;
              font-weight: bold;
              color: #165dff;
            "
            >点我登录</a
          >
        </div>
        <div v-else>
          <a-button type="text" shape="round" size="large" @click="goToProfile">
            {{ store.state.user?.loginUser.userName ?? "未登录" }}
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRoute, useRouter } from "vue-router";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";

const selectedKeys = ref(["/"]);
const router = useRouter();
const store = useStore();
// const route = useRoute();
let flag = false;
if (store.state.user?.loginUser.userName == "未登录") {
  flag = true;
}

router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

const goToProfile = (id: string) => {
  // 在这里实现跳转到个人页面的逻辑
  router.push({
    path: `/profile/${id}`,
  });
};

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

// setTimeout(() => {
//   store.dispatch("user/getLoginUser", {
//     userName: "Judy",
//     userRole: ACCESS_ENUM.ADMIN,
//   });
// }, 3000);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title-bar {
}

.logo {
  height: 48px;
}
</style>
