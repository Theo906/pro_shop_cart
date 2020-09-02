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
			 :error-message= userErr
	   />
	   
	   <van-field
	   			 v-model="password"
	   			 required
				 type="password"
	   			 clearable
	   			 label="密码"
	   			 placeholder="请输入密码"
	   			 :error-message= passErr
	   />
	   
	   <van-field
	   			 v-model="password2"
	   			 required
	   				 type="password"
	   			 clearable
	   			 label="确认密码"
	   			 placeholder="请再次输入密码"
	   			 :error-message= passErr2
	   />
	   
	   <van-field
	   			 v-model="description"
	   			 label="个人签名"
	   			 placeholder="请输入个人签名"
	   />
	   
	   <van-button type="danger" @click='registerFn'>立即注册</van-button>
	   <van-button type="danger" @click='registerResetBtn'>重置</van-button>
	   
	   <footBar />
	</div>
</template>

<script>
	import axios from 'axios'
	import API_LIST from '@/APIList.config'
	import footBar from './footBar'
		
	export default{
		name:'register',
		data(){
			return{
				msg:'注册页面',
				
				//用户名
				username:'',
				//密码
				password:'',
				password2:'',
				//个人签名
				description:'',
				
				userErr:"",
				passErr:'',
				passErr2:'',
			}
		},
		components:{footBar},
		methods:{
			//返回
			onClickLeft(){
				this.$router.go(-1)
			},
			//注册
			registerFn(){
				//重置提示信息
				this.userErr = '';
				this.passErr = '';
				this.passErr2 = '';
				
				//用户信息
				let _registerObj = {
					username:this.username,
					password:this.password,
					password2:this.password2,
					description:this.description
				}
				
				//判断
				if(_registerObj.username === ''){
					this.userErr = '用户名不能为空';
					return false
				}
				
				if(_registerObj.password === ''){
					this.passErr = '密码不能为空';
					return false
				}
				
				if(_registerObj.password2 === ''){
					this.passErr2 = '重复密码不能为空';
					return false
				}
				
				if(_registerObj.password2 !== _registerObj.password){
					this.passErr2 = '重复密码错误';
					return false
				}
				console.log(_registerObj);
				
				this.postRegisterObj(_registerObj);
			},
			//提交
			postRegisterObj(_registerObj){
				axios.post(API_LIST.register_post,_registerObj)
					.then(_d => {
							console.log(_d.data)
							 this.$dialog.alert({
							      message: _d.data.regInfo
							    }).then(() => {
									this.$router.push({path:'/'})	
							});
						}
					)
			},
			//重置
			registerResetBtn(){
				
			}
		}
	}
</script>

