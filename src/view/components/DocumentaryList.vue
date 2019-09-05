<template>
    <div>
        <!--        跟单表格-->
        <Table :data="data.data" :columns="col" size="small">
            <template slot-scope="{row}" slot="content">
                <Poptip trigger="hover" :content="row.content" word-wrap width="278">
                    <span>{{row.content.slice(0,14)}}...</span>
                </Poptip>
            </template>
            <template slot-scope="{ row, index }" slot="img_list">
                <img :src="i.url" v-for="i in row.img_list" width="22px" style="margin:0 2px"
                     @click="handleImgClick(i)">
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button size="small" @click="edit(row)">编辑</Button>
            </template>
        </Table>
        <Page :total="data.total" :page-size="data.per_page" size="small"
              show-total show-elevator
              @on-change="onPage"></Page>
        <!--        图片预览-->
        <Modal title="图片预览" v-model="imgModalVisible" footer-hide>
            <img :src="previewImg" v-if="imgModalVisible" style="width: 100%" alt="">
        </Modal>
        <!--        表单-->
        <DocumentaryForm :visible="formVisible" :data="{...curr}" mode="edit" :customer-id="curr.customer_id"
                         :id="curr.id" @hideForm="hideForm" @success="initData"></DocumentaryForm>
    </div>
</template>
<script>
  import { documentaryHeadTable } from '@/libs/data-table'
  import { api } from '@/api/api'
  import { apiRequest } from '@/api/http'
  import DocumentaryForm from '@/view/components/DocumentaryForm'

  export default {
    components: { DocumentaryForm },
    props: ['customerId'],
    watch: {
      customerId (_new) {
        const id = parseInt(_new)
        this.pageNum = 1
        this.initData()
      }
    },
    data () {
      return {
        data: [],
        col: documentaryHeadTable,
        pageNum: 1,//跟单页码
        formVisible: false,//跟单记录表单是否显示
        curr: {},//当前跟单row
        imgModalVisible: false,//图片预览是否显示
        previewImg: '',//图片预览资源
      }
    },
    mounted () {
      this.initData()
    },
    methods: {
      initData () {
        const params = {
          pageNum: this.pageNum,
          numPerPage: 5,
          customer_id: this.customerId
        }

        apiRequest(api.Documentary.getList, params, ret => {
          this.data = ret
        })
      },
      onPage (page) {
        this.pageNum = page
        this.initData()
      },
      handleImgClick (item) {
        this.imgModalVisible = true
        this.previewImg = item.url
      },
      hideForm () {
        this.formVisible = false
      },
      edit (row) {
        this.curr = row
        this.formVisible = true
      }
    }
  }
</script>
