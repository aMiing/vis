<template>
  <!-- 新屏幕的信息录入表单弹窗 -->
  <el-dialog title="新建屏幕" :visible.sync="visible" append-to-body>
    <el-form ref="form" :model="form" label-width="80px" label-suffix=":" :rules="rules">
      <el-form-item label="屏幕名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "CreateDialog",
  data() {
    return {
      visible: false,
      form: {
        title: "",
      },
      rules: {
        title: [{ required: true, message: "请输入名称", trigger: ["blur", "chage"] }],
      },
    };
  },
  methods: {
    async show() {
      await this.$nextTick();
      this.$refs?.form?.clearValidate();
      this.$refs?.form?.resetFields();
      this.visible = true;
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$emit("submit", { ...this.form });
          this.visible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
