<template>
	<div>
		<van-nav-bar
		  :title=msg
		  left-text="返回"
		  left-arrow
		  right-text="清空购物车"
		  @click-right="goodsEmptyFn"
		  @click-left="goBack"
		/>
		
		<!-- :async-change=true必须是异步 -->
		<div class="goodsDiv" v-for="item in shopCartList">
			<label> <img :src=item._img /> </label>
			<h2>{{item._goodsName}} , 数量 : {{item._num}} , 单价 : {{item._price}}</h2>
			<van-stepper v-model="item['_num']" 
				:async-change=true
				@plus = 'addBtnFn'
				@minus = 'minusBtnFn'
				/>
		</div>
		
		<h1 v-if="showGoods">当前购物车为空，快去购物吧！</h1>
		
		<van-submit-bar :price=allGoodsMoney*100 :button-text=buttonText @submit="onSubmit" />
	</div>
</template>

<script>
	import axios from 'axios'
	import API_LIST from '@/APIList.config'
	import { Toast } from 'vant';
	import {mapGetters, mapActions} from 'vuex'
	
	export default {
		name:'cart',
		data(){
			return {
				msg:"购物车",
				cartArr:'',
				//计算商品总数
				countAllGoodsNum:0,
				//计算商品总价格
				allGoodsMoney:0,
				//提交信息
				buttonText:'',
				//提交价格
				_price:0,
				
				//购物车为空，显示的信息
				showGoods:false
			}
		},
		computed:{
			...mapGetters(['shopCartList'])
		},
		created(){
			this.cartArr = localStorage.cartDataInfo
						? JSON.parse(localStorage.cartDataInfo)
						: [];
			 
			 console.log(this.cartArr)
			 
			 //计算总数
			 this.countAllGoodsNumFn();
			 //计算总价
			 this.countAllGoodsPrice();
			 
			 //购物车为空，显示的信息
			 if(this.cartArr.length === 0){
				 this.showGoods = true;
			 }
			 
			 // vuex，this.cartArr就是购物车中的商品
			 this.addToVuex( this.cartArr )
		},
		methods:{
			// 映射 事件
			...mapActions(['addToVuex']),
			//清空购物车
			goodsEmptyFn(){
				this.cartArr = localStorage.removeItem("cartDataInfo");
				this.buttonText = '去结账(0)';
				this.allGoodsMoney = 0;
				this.showGoods = true
			},
			//计算总价
			countAllGoodsPrice(){
				this.allGoodsMoney = 0 ;
				for(let i=0; i<this.cartArr.length;i++){
					this.allGoodsMoney += this.cartArr[i]._num *this.cartArr[i]._price
				}
			},
			//计算总数
			countAllGoodsNumFn(){
				this.countAllGoodsNum = 0;
				for(let i=0; i<this.cartArr.length;i++){
					this.countAllGoodsNum += this.cartArr[i]._num
				}
				this.buttonText = '去结账(' + this.countAllGoodsNum +")"
			},
			goBack(){
				this.$router.push({path:'/'});
				//保存inxState标识
				localStorage.setItem('inxState',0)
			},
			//点击加号
			addBtnFn(){
				this.countAllGoodsNumFn();
				this.countAllGoodsPrice();
				
			},
			//点击减号
			minusBtnFn(){
				this.countAllGoodsNumFn();
				this.countAllGoodsPrice();
			},
			//去结账
			onSubmit(){
				//判断是否是登陆状态
				if(!localStorage.userName){
					Toast.success('请先登陆！');
					this.$router.push({path:'/userLogin'})
				}else{
					this.$dialog.alert({
						message : "商品总数:"+this.countAllGoodsNum+",商品总价:"+this.allGoodsMoney+"元"
					}).then(()=>{
						Toast.success('支付成功！');
						this.goodsEmptyFn();
						this.$router.push({path:'/'})
						localStorage.setItem('inxState',0)
					})
				}
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
	.goodsDiv{
		width: 95%;margin:5px auto;clear: both;
	}
	.goodsDiv label{
		float: left;width: 100px;height: 100px;
		overflow: hidden;border:1px solid #ddd;border-radius: 10px;
	}
	.goodsDiv label img{
		width: 100px;height: 100px;
	}
	.goodsDiv h2{font-size: 22px;}
</style>

