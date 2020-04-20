<template>
<div id='goodsinfo' align='center'>
    <el-row :gutter="100">
        <el-col :span="20"><el-input v-model="searchInfo" placeholder="请输入搜索内容"></el-input></el-col>
        <el-col :span="4">
            <el-button v-if="!isManaging" @click.native="manage_goods">管理商品</el-button>
            <el-button-group v-else>
                <el-tooltip placement="top" content="添加商品"><el-button @click.native="add_goods" type="primary" icon="el-icon-plus"></el-button></el-tooltip>
                <el-tooltip placement="top" content="结束编辑"><el-button @click.native="manage_goods" type="success" icon="el-icon-check"></el-button></el-tooltip>
            </el-button-group>
        </el-col>
    </el-row>
    <div id='goodsinfotable' class='goodsinfotable'>
        <el-table stripe :data="searchTableData" height="70vh">
            <el-table-column prop="image" label="商品图片">
                <template slot-scope="scope">            
                    <el-avatar shape="square" :size="small" :src="scope.row.image"></el-avatar>
                </template> 
            </el-table-column>
            <el-table-column prop="goodsId" label="商品ID" align="center"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="sale" :formatter="isSaleFormatter" label="是否特价" align="center"></el-table-column>
            <el-table-column prop="price" label="原价" align="center"></el-table-column>
            <el-table-column prop="salePrice" label="特价" align="center"></el-table-column>
            <el-table-column v-if="isManaging"  label="管理" align="center">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button @click.native.prevent="edit_goods(scope.$index, searchTableData)" type="primary" size="small" icon='el-icon-edit'></el-button>
                        <el-button @click.native.prevent="delete_goods(scope.$index, searchTableData)" type="danger" size="small" icon='el-icon-delete'></el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableData.length" :hide-on-single-page="true"></el-pagination>
    </div>

    <!--添加商品表单-->
    <el-dialog align='left' title="添加商品信息" :visible.sync="addFormVisible">
    <el-form :model="addForm" ref="addForm" :rules="addRules" status-icon label-width="80px">
        <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="addForm.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="单价设置" prop="price">
            <el-input v-model.number="addForm.price" type="number"><template slot="append">元</template></el-input>
        </el-form-item>
        <el-form-item label="是否特价" prop="isSale">
            <el-switch v-model="addForm.isSale"></el-switch>
        </el-form-item>
        <el-form-item label="折扣价格" prop="salePrice">
            <el-input v-model.number="addForm.salePrice" type="number" :disabled="!this.addForm.isSale">
                <template slot="append">元</template>
            </el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="add_goods_cancel">取 消</el-button>
        <el-button type="primary" @click="add_goods_confirm">确 定</el-button>
    </div>
    </el-dialog>

    <!--编辑商品表单-->
    <el-dialog align='left' title="修改商品信息" :visible.sync="editFormVisible">
    <el-form :model="editForm" ref="editForm" :rules="editRules" status-icon label-width="80px">
        <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="editForm.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="image">
            <el-upload class="avatar-uploader" action="https://Community-Merchant-Server-BUGKILLER.app.secoder.net/shop/update_goods_image"
                :headers='updateHeader'
                :on-success="updateImageSuccess"
                :before-upload="beforeAvatarUpload">
                <el-avatar shape="square" :fit="fit" v-if="editForm.image" :src="editForm.image"></el-avatar>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="单价设置" prop="price">
            <el-input v-model.number="editForm.price" type="number"><template slot="append">元</template></el-input>
        </el-form-item>
        <el-form-item label="是否特价" prop="isSale">
            <el-switch v-model="editForm.sale"></el-switch>
        </el-form-item>
        <el-form-item label="折扣价格" prop="salePrice">
            <el-input v-model.number="editForm.salePrice" type="number" :disabled="!this.editForm.sale">
                <template slot="append">元</template>
            </el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="edit_goods_cancel">取 消</el-button>
        <el-button type="primary" @click="edit_goods_confirm">确 定</el-button>
    </div>
    </el-dialog>

</div>
</template>

<script>
export default {
    name: 'GoodsInfo',
    inject: ['reload'],
    data() {
        var add_checksaleprice = (rule, value, callback) => {
            if(this.addForm.isSale && value >= this.addForm.price)
                return callback(new Error('折扣价格必须小于原价！'));
            else if(!this.addForm.isSale) {
                this.addForm.salePrice = this.addForm.price;
                callback();
            }
            else callback();
        };
        var edit_checksaleprice = (rule, value, callback) => {
            if(this.editForm.sale && value >= this.editForm.price)
                return callback(new Error('折扣价格必须小于原价！'));
            else if(!this.editForm.sale) {
                this.editForm.salePrice = this.editForm.price;
                callback();
            }
            else callback();
        };
        return {
            tableData: [{image:'', goodsId:'', goodsName:'', sale:'', price:'', salePrice:''}],
            addFormVisible: false,
            addForm: {image:'', goodsName:'', price:'', isSale: false, salePrice:''},
            addRules: {
                goodsName: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
                price: [{required: true, message: '请输入商品原价', trigger: 'blur'}],
                salePrice: [{validator: add_checksaleprice, trigger: 'blur'}],
            },
            editFormVisible: false,
            editForm: {image:'', goodsName:'', price:'', sale: false, salePrice:'', goodsId: 0},
            editIndex: 0,
            editRules: {
                goodsName: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
                price: [{required: true, message: '请输入商品原价', trigger: 'blur'}],
                salePrice: [{validator: edit_checksaleprice, trigger: 'blur'}],
            },
            getSearchTable: [],
            realTable: [],
            searchInfo: '',
            isManaging: false,
            currentPage: 1,
            pageSize: 6,
        }
    },
    created() {
        // 请求后台数据，渲染表格
        this.axios.post(this.$store.state.baseurl + '/show_goods', {shopId: this.$store.state.info.shopId})
        .then((result) => {
            this.tableData = result.data;
            this.getSearchTable = this.tableData;
            this.realTable = this.tableData;
        }).catch((err) => {
            console.log(err);
        });
    },
    methods: {
        //删除某件商品
        delete_goods(index, list) {
            this.$confirm('您将删除该商品，是否继续？', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                //提示框点击确定
                this.axios.post(this.$store.state.baseurl + '/delete_goods', {goodsId: list[index].goodsId})
                .then((result) => {
                    if(result.data.status === 'delete_goods') {
                        this.$message({type: 'info', message: '已删除该商品!'});
                        this.reload();
                    }
                    else
                        this.$message({type: 'error', message: '删除商品失败!'});
                }).catch((err) => {
                    console.log(err);
                });
            }).catch(() => {
                //提示框点击取消
                this.$message({type: 'info', message: '已取消删除操作!'});
            })
        },

        //在是否管理（编辑）商品状态之间切换
        manage_goods() {
            this.isManaging = !this.isManaging;
        },

        //添加商品————弹出对话框
        add_goods() {
            this.addFormVisible = true;
        },

        //取消添加商品
        add_goods_cancel() {
            this.$message({type: 'info', message: '已取消商品的添加'});
            this.addFormVisible = false;
        },

        //确认添加商品
        add_goods_confirm() {
            this.$refs['addForm'].validate((valid) => {
                if(valid) {
                    this.addForm.shopId = this.$store.state.info.shopId;
                    this.axios.post(this.$store.state.baseurl + '/add_goods', this.addForm)
                    .then((result) => {
                        if(result.data.status === 'add_goods') {
                            this.$message({type: 'info', message: '已添加该商品！'});
                            this.addFormVisible = false;
                            this.reload();
                        }
                        else
                            this.$message({type: 'error', message: '添加失败!'});
                    }).catch((err) => {
                        console.log(err);
                    });
                }
                else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        
        //修改某件商品
        edit_goods(index, list) {
            this.editForm.image = list[index].image;
            this.editForm.goodsName = list[index].goodsName;
            this.editForm.goodsId = list[index].goodsId;
            this.editForm.price = list[index].price;
            this.editForm.sale = list[index].sale;
            this.editForm.salePrice = list[index].salePrice;
            this.editIndex = index;

            this.editFormVisible = true;
        },

        //取消修改商品
        edit_goods_cancel() {
            this.$message({type: 'info', message: '已取消商品信息的修改'});
            this.editFormVisible = false;
        },

        //确认修改商品
        edit_goods_confirm() {
            this.$refs['editForm'].validate((valid) => {
                if(valid) {
                    this.editForm.shopId = this.$store.state.info.shopId;
                    this.axios.post(this.$store.state.baseurl + '/update_goods', this.editForm)
                    .then((result) => {
                        if(result.data.status === 'update_goods') {
                            this.$message({type: 'info', message: '已修改该商品信息！'});
                            this.editFormVisible = false;
                            this.reload();
                        }
                        else
                            this.$message({type: 'error', message: '修改失败!'});
                    }).catch((err) => {
                        console.log(err);
                    });
                }
                else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        updateImageSuccess(res) {
            if(res.status === 'upload successfully!') {
                this.editForm.image = res.image;
                this.$message({type: 'success', message: '上传商品图片已成功！'});
            }
            else {
                this.$message({type: 'error', message: '上传商品图片失败！'});
            }
        },

        beforeAvatarUpload() {
            return;
        },

        //isSale变量做bool->string映射
        isSaleFormatter(row) {
            return row.sale? '是': '否';
        }
    },

    computed: {
        //修改商品图片的header
        updateHeader() {
            return {
                token: this.$store.state.token,
                goodsId: this.editForm.goodsId.toString(),
            }
        },

        //计算搜索出的表格
        searchTableData() {
            let searchInfo = this.searchInfo;
            if (searchInfo) {
                return this.getSearchTable.filter(data => {
                    console.log("success" + data);
                    return Object.keys(data).some(key => {
                    return String(data[key]).toLowerCase().indexOf(searchInfo) > -1
                    })
                }).slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
            }
            else
                return this.getSearchTable.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        }
    }
    
}
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 10vh;
    height: 10vh;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 10vh;
    height: 10vh;
    text-align: center;
    line-height: 10vh !important;
  }
  .avatar {
    width: 10vh;
    height: 10vh;
    display: block;
  }
  .goodsinfotable {
    width: 90vw !important;
    padding: 0 !important;
  }
  .el-table__body-wrapper::-webkit-scrollbar{
    width: 0;
  }
</style>