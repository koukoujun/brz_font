<template>
    <div>
        <!--        跟单表格-->
        <Table :data="data.data" :columns="col" size="small" @on-current-change="row=>curr=row" highlight-row>
            <template slot-scope="{ row, index }" slot="voucher_img">
                <img :src="i.url" v-for="i in row.img_list" width="22px" style="margin:0 2px"
                     @click="handleImgClick(i)">
            </template>
            <template slot-scope="{row,index}" slot="action">
                <Dropdown trigger="click" style="margin-left: 20px" @on-click="menuHandle">
                    <Button size="small">
                        操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="edit">编辑修改</DropdownItem>
                        <DropdownItem name="add_invoice" v-if="!row.invoice_status">填写发票申请</DropdownItem>
                        <DropdownItem name="add_refund" v-if="!row.refund_status">填写退款信息</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </template>
        </Table>
        <Page :total="data.total" :page-size="data.per_page" size="small"
              show-total show-elevator
              @on-change="onPage">
        </Page>
        <!--        图片预览-->
        <Modal title="图片预览" v-model="imgModalVisible" footer-hide>
            <img :src="previewImg" v-if="imgModalVisible" style="width: 100%" alt="">
        </Modal>
        <!--        表单-->
        <PaymentForm :visible="formVisible" mode="edit" :data="curr" @hideForm="formVisible=false"
                     @submit="initData"></PaymentForm>
        <!--        发票表单-->
        <InvoiceForm :visible="invoiceFormVisible" :payment_id="curr.id"
                     @hideForm="invoiceFormVisible=false"></InvoiceForm>
    </div>
</template>
<script>
  import { api } from '@/api/api'
  import { apiRequest } from '@/api/http'
  import { paymentHeadTable } from '@/libs/data-table'
  import PaymentForm from '@/view/components/PaymentForm'
  import InvoiceForm from '@/view/components/InvoiceForm'

  export default {
    data () {
      return {
        col: paymentHeadTable,
        data: {},//数据
        curr: {},//当前行
        pageNum: 1,//页面
        imgModalVisible: false,//图片预览是否显示
        previewImg: '',//图片预览资源
        formVisible: false,//表单是否显示
        invoiceFormVisible: false,//发票表单是否显示
      }
    },
    components: { PaymentForm, InvoiceForm, },
    props: ['customer_id', 'activeValue'],
    mounted () {
      this.initData()
    },
    watch: {
      customer_id (_new) {
        this.pageNum = 1
        this.initData()
      },
      activeValue () {
        this.pageNum = 1
        this.initData()
      }
    },
    methods: {
      initData () {
        const params = {
          pageNum: this.pageNum,
        }
        if (this.customer_id) {
          params.customer_id = this.customer_id
        }
        apiRequest(api.Payment.getList, params, ret => {
          this.data = ret
          console.error(ret)
        })
      },
      //页码点击
      onPage (page) {
        this.pageNum = page
        this.initData()
      },
      handleImgClick (item) {
        this.imgModalVisible = true
        this.previewImg = item.url
      },
      //菜单
      menuHandle (name) {
        switch (name) {
          case 'edit':
            this.formVisible = true
            break
          case 'add_invoice':
            this.invoiceFormVisible = true
            break
          case 'add_refund':
            break
        }
      }
    }
  }
</script>
