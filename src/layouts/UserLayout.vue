<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <img class="logo" src="../assets/MyLogo.png" />
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="http://JudyBlog.top"> SuperOJ By Judy </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#userLayout {
  text-align: center;
  background: url("../assets/scattered-forcefields.png") 0% 0%/100% 100%;
}

#userLayout.logo {
  width: 64px;
  height: 64px;
}

#userLayout .header {
  margin-top: 16px;
  margin-bottom: 16px;
  //box-shadow: #eee 1px 1px 5px;
}

#userLayout .content {
  //background: linear-gradient(to right, #fefefe, #fff); margin-bottom: 16px; padding: 20px;
}

#userLayout .footer {
  //background: #efefef; padding: 16px; position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script></script>
