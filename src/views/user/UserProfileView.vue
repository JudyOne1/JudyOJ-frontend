<template>
  <div class="about">
    <div class="author-info">
      <img
        src="https://judyblogimg.oss-cn-shenzhen.aliyuncs.com/test01.jfif"
        alt="头像"
      />
      <h2>Judy</h2>
      <h3>大三学生 | jvav程序猿</h3>
      <ul>
        <li>
          <a href="mailto:mzyy867734122@163.com"
            >Email: mzyy867734122@163.com</a
          >
        </li>
        <li>
          <a href="https://github.com/JudyOne1" target="_blank"
            >Github: JudyOne1</a
          >
        </li>
        <li>
          <a href="https://gitee.com/JudyGitee" target="_blank"
            >Gitee: JudyGitee</a
          >
        </li>
        <li>
          <a href="http://judyblog.top" target="_blank">Blog: judyblog.top</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gravatarUrl:
        "https://www.gravatar.com/avatar/your_gravatar_hash?s=150&d=identicon",
    };
  },
};
</script>

<style scoped>
.about {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background-color: #f5f5f5;
}

.author-info {
  text-align: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.author-info img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.author-info h2 {
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
}

.author-info ul {
  list-style-type: none;
  padding: 0;
}

.author-info li {
  margin-bottom: 10px;
}

.author-info a {
  color: #1890ff;
  text-decoration: none;
}

.author-info a:hover {
  text-decoration: underline;
}
</style>
