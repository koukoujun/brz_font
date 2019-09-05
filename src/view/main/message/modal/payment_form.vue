<template>
    <div>
        <Modal :value="visible" class-name="vertical-center-modal" footer-hide
               :title="this.mode==='add'?'发票回复':'发票回复'"
               @on-cancel="cancel">
			  <Form :model="form" :label-width="120" ref="form" :rules="formInline" inline  >
                <FormItem label="发票状态" prop="way" >
                    <Select v-model="form.invoice_status_name" size="small">
                        <Option value="0">未开发票</Option>
                        <Option value="1">已开发票</Option>
                    </Select>
                </FormItem>
                <FormItem label="发票凭证">
                    <div style="width:600px;">
                        <div class="demo-upload-list" v-for="item in uploadList">
                            <template v-if="item.status === 'finished'">
                                <img :src="item.url">
                                <div class="demo-upload-list-cover">
                                    <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                </div>
                            </template>
                            <template v-else>
                                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                            </template>
                        </div>
                        <div v-show="imgshow">
                        <Upload
                                ref="upload"
                                :on-success="handleImgSuccess"
                                :format="['jpg','jpeg','png']"
                                :default-file-list="defaultUploadList"
                                :max-size="2048"
                                :show-upload-list="false"
                                :before-upload="handleBeforeUpload"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleMaxSize"
                                multiple
                                type="drag"
                                :action="uploadUrl"
                                style="display: inline-block;width:58px;">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                        </div>
                    </div>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="submit('form')">提交</Button>
                    <Button style="margin-left: 8px" @click="cancel">取消</Button>
                </FormItem>
            </Form>
        </Modal>
        <!--  图片预览-->
        <Modal title="图片预览" v-model="imgModalVisible" footer-hide>
            <img :src="previewImg" v-if="imgModalVisible" style="width: 100%" alt="">
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
        option: {
          wayList: [],
          purposeList: [],
        },
        data:{},
        form: {
          src_id:'',
          invoice_status_name: '',
          voucher_img: '',
          answer:'',
        },
        //验证规则
        formInline: {
         invoice_status_name: [
            { required: true, message: '请选择发票状态', trigger: 'blur' }
            ],
         voucher_img: [
            { required: true, message: '请上传凭证', trigger: 'blur' },
          ],
        },
        uploadUrl: getBaseUrl() + api.Common.upload + '?token=' + getToken(),
        uploadList: [],//图片上传截图列表
        defaultUploadList: [],//默认上传列表
        imgModalVisible: false,
        previewImg: '',
        imgshow:true,
      }
    },
    mounted () {
      this.uploadList = this.$refs.upload.fileList
    },
    props: ['src_id','visible','type', 'mode','id'],
    methods: {
      //图片上传成功
      handleImgSuccess (response, file, fileList) {
        file.url = response
        this.form.voucher_img = file.url
        this.imgshow = false
        //console.error(this.uploadList)
      },
      //图片上传预览
      handleView (img) {
        this.previewImg = img
        this.imgModalVisible = true
      },
      handleBeforeUpload () {
        const check = this.uploadList.length < 5
        if (!check) {
          this.$Notice.warning({
            title: '最多上传五张截图'
          })
        }
        return check
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件格式 ' + file.name + ' 不正确，请选择jpg或png图片文件'
        })
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '文件太大！',
          desc: '文件  ' + file.name + ' 太大了, 请不要超过 2M.'
        })
      },
      //删除已上传的图片
      handleRemove (file) {
        this.imgshow = true
        const fileList = this.$refs.upload.fileList
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      },
      //隐藏表单
      cancel () {
        this.$emit('hideForm')
      },
      //提交表单
      //提交表单
      submit (name) {

       this.form.src_id=this.src_id
       this.form.type=this.type
       this.$refs[name].validate((valid) => {
       if (valid) {
           apiRequest(api.Payment.updates, this.form, ret => {
               this.$emit('success')
               //this.$Message.info(ret)
               //更新回复内容
               this.data.id=this.id
               this.data.answer="发票已开"
               apiRequest(api.Message.answer,this.data, ret => {
               });

               this.cancel()
               this.$emit('answer')
               this.$emit('update')
             })
            this.$Message.success('Success!');
            this.imgshow = true
          }
        else{
            this.$Message.success('Fail!');
          }
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
