<template>
  <div
    class="style-panel .pannal dataPannal"
    v-for="pageComponent in pageComponents"
    v-show="pageComponent.uid == showSetting"
  >
    <h3>
      <span style="padding: 0">{{ pageComponent.name.slice(0, 4) }}.v1.0.0</span>
    </h3>

    <el-input type="textarea" :rows="10" placeholder="请输入内容"></el-input>
  </div>
</template>
