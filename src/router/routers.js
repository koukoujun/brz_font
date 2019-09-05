import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  //-------------------消息中心--------------------
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/main/message/index.vue')
      }
    ]
  },
  //-------------------个人中心--------------------
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'person_center',
        name: 'person_center',
        meta: {
          icon: 'ios-person',
          title: '个人中心'
        },
        component: () => import('@/view/main/personal/personCenter.vue')
      }
    ]
  },
  //-------------------argu--------------------
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  },
	//-------------------个人办公--------------------
  {
    path: '/main',
    name: 'main',
    meta: {
      icon: 'ios-briefcase',
      title: '个人办公',
      access: ['1','2','3','4','5','6']
    },
    component: Main,
    children: [
      {
        path: '/work_report',
        name: 'work_report',
        meta: {
          title: '工作汇报',
          icon: 'md-create',
        },
        component: () => import('@/view/main/office/workReport.vue')
      },
      {
        path: '/work_apply',
        name: 'work_apply',
        meta: {
          title: '工作申请',
          icon: 'md-done-all'
        },
        component: () => import('@/view/main/office/workApply.vue')
      },
      // {
      //   path: '/today_question',
      //   name: 'today_question',
      //   meta: {
      //     title: '每日一问',
      //     icon: 'md-help'
      //   },
      //   component: () => import('@/view/main/office/question.vue')
      // },
      {
        path: '/ask',
        name: 'ask',
        meta: {
          title: '每日一问',
          icon: 'md-help'
        },
        component: () => import('@/view/main/office/ask.vue')
      },
      {
        path: '/ask_modal',
        name: 'ask_modal',
        meta: {
           title:'回复模块',
           icon: 'md-help',
           hideInMenu: true
        },
        component: () => import('@/view/main/office/modal/ask_modal.vue')
      },
      {
        path: '/knowledge',
        name: 'knowledge',
        meta: {
          title: '知识管理',
          icon: 'md-school'
        },
        component: () => import('@/view/main/office/knowledge.vue')
      },
      {
        path: '/contacts',
        name: 'contacts',
        meta: {
          title: '通讯录',
          icon: 'md-contact'
        },
        component: () => import('@/view/main/office/contacts.vue')
      },
      {
        path: '/feedback',
        name: 'feedback',
        meta: {
          title: '意见反馈',
          icon: 'md-card'
        },
        component: () => import('@/view/main/office/feedback.vue')
      },
      {
        path: '/notice',
        name: 'notice',
        meta: {
          title: '发布公告',
          icon: 'md-text'
        },
        component: () => import('@/view/main/office/notice.vue')
      },
    ]
  },
  //客户管理
  {
    path: '/customer',
    name: 'customer',
    meta: {
      icon: 'md-person',
      title: '客户管理',
      access:['1','2']
    },
    component: Main,
    children: [
      {
        path: '/customers',
        name: 'customers',
        meta: {
          title: '客户列表',
          icon: 'md-list'
        },
        component: () => import('@/view/main/customer/customers.vue')
      },
      {
        path: '/documentary',
        name: 'documentary',
        meta: {
          title: '跟单记录',
          icon: 'md-list-box'
        },
        component: () => import('@/view/main/customer/documentary.vue')
      },
      {
        path: '/customer/new_documentary',
        name: '/customer/new_documentary',
        meta: {
          title: '高端中心-跟单记录',
          icon: 'md-list-box'
        },
        component: () => import('@/view/main/customer/new_documentary.vue')
      },
      {
        path: '/payment',
        name: 'payment',
        meta: {
          title: '交费记录',
          icon: 'logo-usd'
        },
        component: () => import('@/view/main/customer/payment.vue')
      },
			{
			  path: '/refound',
			  name: 'refound',
			  meta: {
			    title: '退款记录',
			    icon: 'logo-usd'
			  },
			  component: () => import('@/view/main/customer/refound.vue')
			},
    ]
  },
	// 人事管理
  {
    path: '/employee',
    name: '/employee',
    meta: {
      icon: 'md-contacts',
      title: '人事管理',
      access:['1','4']
    },
    component: Main,
    children: [
			{
			  path: '/performance',
			  name: 'performance',
			  meta: {
			    title: '绩效考核',
			    icon: 'logo-buffer'
			  },
			  component: () => import('@/view/main/staffmanage/performance.vue')
			},
      {
        path: '/employee',
        name: 'employee',
        meta: {
          title: '员工管理',
          icon: 'md-person'
        },
        component: () => import('@/view/main/staffmanage/employee.vue')
      },
      {
        path: '/cv',
        name: 'cv',
        meta: {
          title: '简历管理',
          icon: 'ios-document'
        },
        component: () => import('@/view/main/staffmanage/cv.vue')
      },
      {
        path: '/training',
        name: 'training',
        meta: {
          title: '培训管理',
          icon: 'md-globe'
        },
        component: () => import('@/view/main/staffmanage/training.vue')
      },
      {
        path: '/allowance',
        name: 'allowance',
        meta: {
          title: '父母补助',
          icon: 'ios-contacts-outline'
        },
        component: () => import('@/view/main/staffmanage/allowance.vue')
      },
    ]
  },
  // 财务管理
	{
	  path: '/finance',
	  name: 'finance',
	  meta: {
	    icon: 'md-card',
	    title: '财务管理',
      access:['1','3']
	  },
	  component: Main,
	  children: [
	    {
	      path: '/gathering',
	      name: 'gathering',
	      meta: {
	        title: '收款记录',
	        icon: 'ios-log-in'
	      },
	      component: () => import('@/view/main/finance/gathering.vue')
	    },
	    {
	      path: '/consume',
	      name: 'consume',
	      meta: {
	        title: '消费记录',
	        icon: 'ios-log-out'
	      },
	      component: () => import('@/view/main/finance/consume.vue')
	    },
	  ]
	},
// 高端中心管理
{
	path: '/high_admin',
	name: 'high_admin',
	meta: {
		icon: 'ios-contact',
		title: '高端中心管理',
    access:['1','6']
	},
    component: Main,
    children: [
      {
        path: '/high_admin/highpoint',
        name: 'highpoint',
        meta: {
          title: '客户列表',
          icon: 'md-list'
        },
        component: () => import('@/view/main/highpoint/highpoint.vue')
      },
      {
        path: '/high_admin/history_documentary',
        name: 'history_documentary',
        meta: {
          title: '顾问跟单记录',
          icon: 'md-list-box'
        },
        component: () => import('@/view/main/highpoint/history_documentary.vue')
      },
      {
        path: '/high_admin/new_documentary',
        name: '/high_admin/new_documentary',
        meta: {
          title: '高端跟单记录',
          icon: 'md-list-box'
        },
        component: () => import('@/view/main/highpoint/new_documentary.vue')
      },
    ]
},
// 管理员
{
  path: '/admin',
  name: 'admin',
  meta: {
    icon: 'ios-contact',
    title: '管理员管理',
    access:['1']
  },
  component: Main,
  children: [
    {
      path: '/role',
      name: 'role',
      meta: {
        title: '角色管理',
        icon: 'ios-glasses',
        access:['no_power']
      },
      component: () => import('@/view/main/admin/role.vue')
    },
    {
      path: '/admin_list',
      name: 'admin_list',
      meta: {
        title: '管理员管理',
        icon: 'md-grid'
      },
      component: () => import('@/view/main/admin/admin.vue')
    },
  ]
},
// 讲师管理
{
	path: '/speaker_control',
	name: 'speaker_control',
	meta: {
		icon: 'ios-contact',
		title: '讲师管理',
    access:['1']
	},
	component: Main,
	children: [
		{
			path: '/speaker',
			name: 'speaker',
			meta: {
				title: '讲师管理',
				icon: 'ios-bookmarks'
			},
			component: () => import('@/view/main/speaker/speaker.vue')
		},

	]
}
]
