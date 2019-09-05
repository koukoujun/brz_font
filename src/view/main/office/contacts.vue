<template>
    <div>
        <!--筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
            <Col span="4">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入姓名/电话" @on-search="query"/>
            </Col>
            <Col span="2">
                <Button type="success" size="small" @click="refresh">
                    <Icon type="ios-refresh"></Icon>
                    刷新
                </Button>
            </Col>
        </Row>
        <!--表格-->
        <Table :data="data.data"  :columns="col"  size="small" highlight-row @on-current-change="row=>curr=row">
            <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small" style="margin-right: 5px"   @click="detail()">查看详情</Button>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total show-elevator @on-change="onPage"></Page>
        <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
            <div v-html="currDetailTable"></div>
        </Drawer>
    </div>
</template>
<script>
  import { api } from '@/api/api'
  import { mapMutations } from 'vuex'
  import { apiRequest } from '@/api/http'
  import { dataToTable, objFilter } from '@/libs/util'
  import { contactsDetailTable, contactsHeadTable, } from '@/libs/data-office'

  export default {
    data () {
      return {
        col: contactsHeadTable,//表头
        pageNum: 1,//页码
        data: {},//数据
        curr: {},//当前row
        currDetailTable: '',//详情html
        showDetailDrawer: false,//是否显示详情抽屉
        keyword: '',//搜索关键字
        formMode: 'add',//客户表单模式  add 添加  edit 修改
        formVisible: false,//客户表单是否显示
        timestamp: 0,//时间戳
      }
    },
    mounted () {
      this.initData()
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, contactsDetailTable)
      }
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
      initData () {
        const keyword = this.keyword.trim()//trim去除前后空格 //客户搜索关键词
        const group = this.group
        const params = {
          pageNum: this.pageNum,
        }
        //关键字筛选
        if (keyword) {
          params.keyword = keyword
        }
        //分组筛选
        if (group) {
          params.group = group
        }
        //请求接口
        apiRequest(api.Contacts.getList,
          params,
          ret => {
            this.data = ret
          })
      },
      //页码点击
      onPage (page) {
        this.pageNum = page
        this.initData()
      },
      //搜索按钮点击
      query () {
        this.pageNum = 1
        this.initData()
      },
      //刷新
      refresh () {
        this.pageNum = 1
        this.keyword = ''
        this.group = null
        this.initData()
      },
      //添加员工
      add () {
        this.formMode = 'add'
        this.formVisible = true
      },
      //查看详情
      detail(){
        this.showDetailDrawer = true;
      },
    }
  }

</script>
