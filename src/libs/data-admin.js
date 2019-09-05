//管理员
export const adminHeadTable = [
  {
    title: '编号',
    key: 'id',
  },
	{
	title: '姓名',
	key: 'name',
	},
  {
    title: '头像',
    key: 'icon',
    width: 170,
    align: 'center',
　　render:(h,params) => {
　　　　　　return h('img', {
　　　　　　　　attrs: {
　　　　　　　　　　src: params.row.icon,
								   onerror:'this.src="http://brz-crm.oss-cn-beijing.aliyuncs.com/img/20190710154039_MQ1A.jpg"'
　　　　　　　　},
　　　　　　　　style: {
　　　　　　　　　　marginRight: '5px',
								   width:'30px'
　　　　　　　　},
　　　　　　　　on:{
									click:(e)=>{

					    }
	　　　　  }
	　　　});
　　},
  },
  {
    title: '用户名称',
    key: 'username',
  },
 //  {
 //    title: '密码',
 //    key: 'password',
	// width:'250px'
 //  },
  {
    title: '部门',
    key: 'department_name',
  },
  {
    title: '职务',
    key: 'role_names',
  },
  {
	title:'籍贯',
	key:'area'
  },
  {
    title: '操作',
    slot: 'action',
    width: '200px',
    align: 'center'
  }
]
//管理员详情
export const adminDetailTable=[
  {
    name: '编号',
    key: 'id',
	width:'105',
  },
	{
	name: '姓名',
	key: 'name',
	width:'80px'
	},
  {
    name: '图标',
    key: 'icon',
	width:'60px'
  },
  {
    name: '用户名称',
    key: 'username',
    width:'110px'
  },
  {
    name: '密码',
    key: 'password',
	width:'100px'
  },
  {
    name: '部门',
    key: 'department_name',
	width:'80px'
  },
  {
    name: '职务',
    key: 'role_names',
  },
  {
	name:'籍贯',
	key:'area'
  },
  {
	name:'最后登录时间',
	key:'last_logoin_time'
  },
  {
	name:'录入时间',
	key:'create_at'
  },
  {
	name:'更新时间',
	key:'update_at'
  }
]
//角色管理
export const roleHeadTable=[
	{
	 title:'编号',
	 key:'id'
	},
	{
   title:'角色',
	 key:'name'
	},
	{
	 title:'角色权限',
	 key:'actions'
	},
	{
	  title: '操作',
	  slot: 'action',
	  width: '150px',
	  align: 'center'
	}
]
//角色管理详情
export const roleDetailTable=[
	{
	 name:'编号',
	 key:'id'
	},
	{
   name:'角色',
	 key:'name'
	},
	{
	 name:'角色权限',
	 key:'action_arr'
	}
]
