<template>
  <div class="hello">
	  <!-- 搜索框 -->
	  <van-search
	    v-model="searchValue"
	    show-action
	    placeholder="可搜索aaa bbb ccc"
	    @search="onSearch"
	  >
	    <template #action>
	      <div @click="onSearch">搜索</div>
	    </template>
	  </van-search>
	  
   <!-- 轮播图 -->
   <van-swipe :autoplay="1000" class="sliderDiv">
        <van-swipe-item v-for="(image, index) in sliderImages" :key="index">
            <img v-lazy="image" />
        </van-swipe-item>
    </van-swipe>
	
	<!-- 商品列表 -->
	<van-tabs  sticky  v-for="(items,inx) in allGoodsList"
		class="wrapDiv clearfix goodsList" :key=inx>
	  <van-tab  :title=items.n >
			<li v-for="goods in items.goodsList_aa" @click="goodsProductFn(goods)">
				<label><img :src=goods.img /></label>
				{{goods.name}} / ￥{{goods.price}}
			</li>
			
			<li v-for="goods in items.goodsList_bb" @click="goodsProductFn(goods)">
				<label><img :src=goods.img /></label>
				{{goods.name}} / ￥{{goods.price}}
			</li>
			
			<li v-for="goods in items.goodsList_cc" @click="goodsProductFn(goods)">
				<label><img :src=goods.img /></label>
				{{goods.name}} / ￥{{goods.price}}
			</li>
			
			<li v-for="goods in items.goodsList_dd" @click="goodsProductFn(goods)">
				<label><img :src=goods.img /></label>
				{{goods.name}} / ￥{{goods.price}}
			</li>
	  </van-tab>
	</van-tabs>
	<!-- 底部组件 -->
	<footBar />
  </div>
</template>

<script>
	import axios from 'axios'
	import API_LIST from '@/APIList.config'
	import footBar from './footBar'
	
	export default {
	  name: 'proShopCartDemo',
	  data () {
		return {
		  msg: '首页',
		  isNoLogin:true,
		  //轮播图
		  sliderImages:'',
		  //搜索
		  searchValue:'',
		  
		  //所有商品数据，包括栏目和栏目下的商品
		  allGoodsList:''
		}
	  },
	  components:{footBar},
	  mounted(){
		  //轮播图
		  		  axios.get(API_LIST.getSliderImages)
		  				.then(_d => {
		  					this.sliderImages = _d.data.urls
		  				})
	  },
	  created(){
		  if(localStorage.userName){
			   let _m = JSON.parse(localStorage.userName)
			   this.$notify(_m.username+",您已登陆，欢迎回来！");
			   this.isNoLogin = false ;
			   this.msg = '首页:'+ _m.username;
		  }
		  
		  //查询所有栏目，和栏目所属商品
		  this.getGoodsCateGoryFn()
	  },
	  methods:{
		  //onSearch
		  onSearch(){
			  //console.log(this.searchValue)
			  let _val = this.searchValue;
			  if(!_val){
				 this.$notify("搜索不能为空！");
			  }else{
				  axios.get(API_LIST.node_a,{
				  				  params:{v_data:_val}
					}).then(()=>{
						this.getBtn();
					})
				}
			  
		  },
		  //商品详情页
		  goodsProductFn(_self){
			  //console.log(_self._id)
			  
			  this.$router.push({
				  name:'goodsProduct',
				  query:{
					  _goodsObjId:_self._id,
					  _collectionName:_self.category
					  }
			  })
		  },
		  //查询所有栏目，和栏目所属商品
		  getGoodsCateGoryFn(){
			  axios.get(API_LIST.get_goodsAllList)
				.then(_d=>{
					//console.table(_d.data)
					
					this.allGoodsList = _d.data;
				})
		  },
		  //退出登陆
		  loginOutBtn(){
			  localStorage.userName = '';
			  this.isNoLogin = true;
			  this.$notify("您已退出登陆！");
		  },
		  //登陆
		  loginBtn(){
			  this.$router.push({path:'/userLogin'})
		  },
		  //注册
		  registerBtn(){
			  this.$router.push({path:'/register'})
		  },
		  //获取
		  getBtn(){
			  axios.get(API_LIST.node_b)
				.then( _d => {
					//console.log(_d.data)
					//this.txt_data = _d.data[0].name
					this.$notify(_d.data[0].name);
				})
		  }
	  }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
		margin: 10px auto;
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
	
	.goodsList{}
	.goodsList li{
	    float: left;width: 49%;
	    overflow: hidden;margin:0 0 10px 0;
	  }
	.goodsList li label{
	      width: 100px;height: 115px;display: block;overflow: hidden;
	      margin:0 auto;padding:0;text-align: center;position: relative;
	      border:1px solid #666;
	}
	.goodsList li img{
	  height: 100%;
	  position: absolute;top: -5px;left: 0;
	  clear: both;display: block;margin:5px auto;padding:0;
	}
	.goodsList h1.goodsTitle{
	     clear: both;margin:5px auto;font-size: 22px;border-radius: 5px;
	     background: #5d5d5d;width: 50%;color: #fff;padding:3px 0;
	}
</style>
