<template>
	<div>
		<van-nav-bar
		  :title=msg
		  left-text="返回"
		  left-arrow
		  @click-left="goBack"
		/>
		
		<div class="goodsImgWrap">
			<img :src=goodsImgUrl />
		</div>
		
		<h1>{{goodsTitle}}</h1>
		<h2>{{describe}}</h2>
		<h3> ¥ {{price}}</h3>
		
		<van-sku
			v-model="showBase"
			:sku="sku"
			:goods="goods"
			:goods-id="goodsId"
			:hide-stock="sku.hide_stock"
			:quota-used=0
			:reset-stepper-on-hide=false
			:reset-selected-sku-on-hide=false
			:close-on-click-overlay=true
			:disable-stepper-input=false
			:message-config={}
			@sku-selected="switchProductType"
			@add-cart="onAddCartFn"
			/>
		
		<!-- footer底部 -->
		<van-goods-action>
		  <van-goods-action-icon icon="chat-o" text="客服" @click='goodsSevice' />
		  <van-goods-action-icon icon="cart-o" :badge=cartGoodsNum text="购物车" @click='goToCart' />
		  <van-goods-action-button type="warning" text="加入购物车"  @click="addToCart"/>
		  <van-goods-action-button
		    type="danger"
		    text="立即购买"
		  />
		</van-goods-action>
		
	</div>
</template>

<script>
	import axios from 'axios'
	import API_LIST from '@/APIList.config'
	import footBar from './footBar'
	
	export default {
		name: 'goodsProduct',
		data(){
			return {
				msg:'产品详情页',
				goodsTitle:'',
				goodsImgUrl:'',
				describe:'',
				price:'',
				//购物车提示小数字
				cartGoodsNum:0,
				
				showBase:false,
				goods: {},
				goodsId:'',
				sku:{
						  tree: [
						    {
						      k: '产品类型', // skuKeyName：规格类目名称
						      v: [
						        {
						          id: '30349', // skuValueId：规格值 id
						          name: '红色', // skuValueName：规格值名称
						          imgUrl: 'https://img.yzcdn.cn/2.jpg' // 规格类目图片，只有第一个规格类目可以定义图片
						        },
						        {
						          id: '1215',
						          name: '蓝色',
						          imgUrl: 'https://img.yzcdn.cn/2.jpg'
						        }
						      ],
						      k_s: 's1' // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
						    }
						  ],
						  // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
						  list: [
						    {
						      id: 2259, // skuId，下单时后端需要
						      price: '', // 价格（单位分）
						      s1: '1215', // 规格类目 k_s 为 s1 的对应规格值 id
						      s2: '1193', // 规格类目 k_s 为 s2 的对应规格值 id
						      s3: '0', // 最多包含3个规格值，为0表示不存在该规格
						      stock_num: 110 // 当前 sku 组合对应的库存
						    }
						  ],
						  price: '', // 默认价格（单位元）
						  stock_num: 227, // 商品总库存
						  hide_stock: false // 是否隐藏剩余库存
						}
				}
		},
		created(){
			// console.log(this.$route.query)
			let _goodsId = this.$route.query._goodsObjId;
			let _collectionName = this.$route.query._collectionName
			// 这是给sku的
			this.goodsId = _goodsId;
			//根据id获取商品信息
			this.getGoodsInfoFn(_goodsId,_collectionName)
			
			var xx = localStorage.cartDataInfo
						? JSON.parse(localStorage.cartDataInfo)
						: [];
			 
			 console.log(xx)
			 // localStorage.removeItem("cartDataInfo")
			 
			 //显示购物车红点小数字
			 this.totalAllGoodsNum()
		},
		methods:{
			//客服
			goodsSevice(){
				this.$dialog.alert({
					message : "客服当前繁忙，请稍后再试!"
				})
			},
			//添加到购物车
			onAddCartFn( _d ){
				// console.log( _d ) 
				
				//cart数据中，是否有相同的id
				let _isTrue = false;
				
				let _tempObj ={
					_id : _d.goodsId,
					_price : this.price,
					_num : _d.selectedNum,
					_goodsName : this.goodsTitle,
					_img : this.goodsImgUrl
				}
				
				console.log(_tempObj)
				
				//已经保存在本地的数据
				let _cartData = localStorage.cartDataInfo
							? JSON.parse(localStorage.cartDataInfo)
							: [];
				
				for(let i=0 ;i<_cartData.length;i++){
					if(_cartData[i]._id === _tempObj._id){
						_cartData[i]._num += _tempObj._num;
						_isTrue = true;
						break
					}
				}
				
				//没有相同 才push
				if(!_isTrue){
					_cartData.push(_tempObj)
				}
				
				//转为字符才能存到本地存储里
				localStorage.cartDataInfo = JSON.stringify(_cartData)
				//提示信息
				this.$dialog.alert({
					message : "加入购物车成功!"
				}).then( ()=>{
					this.showBase = false
					this.totalAllGoodsNum()
				});
			},
			//显示购物车红点小数字
			totalAllGoodsNum(){
				//已经保存在本地的数据
				let _temp = localStorage.cartDataInfo
							? JSON.parse(localStorage.cartDataInfo)
							: [];
				let _n =0;
				for(let i=0 ;i<_temp.length;i++){
					_n += _temp[i]._num
				}
				this.cartGoodsNum = _n
			},
			//根据id获取商品信息
			getGoodsInfoFn(_gId,_collectionName){
				axios.get(API_LIST.getGoodsInfo,{
					params:{
						_id:_gId,
						_c:_collectionName
					}
						}).then(_d=>{
							// console.log(_d.data)
							
							this.goodsTitle = _d.data.name;
							this.goodsImgUrl = _d.data.img;
							this.describe = _d.data.describe;
							this.price = _d.data.price;
							
							//给goods
							this.goods.picture = _d.data.img
							this.sku.price =  _d.data.price
						})
			},
			//加入购物车
			addToCart(){
				this.showBase = true
				
			},
			//跳转到购物车页面
			goToCart(){
				this.$router.push({path:'/cart'})
			},
			//切换产品类型
			switchProductType(){
				this.sku.list[0].price = this.sku.price 
			},
			goBack(){
				this.$router.go(-1)
			}
		}
	}
</script>

<style scoped>
	.goodsImgWrap{
		width: 100%;
		height: 350px;
		overflow: hidden;
		margin: 0 auto;
	}
	.goodsImgWrap img{
		width: 100%;
		height: 350px;
	}
</style>
