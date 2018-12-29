<template>
  <div>
    <div class="handle-box">
      <el-button
        type="primary"
        @click="handleClick(undefined, 'modify')"
      >新建商户</el-button>
    </div>
    <el-table
      :data="merchants"
      border
      stripe
      :header-cell-style="{textAlign: 'center'}"
      style="width: 100%"
    >
      <el-table-column
        prop="accountRuleId"
        label="结算规则ID"
        width="130"
      >
      </el-table-column>
      <el-table-column
        prop="companyId"
        label="公司，租户ID"
        width="130"
      >
      </el-table-column>
      <el-table-column
        prop="couponType"
        label="所属类型"
        width="130"
      >
      </el-table-column>
      <el-table-column
        prop="couponName"
        label="优惠券名称"
        width="130"

      >
      </el-table-column>
      <el-table-column
        prop="couponDesc"
        label="优惠券活动描述"
        width="130"
      >
      </el-table-column>
      <el-table-column
        prop="accumulateType"
        label="使用规则"
      >
      </el-table-column>
      
      <el-table-column
        label="状态"
        width="80"
        prop="status"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="2"
            disabled
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row.id, 'view')"
            type="text"
            size="small"
          >查看</el-button>
          <el-button
            @click="handleClick(scope.row.id, 'modify')"
            type="text"
            size="small"
          >编辑</el-button>
          <el-button
            @click="deleteRecord(scope.row.id)"
            type="text"
            size="small"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage + 1"
      :page-sizes="pageSizes"
      :page-size="mercPageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount == -1 ? (totalCount + 1) : totalCount"
      v-if="merchants && merchants.length > 0"
    >
    </el-pagination>
    <!-- 查看 弹框 -->
    <el-dialog
      :title="`查看商户`"
      :visible.sync="dialogViewVisible"
      modal
      width="60%"
      top="8vh"
      class="view"
    >
      <el-form
        :model="form"
        label-width="160px"
        :inline="true"
        disabled
        readonly
        data-sign="noborder"
      >
        <el-form-item label="商户编号">
          <el-input
            v-model="form.mchCode"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="商户名称">
          <el-input
            v-model="form.mchName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属租户">
          <el-select
            v-model="form.tenantId"
            placeholder="请选择所属租户"
          >
            <el-option
              v-for="item in tenantOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户类型">
          <el-select v-model="form.mchType">
            <el-option
              label="平台商户"
              :value="1"
            ></el-option>
            <el-option
              label="平台卖家"
              :value="2"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input
            v-model="form.nickName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input
            v-model="form.contactPerson"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="form.contactMobileNo"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="座机">
          <el-input
            v-model="form.tel"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="微信号">
          <el-input
            v-model="form.wechatAccount"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="QQ号">
          <el-input
            v-model="form.qqAccount"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="(固定)二维码">
          <el-input
            v-model="form.constantQrCode"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="故障处理联系电话">
          <el-input
            v-model="form.urgencyContactNo"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="商家网站/店铺主页URL">
          <el-input
            v-model="form.siteUrl"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="成功返回地址">
          <el-input
            v-model="form.payResultUrl"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="当前状态（开启/禁用）">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <el-col :span="24">
            <el-input
              type="textarea"
              v-model="form.description"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogViewVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogViewVisible = false"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改/新建 弹框 -->
    <el-dialog
      :title="isCreate ? `新建商户` : `修改商户`"
      :visible.sync="dialogModifyVisible"
      modal
      width="60%"
      top="8vh"
      class="modify"
    >
      <el-form
        :model="form"
        label-width="160px"
        :inline="true"
        :rules="rules"
        ref="form"
      >
        <el-form-item
          label="结算规则ID"
          prop="mchCode"
        >
          <el-input
            v-model="form.mchCode"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="公司，租户ID"
          prop="mchName"
        >
          <el-input
            v-model="form.mchName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="所属类型"
          prop="tenantId"
        >
          <el-select
            v-model="form.tenantId"
            placeholder="请选择所属类型"
          >
            <el-option
              v-for="item in tenantOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否满减"
          prop="mch_type"
        >
          <el-select
            v-model="form.mchType"
            placeholder="请选择是否支持满减"
          >
            <el-option
              label="是"
              :value="1"
            ></el-option>
            <el-option
              label="否"
              :value="2"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="优惠券名称"
          prop="nickName"
        >
          <el-input
            v-model="form.nickName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="活动描述"
          prop="contactPerson"
        >
          <el-col :span="24">
            <el-input
              type="textarea"
              v-model="form.description"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item
          label="图标地址"
          prop="contactMobileNo"
        >
          <el-input
            v-model="form.contactMobileNo"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="使用规则"
          prop="mch_type"
        >
          <el-select
            v-model="form.mchType"
            placeholder="请选择使用规则"
          >
            <el-option
              label="排他"
              :value="0"
            ></el-option>
            <el-option
              label="并存"
              :value="1"
            ></el-option>
            <el-option
              label="择优"
              :value="2"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="权重值"
          prop="tel"
        >
          <el-input
            v-model="form.tel"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="是否支持退款"
          prop="mch_type"
        >
          <el-select
            v-model="form.mchType"
            placeholder="请选择是否支持退款"
          >
            <el-option
              label="是"
              :value="1"
            ></el-option>
            <el-option
              label="否"
              :value="0"
            ></el-option>
          </el-select>
        </el-form-item> <br>
        <!-- <el-form-item
          label="状态"
          prop="mch_type"
        >
          <el-select
            v-model="form.mchType"
            placeholder="请选择状态"
          >
            <el-option
              label="已启用"
              :value="0"
            ></el-option>
            <el-option
              label="未启用"
              :value="1"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item
          label="当前状态（开启/禁用）"
          prop="status"
        >
          <el-switch
            v-model="form.status"
            :active-value="0"
            :inactive-value="1"
          >
          </el-switch>
          <!-- <el-select v-model="form.status" placeholder="请选择">
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select> -->
        </el-form-item>
        <br>
        <el-form-item
          label="备注"
          prop="description"
        >
          <el-col :span="24">
            <el-input
              type="textarea"
              v-model="form.description"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogModifyVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="formSubmit('form')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import merchantApi from "../../../api/merchantApi";

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
        id: null,
        accountRuleId: null,
        companyId: 1,
        couponType: null,
        accumulated: null,
        couponName: null,
        couponDesc: null,
        accumulateType: null,
        weight: null,
        supportReturn: null,
        status: null
      },
      rules: {
        mchCode: [
          { required: true, message: "请输入商户编号", trigger: "blur" }
        ],
        mchName: [
          { required: true, message: "请输入商户名称", trigger: "blur" }
        ],
        mchType: [
          { required: true, message: "请选择商户类型", trigger: "change" }
        ],
        tenantId: [
          { required: true, message: "请选择所属租户", trigger: "change" }
        ]
      },
      tenantOpts: [
        {
          label: "积分",
          value: 0
        },
        {
          label: "满减",
          value: 1
        }
      ]
    };
  },
  computed: {
    ...mapState("merchant", ["merchants", "totalCount", "mercPageSize"])
  },
  methods: {
    handleSizeChange(val) {
      this.setMercPageSize(val);
      this.getMerchantList();
    },
    handleCurrentChange(val) {
      this.currentPage = val - 1;
      this.getMerchantList();
    },
    handleClick(id, type) {
      if (type == "modify") {
        this.isCreate = id != undefined ? false : true;

        // 清空表单
        this.$set(this, "form", this.$options.data().form);
        this.$refs["form"] && this.$refs["form"].resetFields(); // 重置表单，并清除验证提示

        if (!this.isCreate) {
          this.getMerchantHandle(id, type);
        }
      } else if (type == "view") {
        this.getMerchantHandle(id, type);
      }
      this[
        `dialog${type
          .toLowerCase()
          .replace(/( |^)[a-z]/g, L => L.toUpperCase())}Visible`
      ] = true;
    },
    deleteRecord(merchantId) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          merchantApi
            .deleteMerchant(merchantId)
            .then(res => {
              console.log(res)
              loading.close();
              if (res.data.success && res.data.data.operationResult) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getMerchantList();
              } else {
                if (res.data.message) {
                  this.$alert(res.data.message, "提示", {
                    confirmButtonText: "确定"
                  });
                } else {
                  this.$alert("删除失败!", "提示", {
                    confirmButtonText: "确定"
                  });
                }
              }
            })
            .catch(err => {
              loading.close();
              console.log(err);
              this.$alert("删除失败!", "提示", {
                confirmButtonText: "确定"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    formSubmit(formname) {
      //   this.$refs[formname].validate(valid => {
      //     if (valid) {
      this.saveformHandle(this.form);
      //     } else {
      //       console.log("error submit!");
      //       return false;
      //     }
      //   });
    },
    getMerchantList() {
      let loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      this.getMerchants({
        id: null,
        accountRuleId: null,
        companyId: null,
        couponType: null,
        accumulated: null,
        couponName: null,
        couponDesc: null,
        accumulateType: null,
        weight: null,
        supportReturn: null,
        status: null,
        isPager: 1,
        pageNum: 1,
        pageSize: 10
        // pageNum: this.currentPage,
        // pageSize: this.mercPageSize
      })
        .then(res => {
            console.log(res)
          if (res.data.success) {
            loading && this.merchants.length >= 0 && loading.close();
          } else {
            loading.close();
            this.$alert(res.data.message, "提示", {
              confirmButtonText: "确定"
            });
          }
        })
        .catch(err => {
          console.log(err, typeof err);
          loading && loading.close();
          this.$alert("网络问题", "提示", {
            confirmButtonText: "确定"
          });
        });
    },
    getMerchantHandle(merchantId, type) {
      let target = document.querySelector(`.${type} .el-dialog`);
      let loading = this.$loading({
        target,
        text: "Loading"
      });
      merchantApi
        .getMerchantDetails(merchantId)
        .then(res => {
          loading.close();
          if (res.data.success) {
            this.$set(this, "form", res.data.data.merchantBaseInfo);
          } else {
            this.$alert(res.data.message, "提示", {
              confirmButtonText: "确定"
            });
          }
        })
        .catch(err => {
          loading.close();
          console.log(err);
          this.$alert("网络问题", "提示", {
            confirmButtonText: "确定"
          });
        });
    },
    saveformHandle(data) {
      let target = document.querySelector(`.modify .el-dialog`);
      let loading = this.$loading({
        target,
        text: "Loading"
      });
      merchantApi
        .saveMerchant(data)
        .then(res => {
          console.log(res);
          loading.close();
          if (res.data.success) {
            this.$alert("保存成功！", "提示", {
              confirmButtonText: "确定"
            }).then(() => {
              this.dialogModifyVisible = false;
              this.getMerchantList();
            });
          } else {
            this.$alert(res.data.message, "提示", {
              confirmButtonText: "确定"
            });
          }
        })
        .catch(err => {
          console.log(err);
          loading.close();
          this.$alert("网络问题", "提示", {
            confirmButtonText: "确定"
          });
        });
    },
    ...mapActions("merchant", ["getMerchants"]),
    ...mapMutations("merchant", ["setMercPageSize"])
  },
  mounted() {
    this.getMerchantList();
  }
};
</script>

<style lang="less" scoped>
@import "../../../assets/less/elementUiFix.less";
</style>
