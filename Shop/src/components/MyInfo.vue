<template>
    <div id="MyInfo" align="center">
        <el-card style="width: 70vw">
            <el-form v-model="myInfo">
                <el-form-item>
                    <el-upload
                        class="avatar-uploader"
                        action="https://Community-Merchant-Server-BUGKILLER.app.secoder.net/shop/upload_image"
                        :headers='uploadHeader'
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <el-avatar shape="square" :fit="fit" v-if="myInfo.headImage" :src="myInfo.headImage" class="avatar"></el-avatar>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <span>商铺名称：{{myInfo.shopName}}</span>
                </el-form-item>
                <el-form-item>
                    <span>经营类别：{{myInfo.category}}</span>
                </el-form-item>
                <el-form-item>
                    <span>店主姓名：{{myInfo.ownerName}}</span>
                </el-form-item>
                <el-form-item>
                    <span>联系电话：{{myInfo.phone}}</span>
                </el-form-item>
                <el-form-item>
                    <span>详细地址：{{myInfo.address}}</span>
                </el-form-item>
                <el-form-item>
                    <span>应收账款：{{myInfo.receivables}}元</span>
                </el-form-item>
                <el-form-item>
                    <span>本店获取积分比例：{{myInfo.rate}}</span>
                </el-form-item>
            </el-form>
            <el-row :gutter="140">
                <el-col :span="2" :offset="8"><el-button @click="editMyInfo" type="primary">编辑信息</el-button></el-col>
                <el-col :span="2"><el-button @click="deleteAccount" type="danger">注销账号</el-button></el-col>
            </el-row>
        </el-card>

        <el-dialog align='left' title="修改个人信息" :visible.sync="editVisible">
        <el-form :model="editForm" ref="editForm" :rules="editRules" status-icon label-width="80px">
            <el-form-item label="商铺名称">
                <el-input v-model="editForm.shopName"></el-input>
            </el-form-item>
            <el-form-item label="店主姓名">
                <el-input v-model.number="editForm.ownerName"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
                <el-input v-model="editForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="详细地址">
                <el-input v-model="editForm.address"></el-input>
            </el-form-item>
            <el-form-item label="积分比例">
                <el-input v-model.number="editForm.rate" type="number"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="edit_info_cancel">取 消</el-button>
            <el-button type="primary" @click="edit_info_confirm">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "MyInfo",
    inject: ['reload'],
    data() {
        return {
            myInfo: {
                shopId: 0, //Integer 商家ID
                shopName:"", //String 商家店名
                ownerName:"", //String 店主姓名
                phone:"", //String 联系电话
                address:"", //String 店铺地址
                category:"", //String 经营类别
                rate: 1.0, //Double 自定义的积分换现与上限beta的比例，默认为1
                receivables:"", //Double 应收融居邻里平台的总账款（由积分换现产生）
                headImage:"" //头像
            },
            editVisible: false,
            editForm: {
                shopName:"", //String 商家店名
                ownerName:"", //String 店主姓名
                phone:"", //String 联系电话
                address:"", //String 店铺地址
                rate: 1.0, //Double 自定义的积分换现与上限beta的比例，默认为1
            }
        }
    },

    created() {
        this.myInfo = this.$store.state.info;
    },

    methods: {
        handleAvatarSuccess(res) {
            if(res.status === 'upload successfully!') {
                this.myInfo.headImage = res.image;
                this.$message({type: 'success', message: '上传头像成功'});
            }
            else {
                this.$message({type: 'error', message: '上传头像失败'});
            }
            console.log(this.myInfo);
        },

        beforeAvatarUpload() {
            return;
        },

        editMyInfo() {
            this.editForm.shopName = this.myInfo.shopName;
            this.editForm.ownerName = this.myInfo.ownerName;
            this.editForm.phone = this.myInfo.phone;
            this.editForm.address = this.myInfo.address;
            this.editForm.rate = this.myInfo.rate;
            
            this.editVisible = true;
        },

        edit_info_confirm() {
            this.myInfo.shopName = this.editForm.shopName;
            this.myInfo.ownerName = this.editForm.ownerName;
            this.myInfo.phone = this.editForm.phone;
            this.myInfo.address = this.editForm.address;
            this.myInfo.rate = this.editForm.rate;

            switch(this.myInfo.category) {
                case '日用百货':
                    this.myInfo.category = 0;
                    break;
                case '美食酒饮':
                    this.myInfo.category = 1;
                    break;
                case '休闲娱乐':
                    this.myInfo.category = 2;
                    break;
                case '运动健身':
                    this.myInfo.category = 3;
                    break;
                case '学习培训':
                    this.myInfo.category = 4;
                    break;
                case '丽人':
                    this.myInfo.category = 5;
                    break;
                case '宠物':
                    this.myInfo.category = 6;
                    break;
                case '购物':
                    this.myInfo.category = 7;
                    break;
                case '医疗健康':
                    this.myInfo.category = 8;
                    break;
                default:
                    break;
            }
            this.axios.post(this.$store.state.baseurl + '/update', this.myInfo)
            .then((result) => {
                if(result.data.status === 'update') {
                    this.$message({type: 'info', message: '修改完成！'});
                    switch(this.myInfo.category) {
                        case 0:
                            this.myInfo.category = "日用百货";
                            break;
                        case 1:
                            this.myInfo.category = '美食酒饮';
                            break;
                        case 2:
                            this.myInfo.category = '休闲娱乐';
                            break;
                        case 3:
                            this.myInfo.category = '运动健身';
                            break;
                        case 4:
                            this.myInfo.category = '学习培训';
                            break;
                        case 5:
                            this.myInfo.category = '丽人';
                            break;
                        case 6:
                            this.myInfo.category = '宠物';
                            break;
                        case 7:
                            this.myInfo.category = '购物';
                            break;
                        case 8:
                            this.myInfo.category = '医疗健康';
                            break;
                        default:
                            break;
                    }
                    this.$store.state.info.shopName = this.editForm.shopName;
                    this.$store.state.info.ownerName = this.editForm.ownerName;
                    this.$store.state.info.phone = this.editForm.phone;
                    this.$store.state.info.address = this.editForm.address;
                    this.$store.state.info.rate = this.editForm.rate;
                    this.reload();
                }
                else
                    this.$message({type: 'error', message: '修改失败'});
            }).catch((err) => {
                console.log(err);
            });
        },

        edit_info_cancel() {
            this.$message({type: 'info', message: '取消修改！'});
            this.reload();
        },

        deleteAccount() {
            this.$confirm('您将注销该平台的商家账号，是否继续？', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                //提示框点击确定
                this.axios.post(this.$store.state.baseurl + '/delete', {shopId: this.$store.state.info.shopId})
                .then((result) => {
                    console.log(result);
                    this.$message({type: 'info', message: '已注销账号！期待与您的再次合作'});
                    this.$store.state.token = '';
                    this.$router.push('login');
                }).catch((err) => {
                    console.log(err);
                    this.$message({type: 'error', message: '操作失败'});    
                });
            }).catch(() => {
                //提示框点击取消
                this.$message({type: 'info', message: '已取消注销账号!'});
            })
        }
    },

    computed: {
        uploadHeader() {
            return {
                token: this.$store.state.token,
            }
        }
    }

}
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #707070;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 20vh;
    height: 20vh;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    line-height: 20vh !important;
    width: 20vh;
    height: 20vh;
    text-align: center;
  }
  .avatar {
    height: 20vh !important;
    width: 20vh !important;
    display: block;
  }
</style>