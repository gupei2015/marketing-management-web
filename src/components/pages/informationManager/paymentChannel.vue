<template>
    <div>
        <div class="handle-box">
            <el-button type="primary" @click="handleClick(undefined, 'modify')">新建支付渠道</el-button>
        </div>
        <el-table
            :data="list"
            border
            stripe
            :header-cell-style="{textAlign: 'center'}"
            style="width: 100%">
            <el-table-column
                prop="id"
                label="ID"
                width="180">
            </el-table-column>
            <el-table-column
                prop="paymentChannelName"
                label="渠道名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="paymentTransType"
                label="渠道类型"
                width="180">
            </el-table-column>
            <el-table-column
                prop="defaultKey"
                label="渠道默认支付key">
            </el-table-column>
            <el-table-column
                prop="defaultSecret"
                label="渠道默认密钥">
            </el-table-column>
            <!-- 状态：0 有效  1  无效 -->
            <el-table-column
                label="当前状态"
                width="80">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        :active-value="0"
                        :inactive-value="1"
                        disabled>
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="130">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row.id, 'view')" type="text" size="small">查看</el-button>
                    <el-button @click="handleClick(scope.row.id, 'modify')" type="text" size="small">编辑</el-button>
                    <el-button @click="deleteRecord(scope.row.id)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage + 1"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount == -1 ? (totalCount + 1) : totalCount"
            v-if="list && list.length > 0">
        </el-pagination>
        <!-- 查看 弹框 -->
        <el-dialog :title="`查看支付渠道`" :visible.sync="dialogViewVisible" modal width="55%" top="8vh" class="view">
            <el-form :model="form" label-width="170px" :inline="true" disabled readonly data-sign="noborder">
                <el-form-item label="渠道名称">
                    <el-input v-model="form.paymentChannelName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道类型">
                    <el-input v-model="form.paymentTransType" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道默认支付key">
                    <el-input v-model="form.defaultKey" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道默认密钥">
                    <el-input v-model="form.defaultSecret" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道单笔限额">
                    <el-input v-model="form.singleTransLimitAmount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道展示图片">
                    <el-input v-model="form.showImageUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道图标URL">
                    <el-input v-model="form.topicIconUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="当前状态(开启/禁止)">
                    <el-switch v-model="form.status" :active-value="0" :inactive-value="1"></el-switch>
                </el-form-item>
                <el-form-item label="渠道介绍">
                    <el-col :span="24">
                        <el-input type="textarea" v-model="form.introduction"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="渠道描述">
                    <el-col :span="24">
                        <el-input type="textarea" v-model="form.description"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogViewVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogViewVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改/新建 弹框 -->
        <el-dialog :title="isCreate ? `新建支付渠道` : `修改支付渠道`" :visible.sync="dialogModifyVisible" modal width="55%" top="8vh" class="modify">
            <el-form :model="form" label-width="170px" :inline="true" :rules="rules" ref="form">
                <el-form-item label="渠道名称	" prop="paymentChannelName">
                    <el-input v-model="form.paymentChannelName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道类型" prop="paymentTransType">
                    <el-input v-model="form.paymentTransType" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道默认支付key" prop="defaultKey">
                    <el-input v-model="form.defaultKey" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道默认密钥" prop="defaultSecret">
                    <el-input v-model="form.defaultSecret" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道单笔限额" prop="singleTransLimitAmount">
                    <el-input v-model.number="form.singleTransLimitAmount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道展示图片" prop="showImageUrl">
                    <el-input v-model="form.showImageUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道图标URL" prop="topicIconUrl">
                    <el-input v-model="form.topicIconUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="当前状态(开启/禁止)" prop="status">
                    <el-switch v-model="form.status" :active-value="0" :inactive-value="1"></el-switch>
                </el-form-item>
                <el-form-item label="渠道介绍" prop="introduction">
                    <el-col :span="24">
                        <el-input type="textarea" v-model="form.introduction"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="渠道描述" prop="description">
                    <el-col :span="24">
                        <el-input type="textarea" v-model="form.description"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogModifyVisible = false">取 消</el-button>
                <el-button type="primary" @click="formSubmit('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapState, mapActions, mapMutations} from 'vuex'
    import api from '../../../api/paymentChannelApi'

    export default {
        data() {
            return {
                currentPage: 0,
                // pageSize: 10,
                pageSizes: [10, 20, 50, 100],

                dialogViewVisible: false,

                dialogModifyVisible: false,
                isCreate: false,
                form: {
                    paymentChannelName: '',
                    paymentTransType: '',
                    defaultKey: '',
                    defaultSecret: '',
                    singleTransLimitAmount: '',
                    showImageUrl: '',
                    topicIconUrl: '',
                    status: 0,
                    introduction: '',
                    description: '',
                },
                rules: {
                    paymentChannelName: [
                        { required: true, message: '请输入商户编号', trigger: 'blur' }
                    ],
                    paymentTransType: [
                        { required: true, message: '请输入商户编号', trigger: 'blur' }
                    ],
                    singleTransLimitAmount: [
                        { type: 'number',  message: '请输入数字', trigger: 'blur' }
                    ]
                }
            };
        },
        computed: {
            ...mapState('paymentChannel', [
                'list',
                'totalCount',
                'pageSize'
            ])
        },
        methods: {
            handleSizeChange(val) {
                // this.pageSize = val;
                this.setPageSize(val);
                this.getList();
            },
            handleCurrentChange(val) {
                this.currentPage = val - 1;
                this.getList();
            },
            handleClick(id, type) {
                if(type == 'modify'){
                    this.isCreate = id != undefined ? false : true;

                    // 清空表单
                    this.$set(this, 'form', this.$options.data().form);
                    this.$refs['form'] && this.$refs['form'].resetFields();  // 重置表单，并清除验证提示

                    if(!this.isCreate){
                        this.getDataHandle(id, type);
                    }
                }else if(type == 'view'){
                    this.getDataHandle(id, type);
                }
                this[`dialog${type.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase())}Visible`] = true;

            },
            deleteRecord(id){
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    api.delete({payChannelId: id})
                        .then(res => {
                            loading.close();
                            if(res.data.success && res.data.data.operationResult){
                                this.getList();
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            }else{
                                if(res.data.message){
                                    this.$alert(res.data.message, '提示', {
                                        confirmButtonText: '确定'
                                    });
                                }else{
                                    this.$alert('删除失败!', '提示', {
                                        confirmButtonText: '确定'
                                    });
                                }
                            }
                        })
                        .catch(err => {
                            loading.close();
                            console.log(err);
                            this.$alert('删除失败!', '提示', {
                                confirmButtonText: '确定'
                            });
                        });
                    
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            formSubmit(formname){
                this.$refs[formname].validate((valid) => {
                    if (valid) {
                        this.saveformHandle(this.form);
                    } else {
                        console.log('error submit!');
                        return false;
                    }
                });
            },
            getList(){
                let loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                this.getListData({
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    isPager: 1
                })
                .then(res => {
                    if(res.data.success){
                        loading &&  loading.close();
                    }else{
                        loading.close();
                        this.$alert(res.data.message, '提示', {
                            confirmButtonText: '确定'
                        });
                    }
                })
                .catch(err => {
                    console.log(err, typeof err);
                    loading && loading.close();
                    this.$alert('网络问题', '提示', {
                        confirmButtonText: '确定'
                    });
                });
            },
            getDataHandle(id, type){
                let target = document.querySelector(`.${type} .el-dialog`);
                let loading = this.$loading({
                    target,
                    text: 'Loading'
                });

                api.details(id)
                .then(res => {
                    loading.close();
                    if(res.data.success){
                        this.$set(this, 'form', res.data.data);
                    }else{
                        this.$alert(res.data.message, '提示', {
                            confirmButtonText: '确定'
                        });
                    }
                })
                .catch(err => {
                    loading.close();
                    console.log(err);
                    this.$alert('网络问题', '提示', {
                        confirmButtonText: '确定'
                    });
                });
            },
            saveformHandle(data){
                let target = document.querySelector(`.modify .el-dialog`);
                let loading = this.$loading({
                    target,
                    text: 'Loading'
                });
                if(this.isCreate){
                    api.create({
                        ...data
                    })
                    .then(res => {
                        loading.close();
                        if(res.data.success){
                            this.$alert('保存成功！', '提示', {
                                confirmButtonText: '确定'
                            })
                            .then(() => {
                                this.dialogModifyVisible = false;
                                this.getList();
                            });
                        }else{
                            this.$alert(res.data.message, '提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    })
                    .catch(err => {
                        loading.close();
                        console.log(err);
                        this.$alert('网络问题', '提示', {
                            confirmButtonText: '确定'
                        });
                    });
                }else{
                    api.update({
                        ...data
                    })
                    .then(res => {
                        loading.close();
                        if(res.data.success){
                            this.$alert('保存成功！', '提示', {
                                confirmButtonText: '确定'
                            })
                            .then(() => {
                                this.dialogModifyVisible = false;
                                this.getList();
                            });
                        }else{
                            this.$alert(res.data.message, '提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    })
                    .catch(err => {
                        loading.close();
                        console.log(err);
                        this.$alert('网络问题', '提示', {
                            confirmButtonText: '确定'
                        });
                    });
                }
            },
            ...mapActions('paymentChannel', [
                'getListData',
            ]),
            ...mapMutations('paymentChannel', [
                'setPageSize'
            ])
        },
        mounted(){
            // this.getList();
        }
    };
</script>

<style lang="less" scoped>
    @import "../../../assets/less/elementUiFix.less";
</style>
