<template>
	<div>
		<!-- 商品录入框 -->
		<van-button v-if="isNoLogin" type="danger" @click='entryGoods'>录入商品</van-button>
		
		<!-- 横向栏 -->
		<div class="wrapDiv clearfix">
			<van-tabs @change='headerSwitchFn' v-model="goods_active" animated >
			  <van-tab 	v-for="(items,inx) in getGoodsAllList" :key=inx
					:title = items.n>
					<h1>{{items.d}}</h1>
			  </van-tab>
			</van-tabs>
		</div>
		
		<!-- 商品录入框 -->
		<div v-if="isEnter" class="goodsEntry clearfix">
			
			<div v-for="item in emptyGoodsDomArr">
				<entryGoods
					@pushGoodsInfo="pushGoodsInfoFn"
					@isVoidFalse = "isVoidFalseFn"
					/>
			</div>
			
			<van-button type="danger" @click='addGoodsInputBtn' > + </van-button>
			<van-button type="danger" @click='submitBtn'>提交商品</van-button>
			<van-button type="danger" @click='cancleBtn'>取消</van-button>
		</div>
		
		<div class="entryGoodsDivBg" v-if="isEntryGoodsDivBg">
			
		</div>
		
		<!-- 竖向分类栏 -->
		<div class="sideBarFn">
			<van-sidebar  v-model="activeKey" @change='clickTriggered'>
			  <van-sidebar-item v-for="(items,inx) in getGoodsAllList" :key=inx
					:title=items.n />
			</van-sidebar>
		</div>
		
		<!-- 显示竖向栏目的数据 -->
		<div class="columnData clearfix"> 
			<ul v-for="item in goodsListData" @click="goToGoodsProduct(item)">
				<li><img :src=item.img /></li>
				<li>{{item.name}}</li>
				<li>¥ {{item.price}}</li>
				<li>{{item.describe}}</li>
			</ul>
		</div>
		
		<!-- 分页点击 -->
		<div class="pageChange">
			<van-pagination
				v-model="currentPage"
				:total-items=totalItems
				items-per-page = 2
				mode="simple" 
				@change='pageChangeFn'
					/>
		</div>
		
		<footBar></footBar>
	</div>
</template>

<script>
	import axios from 'axios'
	import API_LIST from '@/APIList.config'
	import footBar from './footBar'
	import entryGoods from './entryGoods'
	
	export default{
		name:'goodsType',
		data(){
			return {
				msg:'商品分类页',
				//竖向分类栏索引
				activeKey:0,
				
				//分页点击,当前第几页
				currentPage:0,
				totalItems:0,
				
				isEnter:false,
				//横向分类栏索引
				goods_active:0,
				//四框填完了
				isGoodsWrite:false,
				//商品重复
				isNameRepeat:false,
				isNoLogin:false,
				
				//添加商品信息数组
				entryGoodsObj:[],
				
				//竖向栏目
				goodsListData:[],
				
				//空白的录入框
				emptyGoodsDomArr:[{}],
				isEntryGoodsDivBg:false,
				//获得商品列表-大类
				getGoodsAllList:''
			}
		},
		components:{entryGoods,footBar},
		mounted(){
			this.pageChangeFn()
		},
		created(){
			// 获得商品列表-大类,更新页面数据
			this.getGoodsAllListFn();
			//查询栏目所属的商品列表
			this.getCategoryGoodsListFn('goodsList_a');
			
			//判断 如果没有数据 下面都不执行
			if(!localStorage.userName){
				return
			}
			
			if(localStorage.userName){
				this.$notify(JSON.parse(localStorage.userName).username+",您已登陆，欢迎回来！");
			}
			 // console.log(JSON.parse(localStorage.userName)._id);
			 let _d = JSON.parse(localStorage.userName)._id;
			 //判断是否是特殊用户
			if(localStorage.userName && _d === '5f2a5572998451464815f8e7'){
				this.isNoLogin = true ;
			}
			
		},
		//监听activeKey索引,触发事件
		watch:{
			//有两个值,默认新值
			activeKey(index){
				let _inx = this.getGoodsAllList[index].d
				this.getCategoryGoodsListFn(_inx)
				
				
				//分页重置当前显示页数
				this.currentPage = 1
				//分页数据显示
				this.pageChangeFn();
			}
		},
		methods:{
			//点击跳转商品详情页
			goToGoodsProduct(item){
				// console.log(item)
				this.$router.push({
					  name:'goodsProduct',
					  query:{
							  _goodsObjId:item._id,
							  _collectionName:item.category
							  }
				})
			},
			//分页点击
			pageChangeFn(){
				// console.log(this.currentPage)
				// console.log(this.getGoodsAllList)
				let _c = '';
				if(!this.getGoodsAllList){
					_c = 'goodsList_a'
				}else{
				//当前分页点击时所属的集合名
				    _c = this.getGoodsAllList[this.activeKey].d
				}
				
				axios.get(API_LIST.getPageChange,{
					params:{
						startNum:(this.currentPage-1)*2,
						c : _c
					}
				}).then(_d => {
					// console.log(_d.data)
					this.goodsListData = _d.data;
				})
			},
			//横向分类栏,点击触发
			headerSwitchFn(_inx){
				//console.log(_inx)
				//改变竖向分类栏索引
				this.activeKey = _inx
			},
			//竖向分类栏,点击触发
			clickTriggered(index){
				//console.log(index)
				this.activeKey = index;
				//改变横向分类栏索引
				this.goods_active = index;
				
				//每次点击所属的商品分类
				//console.log(this.getGoodsAllList[index].d)
				let _inx = this.getGoodsAllList[index].d
				this.getCategoryGoodsListFn(_inx)
			},
			//查询栏目所属的商品列表
			getCategoryGoodsListFn(_c){
				axios.get(API_LIST.getCategoryGoodsList,{
						params:{categoryId:_c}
					})
				.then(_d=>{
						//console.log(_d.data)
						//分类下所有商品的总数，用在分页上
						this.totalItems = _d.data.length;
						// this.goodsListData = _d.data;
					})
				
			},
			//添加商品信息到，总商品信息数组对象
			pushGoodsInfoFn(_itemGoods){
						  let _is = true;
						  //判断是否重名
						  for(let i=0 ; i<this.entryGoodsObj.length;i++){
							  if(this.entryGoodsObj[i].n === _itemGoods.n){
								  _is = false;
								  break;
							  }
						  }
						  if(_is){
							this.entryGoodsObj.push(_itemGoods);
							this.isNameRepeat = true;
						  }else{
							  this.isNameRepeat = false;
							  this.$dialog.alert({
							       message: "商品名称重复"
							     })
						  }
						  
						  this.isGoodsWrite = true;
			},
			//四个框没写完触发
			isVoidFalseFn(){
						  this.isGoodsWrite = false;
			},
			//四个框全写完才能添加商品框
			addGoodsInputBtn(){
						  if(this.isGoodsWrite && this.isNameRepeat){
							this.emptyGoodsDomArr.push({})
						  }else{
							  this.$dialog.alert({
							       message: "有框没写完了,或商品名重复"
							     })
						  }
			},
			//录入商品
			entryGoods(){
				//显示录入框
				this.isEnter = true;
				//显示
				this.isEntryGoodsDivBg = true;
			},
			//提交新的商品
			submitBtn(){
						console.log(this.entryGoodsObj)  
						
						axios.post(API_LIST.addGoods_post,this.entryGoodsObj)
							.then(_d => {
								console.log(_d.data)
								
								this.$dialog.alert({
								      message: _d.data.regInfo
								    }).then(() => {
										//商品录入框隐藏
										this.isEnter = false;
										this.isEntryGoodsDivBg = false;
										//空白录入框重置
										this.emptyGoodsDomArr = [{}];
										//获得商品列表-大类
										this.getGoodsAllListFn();
										//提交信息重置
										this.entryGoodsObj = [];
								});
							});
			},
			//取消提交商品
			cancleBtn(){
				this.isEntryGoodsDivBg = false;
				this.isEnter = false;
			},
			//获得商品列表-大类
			getGoodsAllListFn(){
						axios.get(API_LIST.get_goodsAllList) 
							.then(_d => {
								 // console.log(_d.data);
								
								this.getGoodsAllList = _d.data;
								// console.log(this.getGoodsAllList);
							})
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
	 .clearfix:after,
	 .clearfix:before{
		 content:"";
		 display:table;
		 clear:both;
	 }
	.wrapDiv{
		width: 80%;
		background-color: #eee;
		overflow: hidden;
		border: 1px solid #666;
		border-radius: 10px;
		margin: 10px auto;
	}
	.leftDiv{
		float: left;
		width: 40%;
		margin: 10px;
		border-radius: 10px;
		height: 30px;
		line-height: 30px;
		border: 1px solid #999;
		padding: 10px;
		text-align: center;
		font-size: 22px;
	}
	.rightDiv{
		float: right;
		width: 40%;
		margin: 10px;
		border-radius: 10px;
		height: 30px;
		line-height: 30px;
		border: 1px solid #999;
		background: #fff;
		padding: 10px;
		text-align: center;
		font-size: 22px;
	}
	.sliderDiv{
		width: 80%;
		margin: 10px auto;
	}
	.sliderDiv img{
		width: 100%;
		height: 186px;
	}
	.goodsEntry{
		width: 80%;
		position: absolute;
		top: 10%;
		left: 50%;
		margin-left: -42%;
		z-index: 112;
		background-color: #ddd;
		padding: 10px;
		border-radius: 30px;
		text-align: center;
		border: 1px solid #999;
		line-height: 30px;
		font-size: 16px;
	}
	.goodsCategory{
		clear: both;
		margin: 10px 0;
	}
	.goodsCategory li{
		float: left;
	}
	.goodsCategory li img{
		width: 50px;
		height: 50px;
		border-radius: 10px;
		border: 1px solid #666;
	}
	.entryGoodsDivBg{
		width: 100%;
		height: 100%;
		background-color: #000;
		opacity: 0.3;
		z-index: 111;
		position: absolute;
		top: 0;
		left: 0;
	}
	.imgSize{
		width: 100%;
		height: 100%;
	}
	.sideBarFn{
	    		width: 80px;position: absolute;top: 330px;left: 0;z-index: 10;
	    }
  .columnData{
  		clear: both;width: 70%;background: #eee;
  		border-radius: 10px;border: 1px solid #666;
  		margin:0 0 0 90px;
  }
  .columnData ul{
  	display: block;clear: both;overflow: hidden;margin:10px 0;
  	background: #ddd;
  }
  .columnData ul li{
  		float: left;margin:5px;
  }
  .columnData ul li.tip{background: #eee;padding:2px;}
  .columnData ul li img{
  		width:50px;height: 50px;
  }
 .pageChange{
	 width:85%;
	 float: right;
	 clear: both;
 }
</style>
