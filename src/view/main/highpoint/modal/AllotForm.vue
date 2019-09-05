<template>
  <div>
    <Modal :value="visible" class-name="vertical-center-modal" footer-hide :title="this.mode==='add'?'添加分配高端顾问':'编辑分配高端分配顾问'"
      @on-cancel="cancel">
         <Form :model="form" :label-width="120" ref="form" :rules="formInline" inline  >
          <FormItem label="高端中心人员选择" prop="way" >
              <Select v-model="form.high_admin_id" style="width:7rem;" >
                  <Option :value="i" v-for="i in adminList">{{i.name}}</Option>
              </Select>
          </FormItem>
          <FormItem>
              <Button type="primary" @click="submit('form')">提交</Button>
              <Button style="margin-left: 8px" @click="cancel">取消</Button>
          </FormItem>
        </Form>
        </Modal>
    </div>
</template>
<script>
  import { getBaseUrl, getToken } from '@/libs/util'
  import { api } from '@/api/api'
  import { apiRequest } from '@/api/http'

  export default {
    data () {
      return {
        adminList:[],
        allotData:{},
        option: {
          wayList: [],
          purposeList: [],
        },
        form: {
          src_id:'',
          high_admin_id: '',
          high_admin_name:'',
        },
      }
    },
    mounted () {
      this.allotPersonData()
    },
    props: ['visible', 'data', 'mode', 'customerId', 'customer_id'],
    methods: {
      //隐藏表单
      cancel () {
        this.form = { brand_right: 0 }
        this.$emit('hideForm')
      },
      //获取高端人员列表
      allotPersonData(){
         const params={}
         apiRequest(api.Admin.allotPerson,params,ret => {
             let len = ret.data.length;
             for(let i=0;i<len;i++){
                this.adminList.push({name:ret.data[i].name,id:ret.data[i].id})
             }
          })
      },
      //提交表单
      submit (name) {
        this.form.src_id=this.customer_id
        this.form.high_admin_name = this.form.high_admin_id.name
        this.form.high_admin_id=this.form.high_admin_id.id
        
        if(this.form.high_admin_id == ''){
         this.$Message.info('请选择高端中心顾问')
        }
        else{
          apiRequest(api.Customer.allotPersonAdd,this.form, ret => {
            this.$emit('success')
            this.$Message.info(ret)
            this.cancel()
          })
        }
      },
    }
  }
</script>
