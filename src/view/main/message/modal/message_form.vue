<template>
    <div>
        <Modal :value="visible" class-name="vertical-center-modal" footer-hide
               :title="this.mode==='add'?'填写回复内容':'填写回复内容'"
               @on-cancel="cancel">
            <Form :model="form" :label-width="150" :rules="formInline" ref="form" inline  >
                <Row :gutter="10" >
                  <Col :span="24">
                    <FormItem label="Answer" prop="answer" >
                        <Input type="textarea" placeholder="请填写回复内容" :autosize="{minRows: 4,maxRows: 6}" v-model="form.answer"></Input>
                    </FormItem>
                  </Col>
                </Row>
                <FormItem>
                    <Button type="primary" @click="submit('form')">提交</Button>
                    <Button style="margin-left:4rem" @click="cancel">取消</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
  import { apiRequest } from '@/api/http'
  import { api } from '@/api/api'

  export default {
  data () {
    return {
      data:{},
      form: {
       src_id:"",
       answer:"",
      },
	  //验证规则
		formInline: {
		  answer: [
				{ required: true, message: '请填写回复内容', trigger: 'blur' },
			],
		  },
     }
    },
    mounted () {

    },
    props: ['src_id','visible','type', 'mode','id'],
    methods: {
      //隐藏表单
      cancel () {
        this.form = { brand_right: 0 }
        this.$emit('hideForm')
      },
      //提交表单
      submit (name) {
       this.form.src_id=this.src_id
       this.form.type=this.type
       this.$refs[name].validate((valid) => {
        if (valid) {
           //工作汇报
           if(this.type=='1'||this.type=='2'||this.type=='3'){
               apiRequest(api.Report.updates, this.form, ret => {
               this.$emit('success')
               this.$Message.info(ret)
               //更新回复内容
               this.data.id=this.id
               this.data.answer=this.form.answer
               apiRequest(api.Message.answer,this.data, ret => {});
               this.cancel()
               this.$emit('answer')
               this.$emit('update')
             })
           }
           //工作申请
           if(this.type=='4'||this.type=='5'||this.type=='6'||this.type=='7'||this.type=='8'||this.type=='9'){
               apiRequest(api.Apply.updates, this.form, ret => {
               this.$emit('success')
               this.$Message.info(ret)
               //更新回复内容
               this.data.id=this.id
               this.data.answer=this.form.answer
               apiRequest(api.Message.answer,this.data, ret => {});
               this.cancel()
               this.$emit('answer')
               this.$emit('update')
             })
           }
           //每日一问
           if(this.type=='10'){
               apiRequest(api.Question.updates, this.form, ret => {
               this.$emit('success')
               //this.$Message.info(ret)
               //更新回复内容
               this.data.id=this.id
               this.data.answer=this.form.answer
               apiRequest(api.Message.answer,this.data, ret => {});
               this.cancel()
               this.$emit('answer')
               this.$emit('update')
             })
           }


            this.$Message.success('Success!');
          }
        else{
            this.$Message.success('Fail!');
          }
        })

      },
    }
  }

</script>
