<template>
    <div id="ShopRegister" align='center'>
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
            <el-card style='width: 30vw'>
                <div slot="header">
                    <h3>精诚所至   金石为开</h3>
                    <span>融聚邻里欢迎您的合作！</span>
                </div>
                <el-form ref="form" :model="form">
                    <el-form-item>
                        <el-input v-model="form.shopName" placeholder="店铺名称" prefix-icon="el-icon-s-shop"> </el-input> 
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="form.category" placeholder="请选择店铺分类" filterable style="width: 100%">
                            <el-option v-for="item in cateOptions" :key="item.value" :label="item.key" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="form.address" placeholder="店铺详细地址" prefix-icon="el-icon-location"> </el-input> 
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="form.ownerName" placeholder="经营人姓名" prefix-icon="el-icon-user-solid"> </el-input> 
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="form.phone" placeholder="电话号码" prefix-icon="el-icon-mobile-phone"> </el-input> 
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="el-icon-lock"> </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="password2" type="password" placeholder="请再次输入密码以确认" prefix-icon="el-icon-check"> </el-input>
                    </el-form-item>
                    <el-form-item style="align: center">
                        <el-button @click="submitRegister" size="small" type="primary">提交注册</el-button>
                        <el-button @click="toLogin" size="small" type="text">已有帐号？去登录</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            </el-main>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'ShopRegister',
    data() {
        return {
            form: {
                shopName:'',
                category:'',
                password:'',
                phone:'',
                address:'',
                ownerName:''
            },
            password2: '',
            cateOptions: [
                {key:'日用百货', value: 0},
                {key:'美食酒饮', value: 1},
                {key:'休闲娱乐', value: 2},
                {key:'运动健身', value: 3},
                {key:'学习培训', value: 4},
                {key:'丽人', value: 5},
                {key:'宠物', value: 6},
                {key:'购物', value: 7},
                {key:'医疗健康', value: 8},
            ],
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

        //返回注册页面
        toLogin() {
            this.$router.push('/login');
        },

        //提交申请
        submitRegister() {
            console.log(this.form);
            if(this.form.shopName === '' || this.form.category === '' || this.form.password === '' || this.form.phone === '' || this.form.address === '')
                this.$message({type:'error', message:'表格中任何一项内容不能为空！请检查表单'});
            else if(this.form.phone.length != 11 && this.form.phone.length != 8)
                this.$message({type:'error', message:'请输入合法的电话号码'});
            else if(this.form.password.length < 8 || this.form.password.length > 20)
                this.$message({type:'error', message:'密码长度应在8 ~ 20位之间'});
            else if(this.form.password != this.password2)
                this.$message({type:'error', message:'密码前后不一致，请重新输入！'});
            else {
                this.axios.post(this.$store.state.baseurl + '/register', this.form)
                .then((result) => {
                    if(result.data.status === 'wrong')
                        alert('该店铺名已经被注册！');
                    else if(result.data.status === 'submit') {
                        alert('成功递交申请！请等候申请审批结果。');
                        this.$router.push('/login');
                    }
                }).catch((err) => {
                    console.log(err);
                    alert('通信出错！请重新输入申请信息');
                });
            }
        },
        
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
</style>
