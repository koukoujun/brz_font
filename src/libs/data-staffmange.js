//员工详情
export const staffHeadTable = [
  {
    title: '编号',
    key: 'id',
    width:'105',
  },
  {
    title: '姓名',
    key: 'name',
  },
  {
    title: '性别',
    key: 'sex',
	  width:'60px'
  },
  {
    title: '电话',
    key: 'phone',
  },
  // {
  //   title: '出生日期',
  //   key: 'birthday',
  //   width:'100px'
  // },
  // {
  //   title:'地区',
  //   key:'area',
  //   width:'60'
  // },
  {
    title: '部门',
    key: 'department_name',
  },
  {
    title: '职务',
    key: 'job',
  },
	// {
	// title:'籍贯',
	// key:'city',
	// width:'120px'
	// },
  // {
  //   title: '婚配',
  //   key: 'marry',
  // },
	{
		title:'学历',
		key:'degree'
	},
  {
    title: '毕业院校',
    key: 'graduate_school',
  },
  {
    title: '专业',
    key: 'profession',
  },
  {
    title: '入职时间',
    key: 'entry_time',
		width:'100px'
  },
  {
    title: '操作',
    slot: 'action',
    width: '250px',
    align: 'center'
  }
]

//员工表头详情信息
export const staffHeadTables = [
  {
    title: '编号',
    key: 'id',
  },
	{
	  title: '姓名',
	  key: 'name',
	},
  {
    title: '性别',
    key: 'sex',
  },
  {
    title: '电话',
    key: 'phone',
  },
  {
    title: '出生日期',
    key: 'birthday',
  },
  {
    title: '部门',
    key: 'department',
  },
  {
    title: '职务',
    key: 'job',
  },
  	{
  	title:'省',
  	key:'province'
  },
  	{
  	title:'市',
  	key:'city'
  },
	{
		title:'身份证号码',
		key:'id_card_number'
	},
  {
    title: '婚配',
    key: 'marry',
  },
  {
		title:'学历',
		key:'degree'
  },
  {
    title: '毕业院校',
    key: 'graduate_school',
  },
  {
    title: '专业',
    key: 'profession',
  },
  {
    title: '入职时间',
    key: 'entry_time',
  },
  {
	  title: '在职状态',
	  key: 'is_employ',
  },
  {
    title: 'qq',
    key: 'qq',
  },
  {
    title: '微信',
    key: 'wechat',
  },
  {
    title: '邮箱',
    key: 'email',
  },
  {
    title: '私人电话',
    key: 'private_phone',
  },
]

//员工详情信息
export const staffDetailTable = [
  {
    name: '编号',
    key: 'id',
  },
	{
	  name: '姓名',
	  key: 'name',
	},
  {
    name: '性别',
    key: 'sex',
  },
  {
    name: '电话',
    key: 'phone',
  },
  {
    name: '出生日期',
    key: 'birthday',
  },
  {
    name: '部门',
    key: 'department_name',
		width:'80px'
  },
  {
    name: '职务',
    key: 'job',
  },
  	{
  	name:'省',
  	key:'province'
  },
  	{
  	name:'市',
  	key:'city'
  },
	{
		name:'籍贯',
		key:'native_place'
	},
	{
		name:'身份证号码',
		key:'id_card_number'
	},
  {
    name: '婚配',
    key: 'marry',
  },
  {
		name:'学历',
		key:'degree'
  },
  {
    name: '毕业院校',
    key: 'graduate_school',
  },
  {
    name: '专业',
    key: 'profession',
  },
  {
    name: '入职时间',
    key: 'entry_time',
  },
  {
	  name: '在职状态',
	  key: 'is_employ',
  },
  {
    name: 'qq',
    key: 'qq',
  },
  {
    name: '微信',
    key: 'wechat',
  },
  {
  	  name: '邮箱',
  	  key: 'email',
  },
    {
  	  name: '私人电话',
  	  key: 'private_phone',
  },
]

// 简历
export const cvHeadTable=[
	{
		title:'编号',
		key:'id'
	},
	{
		title:'姓名',
		key:'name',
	},
	{
		title:'年龄',
		key:'age'
	},
	{
		title:'面试状态',
		key:'interview_status'
	},
	{
		title:'面试人',
		key:'hr_name'
	},
	{
		title:'面试结果',
		key:'interview_result'
	},
	{
		title:'是否入职',
		key:'is_entry'
	},
	{
		title:'渠道',
		key:'channel'
	},
	{
     title:'简历照片',
	 key:'img',
　　 align: 'center',
　　 width: 110,
　　 render:(h,params) => {
　　　　　　return h('img', {
　　　　　　　　attrs: {
　　　　　　　　　　src: params.row.img,
                   onerror:'this.src="https://goss.veer.com/creative/vcg/veer/800water/veer-133632476.jpg"'
　　　　　　　　},
　　　　　　　　style: {
　　　　　　　　　　marginRight: '5px',
                   width:'30px'
　　　　　　　　},
　　　　　　　　on:{
					click:(e)=>{
						this.handleViews(e.srcElement.currentSrc)
					}
　　　　　　　　}
　　　　　　});
　　　　},
	},
	{
		title:'面试人评价',
		key:'hr_evaluation'
	},
	{
		title:'添加时间',
		key:'create_at'
	},
	{
		title:'更改时间',
		key:'update_at'
	},
	 {
	  title: '操作',
	  slot: 'action',
	  width: '100px',
	  align: 'center'
	}
]
//表头简历详情
export const cvHeadTables=[
		{
			title:'编号',
			key:'id'
		},
		{
			title:'姓名',
			key:'name',
		},
		{
			title:'年龄',
			key:'age'
		},
		{
			title:'面试状态',
			key:'interview_status'
		},
		{
			title:'面试人',
			key:'hr_name'
		},
		{
			title:'面试结果',
			key:'interview_result'
		},
		{
			title:'是否入职',
			key:'is_entry'
		},
		{
			title:'渠道',
			key:'channel'
		},
		{
			title:'面试人评价',
			key:'hr_evaluation'
		},
		{
			title:'添加时间',
			key:'create_at'
		},
		{
			title:'更改时间',
			key:'update_at'
		},
]
//简历详情
export const cvDetailTable=[
		{
			name:'编号',
			key:'id'
		},
		{
			name:'姓名',
			key:'name',
		},
		{
			name:'年龄',
			key:'age'
		},
    {
      name:'预约面试时间',
      key:'order_time'
    },
		{
			name:'面试状态',
			key:'interview_status'
		},
		{
			name:'面试人',
			key:'hr_name'
		},
		{
			name:'面试结果',
			key:'interview_result'
		},
		{
			name:'是否入职',
			key:'is_entry'
		},
		{
			name:'渠道',
			key:'channel'
		},
		{
			name:'面试人评价',
			key:'hr_evaluation'
		},
		{
			name:'添加时间',
			key:'create_at'
		},
		{
			name:'更改时间',
			key:'update_at'
		},
]
//管理培训
export const trainHeadTable=[
	{
		title:'编号',
		key:'id'
	},
	{
		title:'主题',
		key:'theme'
	},
	{
		title:'培训时间',
		key:'start_time'
	},
	{
		title:'培训人',
		key:'teacher'
	},
	{
		title:'培训地点',
		key:'address'
	},
	{
		title:'培训部门',
		key:'department'
	},
	{
		title:'缺席人员',
		key:'address'
	},
	{
		title:'描述',
		key:'desc',
		width:'400px',
	},
	{
	  title: '操作',
	  slot: 'action',
	  width: '150px',
	  align: 'center'
	}
]
//管理培训表头详情
export const trainHeadTables=[
	{
		title:'编号',
		key:'id'
	},
	{
		title:'主题',
		key:'theme'
	},
	{
		title:'培训时间',
		key:'start_time'
	},
	{
		title:'培训人',
		key:'teacher'
	},
	{
		title:'培训地点',
		key:'address'
	},
	{
		title:'培训部门',
		key:'department'
	},
	{
		title:'缺席人员',
		key:'absence'
	},
	{
		title:'描述',
		key:'desc'
	},
	{
		title:'添加时间',
		key:'create_at'
	},
]
//管理培训详情
export const trainDetailTable=[
	{
		name:'编号',
		key:'id'
	},
	{
		name:'主题',
		key:'theme'
	},
	{
		name:'培训时间',
		key:'start_time'
	},
	{
		name:'培训人',
		key:'teacher'
	},
	{
		name:'培训地点',
		key:'address'
	},
	{
		name:'培训部门',
		key:'department'
	},
	{
		name:'缺席人员',
		key:'absence'
	},
	{
		name:'描述',
		key:'desc'
	},
	{
		name:'添加时间',
		key:'create_at'
	},
]
//父母补助
export const allowanceHeadTable=[
	{
		title:'编号',
		key:'id'
	},
	{
		title:'月份',
		key:'month'
	},
	{
		title:'姓名',
		key:'name'
	},
	{
		title:'父亲姓名',
		key:'father_name'
	},
	{
		title:'父亲电话',
		key:'father_phone'
	},
	{
		title:'母亲姓名',
		key:'mother_name'
	},
	{
		title:'母亲电话',
		key:'mother_phone'
	},
	{
		title:'常用电话',
		key:'parent_normal_phone'
	},
	{
		title:'是否问候',
		key:'is_greeting'
	},
	{
		title:'是否到账',
		key:'is_allowance'
	},
	{
		title:'是否签字',
		key:'is_sign'
	},
	{
	  title: '操作',
	  slot: 'action',
	  width: '150px',
	  align: 'center'
	}
]
//父母补助表头详情
export const allowanceHeadTables=[
	{
		title:'编号',
		key:'id'
	},
	{
		title:'月份',
		key:'month'
	},
	{
		title:'姓名',
		key:'name'
	},
	{
		title:'父亲姓名',
		key:'father_name'
	},
	{
		title:'父亲电话',
		key:'father_phone'
	},
	{
		title:'母亲姓名',
		key:'mother_name'
	},
	{
		title:'母亲电话',
		key:'mother_phone'
	},
	{
		title:'常用电话',
		key:'parent_normal_phone'
	},
	{
		title:'是否问候',
		key:'is_greeting'
	},
	{
		title:'是否到账',
		key:'is_allowance'
	},
	{
		title:'是否签字',
		key:'is_sign'
	},
		{
		title:'到账银行',
		key:'allowance_bank'
	},
	{
		title:'到账银行资金',
		key:'allowance_bank_account'
	},
	{
		title:'到账银行地址',
		key:'allowance_bank_address'
	},
	{
		title:'到账银行名称',
		key:'allowance_bank_name'
	},
]
//父母补助
export const allowanceDetailTable=[
	{
		name:'编号',
		key:'id'
	},
	{
		name:'月份',
		key:'moth'
	},
	{
		name:'姓名',
		key:'name'
	},
	{
		name:'父亲姓名',
		key:'father_name'
	},
	{
		name:'父亲电话',
		key:'father_phone'
	},
	{
		name:'母亲姓名',
		key:'mother_name'
	},
	{
		name:'母亲电话',
		key:'mother_phone'
	},
	{
		name:'常用电话',
		key:'parent_normal_phone'
	},
	{
		name:'是否问候',
		key:'is_greeting'
	},
	{
		name:'是否到账',
		key:'is_allowance'
	},
	{
		name:'是否签字',
		key:'is_sign'
	},
		{
		name:'到账银行',
		key:'allowance_bank'
	},
	{
		name:'到账银行资金',
		key:'allowance_bank_account'
	},
	{
		name:'到账银行地址',
		key:'allowance_bank_address'
	},
	{
		name:'到账银行名称',
		key:'allowance_bank_name'
	},
]
//绩效考核
export const performanceDetailTable=[
	{
		name:'编号',
		key:'id'
	},
	{
		name:'姓名',
		key:'name'
	},
	{
		name:'地区',
		key:'area'
	},
	{
		name:'部门',
		key:'departmet'
	},
	{
		name:'收款(初训)',
		key:'firstearn'
	},
	{
		name:'收款(复训)',
		key:'overearn'
	},
	{
		name:'退款',
		key:'refund'
	},
	{
		name:'家长作业',
		key:'familywork'
	},
	{
		name:'推下一阶课程',
		key:'nextlesson'
	},
	{
		name:'课后作业',
		key:'afterwork'
	},
		{
		name:'朋友圈更新',
		key:'friendsupdate'
	},
	{
		name:'实到天数',
		key:'signdata'
	},
	{
		name:'请假天数',
		key:'leavedata'
	},
	{
		name:'回访电话',
		key:'return_phone'
	},
  {
  	name:'小型沙龙',
  	key:'salon'
  },
  {
  	name:'咨询会',
  	key:'ask_meeting'
  },
  {
  	name:'户外行动',
  	key:'out_activity'
  },
  {
  	name:'一对一咨询',
  	key:'one_to_one_ask'
  },
  {
  	name:'学校报告会',
  	key:'school_report'
  },
  {
  	name:'家长学校',
  	key:'patriarch_school'
  },
  {
  	name:'线下销售空课',
  	key:'offline_lesson'
  },
]
