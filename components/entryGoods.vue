<template>
	<div class="wrapDiv">
		<input type="text" v-model=name  
			class="goodsEntry"  @blur="nameBlurFn"
			placeholder="输入名称"
		 />
		 
		<input type="text" v-model=price  
			class="goodsEntry" @blur="priceBlurFn"
			placeholder="输入价格"
		 />
		 
		<input type="text" v-model=describe 
			class="goodsEntry" @blur="describeBlurFn"
			placeholder="输入描述"
		  />
		  
		<input type="text"  v-model=img 
			class="goodsEntry" @blur="imgBlurFn"
			placeholder="输入图片"
		 />
		 
	</div>
</template>

<script>
	export default{
		name:'entryGoods',
		data(){
			return{
				name:'',
				price:'',
				describe:'',
				img:'',
				
				itemGoods:{
					n:'',
					p:'',
					d:'',
					i:''
				}
			}
		},
		methods:{
			nameBlurFn(){
				this.itemGoods.n = this.name;
				this.isInputCheckFn()
			},
			priceBlurFn(){
				this.itemGoods.p = this.price;
				this.isInputCheckFn()
			},
			describeBlurFn(){
				this.itemGoods.d = this.describe;
				this.isInputCheckFn()
			},
			imgBlurFn(){
				this.itemGoods.i = this.img;
				this.isInputCheckFn()
			},
			//检查输入商品信息是否完整
			isInputCheckFn(){
				let _is = true;
				for(let i in this.itemGoods){
					if(!this.itemGoods[i]){
						_is = false;
						break;
					}
				}
				
				if(_is){
					// console.log('已写完')
					this.$emit("pushGoodsInfo",this.itemGoods)
				}else{
					// console.log('没写完')
					this.$emit("isVoidFalse")
				}
			}
		}
	}
</script>

<style>
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
	.wrapDiv p.tip{
		font-size: 22px;
		text-align: center;
		margin: 5px 0;
		color: #666;
	}
	.goodsEntry{
		float: left;
		width: 30%;
		margin: 10px;
		border-radius: 10px;
		text-align: center;
		border: 1px solid #999;
		line-height: 30px;
		font-size: 16px;
	}
</style>
