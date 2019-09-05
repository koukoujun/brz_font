<template>
    <div>
        <div>
            <Modal :value="visible" class-name="vertical-center-modal" footer-hide
                   :title="this.mode==='add'?'添加发票申请':'编辑发票申请'"
                   @on-cancel="cancel">
                <Form :model="form" :label-width="120">
                    <FormItem label="发票金额">
                        <Input v-model="form.value" size="small"></Input>
                    </FormItem>
                    <FormItem label="家长开户行">
                        <Select v-model="form.bank_name" size="small">
                            <Option :value="i" v-for="i in option.bankList">{{i}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="家长开户行账号">
                        <Input v-model="form.bank_account" size="small"></Input>
                    </FormItem>
                    <FormItem label="家长开户行姓名">
                        <Input v-model="form.bank_customer_name" size="small"></Input>
                    </FormItem>
                    <FormItem label="家长开户行地址">
                        <Input v-model="form.bank_address" size="small"></Input>
                    </FormItem>
                    <FormItem label="发票快递地址">
                        <Input v-model="form.receive_address" size="small"></Input>
                    </FormItem>
                    <FormItem label="收票人电话">
                        <Input v-model="form.receive_phone" size="small"></Input>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model="form.desc" size="small" type="textarea"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="submit">提交</Button>
                        <Button style="margin-left: 8px" @click="cancel">取消
                        </Button>
                    </FormItem>
                </Form>
            </Modal>
        </div>
    </div>
</template>
<script>
  import { apiRequest } from '@/api/http'
  import { api } from '@/api/api'

  export default {
    data () {
      return {
        option: {
          bankList: [],
        },
        form: {
          value: 0,//金额
          bank_name: '',//家长开户行
          bank_account: '',//开户行账号
          bank_customer_name: '',//开户行姓名
          bank_address: '',//开户行地址
          receive_address: '',//发票快递地址
          receive_phone: '',//收票电话
          desc: '',//备注说明
        },
      }
    },
    props: {
      visible: {
        default: false, type: Boolean,
      },
      mode: {
        default: 'add', type: String
      },
      payment_id: {
        default: 0,
      },
      data: {},
    },
    mounted () {
      this.getOption()
    },
    methods: {
      //获取选项
      getOption () {
        apiRequest(api.Common.getOption, {
          list: 'bank_list',
        }, ret => {
          this.option.bankList = ret.bank_list
        })
      },
      //隐藏表单
      cancel () {
        this.form = { brand_right: 0 }
        this.$emit('hideForm')
      },
      //提交表单
      submit () {
        const apiName = api.Invoice.add
        const params = this.form
        params.payment_id = this.payment_id
        apiRequest(apiName, params, ret => {
          this.$emit('success')
          this.$Message.info(ret)
          this.cancel()
        })
      },
    }
  }
</script>
