<template>
  <div>
    <Modal :value="visible" class-name="vertical-center-modal" footer-hide :title="'转移客户'"
      @on-cancel="cancel">
         <Form :model="form" :label-width="120" ref="form" :rules="formInline" inline  >
          <FormItem label="输入顾问" prop="way" >
            <Input  placeholder="请填写转移顾问姓名" v-model="form.to_admin_name" ></Input>
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
  import Cookies from 'js-cookie'

  export default {
    data () {
      return {
        form: {
          ids:'',
		      to_admin_name:'',
        },
        //验证规则
        formInline: {
          to_admin_name: [
            { required: true, message: '请填写顾问姓名', trigger: 'blur' }
            ],
        },
      }
    },
    mounted () {
    },
    props: ['visible','id'],
    methods: {
      //隐藏表单
      cancel () {
        this.form = { brand_right: 0 }
        this.$emit('hideForm')
      },
      //提交表单
      submit (name) {
        let form = {
          ids:this.id,
		      to_admin_name:this.form.to_admin_name,
        }
        apiRequest(api.Customer.transfer, form, ret => { 
          this.$Message.info(ret)
          this.cancel()
          this.$emit('clickInit')
        })
      },
    }
  }
</script>
<style>
    .demo-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
