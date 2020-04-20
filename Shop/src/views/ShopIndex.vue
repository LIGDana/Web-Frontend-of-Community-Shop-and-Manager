<template>
    <div id="ShopIndex">
        <el-container>
            <el-header class="el-header-app">
                <el-row>
                <el-col :span='2' :offset='11'><div class='logo_image'><img src='../assets/logo_white.png'/></div></el-col>
                <el-col :span='2' :offset='8'>
                    <el-dropdown @command="handleDropdownCommand">
                        <div class='avatar-header'>
                            <el-avatar :fit='fill' :src="$store.state.info.headImage"></el-avatar>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command='myinfo'><i class="el-icon-info"></i>个人信息</el-dropdown-item>
                            <el-dropdown-item command='changePw' divided><i class="el-icon-edit"></i>修改密码</el-dropdown-item>
                            <el-dropdown-item command='logout' divided><i class="el-icon-caret-right"></i>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                </el-row>
            </el-header>
            <el-container>
                <el-aside class='el-aside-index'>
                    <el-menu class='el-menu-vertical' align='left' router default-active="this.$router.path" @mouseenter.native="collapseOpen" @mouseleave.native="collapseClose" :collapse="isCollapse" active-text-color="#ffd04b" @select="handleSelect">
                        <el-submenu index="1">
                            <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span slot="title">个人信息</span>
                            </template>
                            <el-menu-item index="/index/my_info">店铺信息</el-menu-item>
                            <el-menu-item index="/index/goods_info">已有商品信息</el-menu-item>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title">
                            <i class="el-icon-sell"></i>
                            <span slot="title">交易</span>
                            </template>
                            <el-menu-item index="/index/start_transaction">发起交易</el-menu-item>
                            <el-menu-item index="/index/transaction_history">交易记录</el-menu-item>    
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>

        <el-dialog align='left' title="修改密码" :visible.sync="isChangingPw">
        <el-form :model="changePwForm" status-icon label-width="130px">
            <el-form-item label="原始密码">
                <el-input show-password v-model="changePwForm.password"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input prefix-icon="el-icon-lock" v-model="changePwForm.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="再次输入新密码">
                <el-input prefix-icon="el-icon-lock" v-model="changePwForm.newPassword2"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="changePw_cancel">取 消</el-button>
            <el-button type="primary" @click="changePw_confirm">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'ShopIndex',
    data() {
        return{
            isCollapse: true,
            isChangingPw: false,
            changePwForm: {
                password:'',
                newPassword:'',
                newPassword2:'',
            }
        }
    },
    methods: {
        collapseOpen() {
            this.isCollapse = false;
        },
        collapseClose() {
            this.isCollapse = true;
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        handleDropdownCommand(command) {
            switch(command) {
                case 'myinfo':
                    this.$router.push('my_info');
                    break;
                case 'logout':
                    //sessionStorage.setItem('store', {});
                    this.$store.state.token = '';
                    this.$router.push('login');
                    this.$message({type: 'success', message: '您已退出登录'});
                    break;
                case 'changePw':
                    this.isChangingPw = true;
                    break;
                default:
                    break;
            }
        },
        changePw_cancel() {
            this.$message({type: 'info', message: '取消修改！'});
            this.isChangingPw = false;
        },
        changePw_confirm() {
            if(this.changePwForm.newPassword != this.changePwForm.newPassword2)
                this.$message({type: 'error', message: '两次输入的新密码须一致！'});
            else if(this.changePwForm.newPassword.length < 8 || this.changePwForm.newPassword.length > 20)
                this.$message({type: 'error', message: '新密码长度要在8 ~ 20个字符之间！'});
            else {
                this.changePwForm.shopId = this.$store.state.info.shopId;
                this.axios.post(this.$store.state.baseurl + '/change_password', this.changePwForm)
                .then((result) => {
                    if(result.data.status === 'wrong')
                        this.$message({type: 'error', message: '原始密码错误，修改失败！'});
                    else if(result.data.status === 'update') {
                        this.$message({type: 'success', message: '修改成功！'});
                        this.isChangingPw = false;
                    }
                }).catch((err) => {
                    console.log(err);
                    this.$message({type: 'error', message: '服务器错误！修改失败'});
                });
            }
        }
    }
}
</script>

<style>
.el-menu-vertical {
    width: 10vw;
    min-height: 87vh;
}
.el-aside-index {
    width: 10vw !important;
}
.el-avatar {
    height: 9vh !important;
    width: 9vh !important;
}
.avatar-header {
    padding-top: 2vh;
}
</style>
