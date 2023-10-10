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
        <div>{{ store.state.user?.loginUser.userName ?? "未登录" }}</div>
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
