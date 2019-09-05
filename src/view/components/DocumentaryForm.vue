<template>
    <div>
        <Modal :value="true" class-name="vertical-center-modal" footer-hide
               :title="this.mode==='add'?'添加跟单记录':'编辑跟单记录'"
               @on-cancel="cancel">
            <Form :model="form" :label-width="120">
                <FormItem label="跟单方式">
                    <Select v-model="form.way" size="small">
                        <Option :value="i" v-for="i in option.wayList">{{i}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="跟单目的">
                    <Select v-model="form.purpose" size="small">
                        <Option :value="i" v-for="i in option.purposeList">{{i}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="下次跟单时间">
                    <DatePicker type="datetime" size="small" v-model="form.next_follow_time"></DatePicker>
                </FormItem>
                <FormItem label="上传截图">
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
                </FormItem>
                <FormItem label="跟单详情">
                    <Input type="textarea" placeholder="跟单详情" :autosize="{minRows: 4,maxRows: 6}"
                           v-model="form.content"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="submit">提交</Button>
                    <Button style="margin-left: 8px" @click="cancel">取消
                    </Button>
                </FormItem>
            </Form>
        </Modal>
        <!--        图片预览-->
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
    watch: {
      data () {
        if (this.mode === 'edit') {
          this.form = this.data
        }
      }
    },
    data () {
      return {
        option: {
          wayList: [],
          purposeList: [],
        },
        form: {
					customer_id:'55',
          way: '',
          purpose: '',
          next_follow_time: '',
          content: '',
        },
        uploadUrl: getBaseUrl() + api.Common.upload + '?token=' + getToken(),
        uploadList: [],//图片上传截图列表
        defaultUploadList: [],//默认上传列表
        imgModalVisible: false,
        previewImg: '',
      }
    },
    mounted () {
      this.uploadList = this.$refs.upload.fileList

      this.getOption()
    },
    props: ['visible', 'data', 'mode', 'customerId', 'id'],
    methods: {
      getOption () {
        apiRequest(api.Common.getOption, {
          'list': 'documentary_way_list,documentary_purpose_list'
        }, ret => {
          this.option = {
            fromList: ret.from_list,
            cityList: ret.city_list,
            lessonList: ret.lesson_list,
            wayList: ret.documentary_way_list,
            purposeList: ret.documentary_purpose_list,
          }
        })
      },
      //图片上传成功
      handleImgSuccess (response, file, fileList) {
        file.url = response
				console.log(file.url)
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
        const fileList = this.$refs.upload.fileList
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      },
      //隐藏表单
      cancel () {
        this.form = { brand_right: 0 }
        this.$emit('hideForm')
      },
      //提交表单
      submit () {
        let form = {
          customer_id: this.customerId,
          way: this.form.way,
          purpose: this.form.purpose,
          next_follow_time: this.form.next_follow_time,
          content: this.form.content,
        }

        let imgList = []
        for (let i = 0; i < this.uploadList.length; i++) {
          imgList.push({
            name: this.uploadList[i].name,
            url: this.uploadList[i].url,
          })
        }

        if (!imgList) {
          form.img_list = ''
        } else {
          form.img_list = JSON.stringify(imgList)
        }

        let apiName = this.mode === 'add' ? api.Documentary.add : api.Documentary.edit
        if (this.mode === 'edit') {
          form.id = this.id
        }

        apiRequest(api.Documentary.add, form, ret => {
          this.$emit('success')
          this.$Message.info(ret)
          this.cancel()
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
