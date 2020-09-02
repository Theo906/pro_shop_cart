const port = 5678;
const BASEURL = 'http://localhost:' + port;

const API_LIST = {
	//查询条件
	node_a : BASEURL + '/node_a',
	//查询结果
	node_b : BASEURL + '/node_b',
	//提交信息
	register_post : BASEURL + '/register_post',
	//登陆信息
	loginInfo_post: BASEURL + '/loginInfo_post',
	//批量提交新商品
	addGoods_post : BASEURL + '/addGoods_post',
	//获得商品列表-大类
	get_goodsAllList: BASEURL + '/get_goodsAllList',
	//根据id获取商品信息
	getGoodsInfo: BASEURL + '/getGoodsInfo',
	//查询栏目所属的商品列表
	getCategoryGoodsList: BASEURL + '/getCategoryGoodsList',
	//分页点击
	getPageChange: BASEURL + '/getPageChange',
	//轮播图
	getSliderImages: BASEURL + '/getSliderImages'
}

module.exports = API_LIST