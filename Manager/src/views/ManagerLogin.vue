<template>
    <div id='ManagerLogin'>
        <el-container>
        <el-header class="el-header-app">
            <el-row>
            <el-col :span='2' :offset='11'><div class='logo_image'><img src='../assets/logo_white.png'/></div></el-col>
            </el-row>
        </el-header>
        <el-main :style="{backgroundImage:'url('+ main_imgs[now_bg_index] +')', backgroundRepeat: 'no-repeat', backgroundSize:'cover', height: '83vh'}">
            <div class='el-card-log' align='center'>
                <el-card>
                    <div slot="header">
                        <span>您好管理员！请登录</span>
                    </div>
                    <el-form>
                        <el-form-item class='el-form-item-login'><el-input v-model.number="manager.id" placeholder="管理员ID" type="number" prefix-icon="el-icon-user-solid"></el-input></el-form-item>
                        <el-form-item class='el-form-item-login'><el-input v-model="manager.password" placeholder="密码" @keydown.enter.native='manager_login' prefix-icon="el-icon-lock" show-password></el-input></el-form-item>
                        <el-button @click.native="manager_login">登录</el-button>
                    </el-form>
                </el-card>
            </div>
        </el-main>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'ManagerLogin',
    data(){
        return{
            manager: {
                id: '',
                password: ''
            },
            now_bg_index: 0,
            main_imgs: [require('../assets/1.jpg'), require('../assets/2.jpg'), require('../assets/3.jpg'), require('../assets/4.jpg'), require('../assets/5.jpg'), require('../assets/6.jpg'), require('../assets/7.jpg')],
        }
    },
    created() {
        this.timer();
        this.$store.state.token = '';
        window.sessionStorage.setItem('store', JSON.stringify({}));
    },
    methods: {
        timer() {
            return setInterval(()=>{ 
                this.now_bg_index = (this.now_bg_index + 1) % 7;}, 3000)
        },

        manager_login: function() {
            //检查填写是否为空
            if(!this.manager.id)
                alert('请输入管理员ID');
            else if(!this.manager.password)
                alert('请输入密码');
            //填写正常，发送请求
            else{
                this.axios.post(this.$store.state.baseurl + '/login', this.manager)
                .then((result) => {
                    console.log(result.data);
                    var data = result.data;
                    if(data.message === 'none')
                        alert('ID不存在！');
                    else if(data.message === 'wrong')
                        alert('密码错误！请重新输入。');
                    else {
                        this.$store.state.info = data.manager;
                        this.$store.state.token = data.token;
                        sessionStorage.setItem('store', JSON.stringify(this.$store.state));
                        this.$router.push('index/shop_info');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        },
    }
}
</script>

<style scoped>
.el-header-app {
  height: 17vh !important;
  background: url(../assets/header_bg1.jpg) center no-repeat;
  background-size: cover;
}

.logo_image {
  margin-top: 5vh; 
}

.login_register {
  margin-top: 5vh;
  color: #fff !important;
  font-size: 3vh !important;
}

.el-button-log-reg {
  color: #fff !important;
  font-size: 3vh !important;
}

.el-card-log {
    width: 25vw;
    padding-left: 70vw;
    padding-top: 0;
}

.el-form-item {
    margin-bottom: 1.5vh !important;
}
</style>