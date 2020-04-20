<template>
    <div id='ShopLogin' align='center'>
        <el-container>
            <el-header class="el-header-app">
                <el-row>
                <el-col :span='2' :offset='11'><div class='logo_image'><img src='../assets/logo_white.png'/></div></el-col>
                <el-col :span='2' :offset='8'>
                    <div class='login_register'>
                    <el-button class='el-button-log-reg' type="text" @click.native="$router.push('login')">登录</el-button><span> / </span><el-button class='el-button-log-reg' type="text" @click.native="$router.push('register')">注册</el-button>
                    </div>
                </el-col>
                </el-row>
            </el-header>
            <el-main :style="{backgroundImage:'url('+ main_imgs[now_bg_index] +')', backgroundRepeat: 'no-repeat', backgroundSize:'cover', height: '87vh'}">
                 <div class='el-card-log' align='center'>
                    <el-card>
                        <div slot="header">
                            <span>您好！亲爱的商家，请登录</span>
                        </div>
                        <el-form>
                        <el-form-item class='el-form-item-login'><el-input v-model="shop.shopName" placeholder="店铺名称" prefix-icon="el-icon-s-shop"></el-input></el-form-item>
                        <el-form-item class='el-form-item-login'><el-input v-model="shop.password" placeholder="密码" @keydown.enter.native='shop_login' prefix-icon="el-icon-lock" show-password></el-input></el-form-item>
                        <el-button type="primary" @click.native="shop_login">登录</el-button>
                        <el-button @click.native="shop_register">申请注册</el-button>
                        </el-form>
                    </el-card>
                 </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'ShopLogin',
    data(){
        return{
            shop: {
                shopName: '',
                password: ''
            },
            now_bg_index: 0,
            main_imgs: [require('../assets/1.jpg'), require('../assets/2.jpg'), require('../assets/3.jpg'), require('../assets/4.jpg'), require('../assets/5.jpg'), require('../assets/6.jpg'), require('../assets/7.jpg')],
        }
    },
    created() {
        this.timer();
        console.log(this.$store.state);
    },
    methods: {
        timer() {
            return setInterval(()=>{ 
                this.now_bg_index = (this.now_bg_index + 1) % 3;}, 3000)
        },

        //商家登录
        shop_login() {
            if(!this.shop.shopName)
                alert('请输入用户名');
            else if(!this.shop.password)
                alert('请输入密码');
            else{
                this.axios.post(this.$store.state.baseurl + '/login', this.shop)
                .then((result) => {
                    var data = result.data;
                    if(data.message === 'wrong')
                        alert('密码错误！请重新输入');
                    else if(data.message === 'none')
                        alert('用户不存在！');
                    else {
                        this.$store.state.info = data.user;
                        this.$store.state.token = data.token;
                        sessionStorage.setItem('store', JSON.stringify(this.$store.state));
                        this.$router.push('index/goods_info');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        },

        //商家注册
        shop_register() {
            this.$router.push('register');
        }
    }
}
</script>

<style scoped>
.login_register {
  margin-top: 3vh;
  color: #fff !important;
  font-size: 1.5vw !important;
}

.el-button-log-reg {
  color: #fff !important;
  font-size: 1.5vw !important;
}

.el-card-log {
    width: 25vw;
    padding-left: 70vw;
    padding-top: 0;
}
</style>