<template>
    <div>
        <Modal v-model="visible" width="73" :title="this.temp_mode==='add'?'添加父母补助信息':'编辑父母补助信息'" footer-hide
               @on-cancel="cancel()">
        <Form :model="form" :label-width="120" :rules="formInline" ref="form" inline >
            <Row :gutter="15">
				<!-- 第一列 -->
        <Col :span="6">
            <FormItem label="父亲姓名" prop="father_name">
                <Input v-model="form.father_name" size="small" placeholder="请填写父亲姓名"></Input>
            </FormItem>
            <FormItem label="父亲电话" prop="father_phone">
                <Input type="number" placeholder="请填写父亲电话" v-model="form.father_phone"></Input>
            </FormItem>
            <FormItem label="母亲姓名" prop="mother_name">
                <Input v-model="form.mother_name" size="small" placeholder="请填写母亲姓名" ></Input>
            </FormItem>
            <FormItem label="母亲电话" prop="mother_phone">
                <Input type="number" placeholder="请填写母亲电话" v-model="form.mother_phone"></Input>
            </FormItem>
        </Col>
        <!-- 第二列 -->
        <Col :span="6">
          <FormItem label="常用电话" prop="parent_normal_phone">
            <Input v-model="form.parent_normal_phone" size="small" placeholder="请填写常用电话号码"  ></Input>
          </FormItem>
          <FormItem label="是否问候" prop="is_greeting">
            <Select v-model="form.is_greeting" size="small" style="width: 200%;" >
              <Option value="已问候">已问候</Option>
              <Option value="未问候">未问候</Option>
            </Select>
          </FormItem>
            <FormItem label="是否到账" prop="is_allowance">
                <Select v-model="form.is_allowance" size="small" style="width: 200%;" >
            	    <Option value="已到账">已到账</Option>
            	    <Option value="未到账">未到账</Option>
            	</Select>
            </FormItem>
            <FormItem label="是否签字" prop="is_sign" >
            	<Select v-model="form.is_sign" size="small" style="width: 200%;" >
            				<Option value="已签字">已签字</Option>
            				<Option value="未签字">未签字</Option>
            			</Select>
            	</FormItem>
         </Col>
         <!-- 第三列 -->
         <Col :span="6">
              <FormItem label="开户行" prop="allowance_bnak" >
                  <Input size="small" v-model="form.allowance_bank" placeholder="请填写开户行" ></Input>
              </FormItem>
              <FormItem label="开户行账号" prop="allowance_bank_accout" >
                  <Input size="small" v-model="form.allowance_bank_account" placeholder="请填写开户行账号" ></Input>
              </FormItem>
              <FormItem label="开户行姓名" prop="allowance_bank_name" >
                  <Input size="small" v-model="form.allowance_bank_name" placeholder="请填写开户行姓名" ></Input>
                          	</FormItem>
              <FormItem label="开户行地址" prop="allowance_bank_address" >
                  <Input size="small" v-model="form.allowance_bank_address" placeholder="请填写开户行地址" ></Input>
              </FormItem>
					</Col>
          <!-- 第四列 -->
          <Col :span="6">
             <FormItem label="月份" prop="month">
                 <DatePicker type="date" placeholder="Select month" v-model="form.month"></DatePicker>
             </FormItem>
          </Col>
                </Row>
                <Row>
                    <Col :span="8">
                        <FormItem label="备注">
                            <Input type="textarea" placeholder="信息备注" :autosize="{minRows: 4,maxRows: 6}"
                                   v-model="form.desc"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem>
                    <Button type="primary" @click="submit('form')">提交</Button>
                    <Button style="margin-left: 8px" @click="cancel()">取消</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
  import { apiRequest } from '@/api/http'
  import { api } from '@/api/api'
  import ChinaArea from '@/libs/China-area'

  export default {
    data () {
      return {
        ChinaArea: ChinaArea,//中国行政区数据
        temp_mode:this.mode,
        option: {
          fromList: [],
          cityList: [],
          lessonList: [],
        },
        form: {
          id: "",
          admin_id: "",
          employ_id: "",
          month: "",
          is_allowance: "",
          is_greeting: "",
          is_sign: "",
          create_at: "",
          update_at: "",
          name: "",
          father_name: "",
          father_phone: "",
          mother_name: "",
          mother_phone: "",
          parent_normal_phone: "",
          allowance_bank: "",
          allowance_bank_account: "",
          allowance_bank_address: "",
          allowance_bank_name: ""
        },
	    //验证规则
		formInline: {
			month: [
				{ required: true, message: '请选择月份', trigger: 'blur',pattern:/.+/ },
			],
			father_name:[
				{required:true,message:'请填写父亲姓名',trigger:'blur'},
			],
			father_phone: [
				{ required: true, message: '请填写父亲电话号码', trigger: 'blur' },
				{ type: 'string', min:11 , message: '请填写正确的电话号码', trigger: 'blur' }
			],
			mother_name: [
				{ required: true, message: '请填写母亲姓名', trigger: 'blur' },
			],
			mother_phone:[
				{ required: true, message: '请填写母亲电话号码', trigger: 'blur'},
				{ type: 'string', min:11 , message: '请填写正确的电话号码', trigger: 'blur' }
			],
			is_greeting: [
				{ required: true, message: '是否问候', trigger: 'blur' },
			],
			is_allowance: [
				{ required: true, message: '是否到账', trigger: 'blur' },
			],
			is_sign:[
				{ required: true, message: '是否签字', trigger: 'blur'},
			],
		   },
      }
    },
    watch: {
      mode(val){
         this.temp_mode = this.mode;
         this.updata()
      },
      data() {
        this.updata()
      }
    },
    mounted () {
      this.getOption()
    },
    props: ['employ_id','customer_name', 'visible', 'mode', 'data'],
    methods: {
      //同步数据
      updata(){
         if (this.temp_mode === 'edit') {
           const data = this.data
           this.form = {
             id: data.id,
             admin_id: data.admin_id,
             employ_id: data.employ_id,
             month: data.month,
             is_allowance: data.is_allowance,
             is_greeting:data.is_greeting,
             is_sign: data.is_sign,
             name:data.name,
             father_name: data.father_name,
             father_phone: data.father_phone,
             mother_name: data.mother_name,
             mother_phone: data.mother_phone,
             parent_normal_phone: data.parent_normal_phone,
             allowance_bank: data.allowance_bank,
             allowance_bank_account: data.allowance_bank_account,
             allowance_bank_address: data.allowance_bank_address,
             allowance_bank_name: data.allowance_bank_name
           }
         }
      },
      //获取选项
      getOption () {
        apiRequest(api.Common.getOption, {
          'list': 'city_list,lesson_list,from_list'
        }, ret => {
          this.option = {
            fromList: ret.from_list,
            cityList: ret.city_list,
            lessonList: ret.lesson_list,
          }
        })
      },
      //隐藏表单
      cancel () {
        this.form = { brand_right: 0 }
        this.$emit('hideForm')
        this.$emit('change_mode')
      },
      //提交表单
      submit (name) {

        console.log(this.data)
        this.$refs[name].validate((valid) => {
        if (valid) {

            console.log(this.form)
            //转化中国标准日期格式
            var d = new Date(this.form.month);
            var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            this.form.month=datetime.toString()

            this.form.id=this.employ_id
            this.form.employ_id=this.employ_id
            this.form.name=this.customer_name

            const params = { ...this.form }
            params.customer_id = this.customer_id
            const apiName = this.temp_mode === 'add' ? api.Allowance.add : api.Allowance.edit

            apiRequest(apiName, params, ret => {
              this.$emit('success')
              this.$Message.info(ret)
              this.cancel()
              this.$emit('initData')
            })


            this.$Message.success('Success!');
            this.delete_button=false;
          }
        else{
            this.$Message.success('Fail!');
          }
        })

      },
    }
  }

</script>
