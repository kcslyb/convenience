<template>
  <div class="login-container">
    <div class="login-img"></div>
    <div class="login-form">
      <form>
        <div class="form-item">
          <span class="form-item-label">用户名</span>
          <input v-model="userDto.userName" class="form-item-input"/>
        </div>
        <div class="form-item">
          <span class="form-item-label">密码</span>
          <input v-model="userDto.passWord" class="form-item-input" type="password"/>
        </div>
      </form>
      <div class="login-button">
        <button class="submit-button" @click="handleSubmit">登录</button>
      </div>
    </div>
    <div class="forgot">
      <span @click="forgotPassword">Forgot your password</span>
    </div>
    <div class="login-footer">
      <span @click="createAccount">Create an account</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data () {
    return {
      height: window.innerHeight,
      userDto: {
        userName: '',
        passWord: '',
        remember: true
      }
    }
  },
  methods: {
    handleSubmit () {
      if (!this.userDto.userName) {
        this.$notify({
          type: 'warning',
          message: '用户名不能为空'
        })
        return
      }
      if (!this.userDto.passWord) {
        this.$notify({
          type: 'warning',
          message: '密码不能为空'
        })
        return
      }
      this.$store.dispatch('Login', this.userDto).then(res => {
        if (res) {
          this.$router.push('/home')
        }
      }).catch((e) => { console.info(e) })
    },
    forgotPassword () {
      console.info(this.userDto)
    },
    createAccount () {
      console.info(this.userDto)
    }
  }
}
</script>

<style scoped lang="less">
  .login-container {
    width:100%;
    display: flex;
    min-height: 100vh;
    justify-content: flex-end;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }

  .login-img {
    width: 100%;
    min-height: 38vh;
    background-color: #A2BBBB;
    background-image: url("../assets/img/background-login.jpeg");
    background-repeat: no-repeat;
    background-size: 100%;
  }

  .login-form {
    min-height: 44vh;
  }

  .login-log {
    .log-name {
      display: inline-block;
      width: 4rem;
      height: 4rem;
      font-size: 1.6rem;
      font-weight: bold;
      border-radius: 4rem;
      line-height: 4rem;
      border: .1rem solid #0B2F30;
    }
  }

  .login-button {
    padding-top: 3.8rem;
    .submit-button {
      width: 90%;
      color: #0B2F30;
      font-size: 1rem;
      font-weight: bold;
      background-color: #A2BBBB;
      border: 1px solid #A2BBBB;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      -webkit-appearance: none;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      transition: .1s;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      padding: .7rem .6rem;
      border-radius: .4rem;
    }
  }

  .form-item {
    width: 95%;
    display: flex;
    align-items: center;
    padding-top: 2rem;
    .form-item-label {
      width: 5rem;
      color: #0B2F30;
      padding-left: 2rem;
    }
    .form-item-input {
      -webkit-appearance: none;
      background-color: transparent;
      background-image: none;
      border: none;
      border-radius: .2rem;
      border-bottom: .1rem solid #A2BBBB;
      box-sizing: border-box;
      color: #0B2F30;
      display: inline-block;
      font-size: inherit;
      height: 2rem;
      line-height: 2rem;
      outline: none;
      padding: 0 1.5rem;
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      box-shadow: inset 0 0 0 1000px #ffffff!important;
    }
  }

  .forgot {
    width: 100%;
    cursor: pointer;
    padding: 1.5rem 0;
    font-size: .8rem;
  }

  .login-footer {
    width: 100%;
    color: white;
    cursor: pointer;
    padding: 1.2rem 0;
    background-color: rgb(69 104 98);
  }
</style>
