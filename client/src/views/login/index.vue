<template>
  <div class="login-container">
    <div class="form-container">
      <el-form :model="form" :rules="rules" label-suffix=":" ref="form">
        <h2 class="title">用户登录</h2>
        <el-form-item prop="usercode" label="账号">
          <el-input
            type="text"
            v-model="form.usercode"
            autocomplete="off"
            placeholder="请输入账号"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="请输入密码"
            show-password
            autocomplete="off"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        </el-form-item>

        <el-form-item>
          <div class="btn-group">
            <el-button @click.native.prevent="handleReset">重置</el-button>
            <el-button type="primary" @click.native.prevent="handleSubmit" :loading="logining">
              登录
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { authService } from '@/service';
import loginInput from './login-input.vue';
export default {
  name: 'Login',
  components: { loginInput },
  data() {
    return {
      logining: false,
      form: {
        usercode: 'admin',
        password: '123456',
      },
      rules: {
        usercode: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      checked: true,
    };
  },
  methods: {
    handleReset() {
      this.$refs.form.resetFields();
    },
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.logining = true;
          //响应成功
          await authService.login(this.form);
          this.$router.push({ path: '/' });
          this.logining = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--grey-1);
}
.form-container {
  width: 30%;
  min-width: 350px;
  // margin: 180px auto;
  border-radius: 5px;
  padding: 24px 36px;
  border: 1px solid var(--grey-10);
  box-shadow: 0 0 25px var(--grey-10);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .title {
    text-align: center;
    padding: 12px 0 24px;
  }
  .btn-group {
    display: flex;
    justify-content: center;
  }
}
</style>
