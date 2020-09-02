<template>
	<div>
		<van-tabbar v-model="tabbarActive" @change='tabbarChangeBtn'>
		  <van-tabbar-item icon="home-o">首页</van-tabbar-item>
		  <van-tabbar-item icon="search" >分类</van-tabbar-item>
		  <van-tabbar-item icon="friends-o" >购物车</van-tabbar-item>
		  <van-tabbar-item icon="setting-o" >{{isLoginTxt}}</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
	import axios from 'axios'
	import API_LIST from '@/APIList.config'
	
	export default{
		name:'footBar',
		data(){
			return {
				msg:'footBar底部栏',
				//footer标签组
				tabbarActive:0,
				
				isLoginTxt:''
			}
		},
		created(){
			//判断用户是否登陆
			if(localStorage.userName){
				this.isLoginTxt = '我的'
			}else{
				this.isLoginTxt = '未登录'
			}
		},
		mounted(){
			this.tabbarActive = Number(localStorage.getItem('inxState'));
		},
		methods:{
			tabbarChangeBtn(){
				// console.log(this.tabbarActive)
				let _inx = this.tabbarActive;
				
				switch (_inx){
					case 0:
						this.$router.push({path:'/'});
						//保存inxState标识
						localStorage.setItem('inxState',0)
						break;
					case 1:
						this.$router.push({path:'/goodsType'});
						//保存inxState标识
						localStorage.setItem('inxState',1)
						break;
					case 2:
						this.$router.push({path:'/cart'});
						//保存inxState标识
						localStorage.setItem('inxState',2)
						break;
					case 3:
						this.isUserLoginFn()
						break;	
				}
			},
			//判断用户登陆状态
			isUserLoginFn(){
				let _route = '';
				if(localStorage.userName){
					_route = '/user_account'
				}else{
					_route = '/userLogin'
				}
				
				this.$router.push({path:_route});
				//保存inxState标识
				localStorage.setItem('inxState',3)
			}
		}
	}
</script>

<style scoped>
	h1, h2 {
	  font-weight: normal;
	}
	ul {
	  list-style-type: none;
	  padding: 0;
	}
	li {
	  display: inline-block;
	  margin: 0 10px;
	}
	a {
	  color: #42b983;
	}
</style>
