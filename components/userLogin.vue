<template>
	<div>
		<van-nav-bar
			  :title= msg
			  left-text="返回"
			  left-arrow
			  @click-left="onClickLeft"
		/>
	   <van-field
			 v-model="username"
			 required
			 clearable
			 label="用户名"
			 placeholder="请输入用户名"
	   />
	   
	   <van-field
	   			 v-model="password"
	   			 required
				 type="password"
	   			 clearable
	   			 label="密码"
	   			 placeholder="请输入密码"
	   />
	   
	   <van-button type="danger" @click='userLoginFn'>登陆</van-button>
	   <van-button type="danger" @click='userRegisterFn'>注册</van-button>
	   
	   <footBar />
	</div>
</template>

<script>
	import axios from 'axios'
	import API_LIST from '@/APIList.config'
	import footBar from './footBar'
		
	export default{
		name:'userLogin',
		data(){
			return{
				msg:'登陆页面',
				
				//用户名
				username:'',
				//密码
				password:'',
			}
		},
		components:{footBar},
		methods:{
			//返回
			onClickLeft(){
				this.$router.go(-1)
			},
			//注册
			userRegisterFn(){
				this.$router.push({path:'/register'})
			},
			//登陆
			userLoginFn(){
				let _userLoginInfo = {
					u:this.username,
					p:this.password
				}
				axios.post(API_LIST.loginInfo_post,_userLoginInfo)
					.then(_d => {
						console.log(_d.data);
						if(!_d.data.regInfo.username){
							this.$dialog.alert({
							      message:'请输入正确用户名和密码！'
							    }).then(()=>{
									this.username = '';
									this.password = ''
								})
						}else{
						this.$dialog.alert({
						      message:'欢迎您！' + _d.data.regInfo.username +'登陆成功'
						    }).then(() => {
								if(_d.data.reg_code === 3){
									//转为json字符串存储
									localStorage.userName = JSON.stringify(_d.data.regInfo)
								}
								//回到首页
								this.$router.push({path:'/'});
								localStorage.setItem('inxState',0)
							});
						}
					})
			}
		}
	}
</script>

