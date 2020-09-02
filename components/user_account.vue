<template>
	<div>
		<van-nav-bar
		  :title=msg
		  left-text="返回"
		  right-text="退出登陆"
		  left-arrow
		  @click-left="goBack"
		  @click-right="onClickRight"
		/>
		
		<div class="userImgDiv">
			<h1>欢迎: {{userNameObj.username}}</h1>
			<p>{{userNameObj.description}}</p>
		</div>
		
		<footBar />
	</div>
</template>

<script>
	import axios from 'axios'
	import API_LIST from '@/APIList.config'
	import footBar from './footBar'
	
	export default{
		name:'user_account',
		data(){
			return {
				msg:'用户中心',
				userNameObj:''
			}
		},
		components:{footBar},
		created(){
			this.userNameObj = JSON.parse(localStorage.userName);
		},
		methods:{
			goBack(){
				this.$router.push({path:'/'});
				//保存inxState标识
				localStorage.setItem('inxState',0)
			},
			onClickRight(){
				localStorage.userName = '';
				
				this.$dialog.alert({
					message : "退出登陆成功!"
				}).then( ()=>{
					localStorage.setItem('inxState',0);
					this.$router.push({path:'/'});
				});
			}
		}
	}
</script>

<style scoped>
	.pr{position: relative;}
      .pa{position: absolute;}
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
      h2.title{font-size: 20px;text-align: center;}
      .cle:after{
        content: '.';
        overflow: hidden;
        visibility: hidden;
        height: 0;
        display: block;
        clear: both;
      }
      .wrapDiv{
        width: 90%;overflow: hidden;border: 1px solid #666;
        background: #eee;border-radius: 10px;
        margin:10px auto;
      }
      .userImgDiv{
      		position: relative;border-radius: 10px;margin:10px;
			font-size: 22px;
      }
      .userImgDiv img{
      		position: absolute;top: 0;left: -20px;
      		width: 260px;
      }
      .userInfoDiv{
      		font-size: 14px;float: left;text-align: left;
      }
     .wrapDiv{
        width: 90%;overflow: hidden;border: 1px solid #666;
        background: #eee;border-radius: 10px;
        margin:10px auto;
      }
</style>
