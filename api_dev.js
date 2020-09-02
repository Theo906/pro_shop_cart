var express = require('express');
var app = express();

// 获得它的客户端对象：MongoClient，用来连接mongoDB
var MongoClient = require('mongodb').MongoClient;

// 获得连接mongoDB的字符串
var DB_CONN_STR = 'mongodb://127.0.0.1:27017';

//解决跨域问题，百度找的
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200); /让options请求快速返回/
  }
  else {
    next();
  }
});

//用来临时保存的数据
var _xxObj = {
	arrs:[{
		id:'n1',
		name:'a_name',
		vals:'aaa'
	},{
		id:'n2',
		name:'b_name',
		vals:'bbb'
	},{
		id:'n3',
		name:'c_name',
		vals:'ccc'
	}]
};

//用来保存过滤后的数据
var _filterResult = null;

//过滤方法
function filter (_val){
	return _xxObj.arrs.filter(_d =>{
		return _d.vals === _val;
	})
}

//第一个nodejs接口,接收
app.get('/node_a',function(req,res){
	console.log(req.query.v_data);
	
	let _result = filter(req.query.v_data);
	
	 _filterResult = _result.length !== 0 ? _result : [{id:'xxx',name:'没有结果'}]
	
	res.end();
});

//第二个接口，发送
app.get('/node_b',function(req,res){
	res.send(_filterResult);
});

//用户注册信息
app.post('/register_post',function(req,res){
	let _allData = ''
	req.on('data',function(_d){
		_allData  += _d
	})
	
	req.on('end',function(){
		//_allData接收数据  类型是字符串
		console.log(_allData)
		//转换成json对象
		let _registerMsg = JSON.parse(_allData);
		
		//注册前查询是否有同名信息
		findSameNameFn(_registerMsg,res);
		
	})
})

//查找注册是否同名
function findSameNameFn(_registerMsg,res){
	MongoClient.connect(DB_CONN_STR,function(err,db){
		// 数据库名:proShopCart
		var _dbo = db.db('proShopCart');
		// 集合名：userInfo
		var _collection = _dbo.collection('userInfo');
		
		_collection.findOne({"username":_registerMsg.username},{},function(err,result){
			if(err) throw err;
			if(result === null){
				console.log('没有同名')
				insertUserName(_registerMsg,res);
			}else if(result.username === _registerMsg.username){
				console.log('用户名已存在')
				res.send({
					regInfo:'用户名已存在',
					reg_code:2
				})
			}
			
			db.close();
		})
	});
}

//插入新注册信息
function insertUserName(_registerMsg,res){
	MongoClient.connect(DB_CONN_STR,function(err,db){
		// 数据库名:proShopCart
		var _dbo = db.db('proShopCart');
		// 集合名：userInfo
		var _collection = _dbo.collection('userInfo');
		
		_collection.insertOne(_registerMsg,function(err,result){
			if(err) throw err;
			
			res.send({
				regInfo:'用户注册成功',
				reg_code:1
			})
			
			db.close();
		})
	});
}

//登陆信息
app.post('/loginInfo_post',function(req,res){
	let _loginData = ''
	req.on('data',function(_d){
		_loginData += _d
	});
	
	req.on('end',function(){
		// console.log(JSON.parse(_loginData))
		let _temp = JSON.parse(_loginData);
		MongoClient.connect(DB_CONN_STR,function(err,db){
			// 数据库名:proShopCart
			var _dbo = db.db('proShopCart');
			// 集合名：userInfo
			var _collection = _dbo.collection('userInfo');
			
			_collection.findOne({"username":_temp.u},{},function(err,result){
				if(err) throw err;
				
				if(result === null){
					console.log('用户不存在')
					return res.send({
						regInfo:'用户不存在',
						reg_code:5
					})
				}else if(result.password !== _temp.p){
					console.log('密码错误')
					return res.send({
						regInfo:'密码错误',
						reg_code:4
					})
				}else if(result !== null && result.password == _temp.p){
					console.log('登陆成功！') 
					return res.send({
						regInfo:result,
						reg_code:3
					})
				}
				
				db.close();
			})
		});
	})
});

//批量提交新商品
app.post('/addGoods_post',function(req,res){
	let _addGoodObj = ''
	req.on('data',function(_d){
		_addGoodObj += _d
	});
	req.on('end',function(_d){
		let _insertGoods = JSON.parse(_addGoodObj);
		// console.log(_insertGoods)
		
		MongoClient.connect(DB_CONN_STR,function(err,db){
			// 数据库名:proShopCart
			var _dbo = db.db('proShopCart');
			// 商品列表集合名：goodsAllInfoList
			var _collection = _dbo.collection('goodsAllInfoList');
			
			_collection.insertMany(_insertGoods,function(err,result){
				if(err) throw err;
				
				res.send({
					regInfo:'商品录入成功！',
					reg_code:6
				})
				
				db.close();
			})
		});
	});
});

//获得商品列表-大类
app.get('/get_goodsAllList',function(req,res){
	MongoClient.connect(DB_CONN_STR,function(err,db){
		// 数据库名:proShopCart
		var _dbo = db.db('proShopCart');
		// 商品列表集合名：goodsAllInfoList
		var _collection = _dbo.collection('goodsAllInfoList');
		
		_collection.aggregate([{
			$lookup:{
				localField:'d',
				from:'goodsList_a',
				foreignField:'category',
				as:'goodsList_aa'
			}
		},{
			$lookup:{
				localField:'d',
				from:'goodsList_b',
				foreignField:'category',
				as:'goodsList_bb'
			}
		},{
			$lookup:{
				localField:'d',
				from:'goodsList_c',
				foreignField:'category',
				as:'goodsList_cc'
			}
		},{
			$lookup:{
				localField:'d',
				from:'goodsList_d',
				foreignField:'category',
				as:'goodsList_dd'
			}
		}]).toArray(function(err,result){
			if(err) throw err;
			
			res.send(result);
			
			db.close();
		})
	});
});

//批量插入到mongodb中，只运行一次
function insertTempGoodsList(){
	let TempGoodsListObj = [{
							name:'GUCCI',price:22,category:'goodsList_d',img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548499978550&di=1f1fd228cf709228fca93dcafabbf02e&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201510%2F24%2F20151024113616_BvLPT.jpeg'
						},{
							name:'MK',price:33,category:'goodsList_d',img:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=648227110,1457501216&fm=26&gp=0.jpg'
						},{
							name:'巴宝莉',price:44,category:'goodsList_d',img:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=6777935,920341325&fm=26&gp=0.jpg'
						},{
							name:'香奈儿',price:55,category:'goodsList_d',img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3066786800,2442961315&fm=26&gp=0.jpg'
						}];
	
	MongoClient.connect(DB_CONN_STR,function(err,db){
		// 数据库名:proShopCart
		var _dbo = db.db('proShopCart');
		// 商品列表集合名：goodsList_d
		var _collection = _dbo.collection('goodsList_d');
		
		_collection.insertMany(TempGoodsListObj,function(err,result){
			if(err) throw err;
			
			db.close();
		})
	});
}

// insertTempGoodsList()

//根据id获取商品信息
app.get('/getGoodsInfo',function(req,res){
	var _findId = req.query._id;
	var _c = req.query._c;
	
	//引入mongodb对象
	var _ObjectID = require('mongodb').ObjectID;
	var _findObjId = _ObjectID.createFromHexString(_findId);
	
	MongoClient.connect(DB_CONN_STR,function(err,db){
		// 数据库名:proShopCart
		var _dbo = db.db('proShopCart');
		// 商品列表集合名：goodsAllInfoList
		var _collection = _dbo.collection(_c);
		
		_collection.findOne({"_id":_findObjId},{},function(err,result){
			if(err) throw err;
			
			res.send(result);
			
			db.close();
		})
	});
});

app.get('/getCategoryGoodsList',function(req,res){
	let _c = req.query.categoryId;
	MongoClient.connect(DB_CONN_STR,function(err,db){
		// 数据库名:proShopCart
		var _dbo = db.db('proShopCart');
		// 商品列表集合名：goodsAllInfoList
		var _collection = _dbo.collection(_c);
		
		_collection.find().toArray(function(err,result){
			if(err) throw err;
			
			res.send(result);
			
			db.close();
		})
	});
});

//分页点击
app.get('/getPageChange',function(req,res){
	//跳过的商品数
	let _s = req.query.startNum;
	let _c = req.query.c;
	MongoClient.connect(DB_CONN_STR,function(err,db){
		// 数据库名:proShopCart
		var _dbo = db.db('proShopCart');
		// 商品列表集合名：goodsAllInfoList
		var _collection = _dbo.collection(_c);
		//.limit(2) 限制2条 skip跳过的商品数
		_collection.find().limit(2).skip(Number(_s))
			.toArray(function(err,result){
				if(err) throw err;
				
				res.send(result);
				db.close();
		})
	});
});

//轮播图
app.get('/getSliderImages',function(req,res){
	let _SliderImages = {
		urls: [
			'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2164724814,1401845036&fm=26&gp=0.jpg',
			'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1621217503,2871888446&fm=26&gp=0.jpg',
			'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3149938290,1499572739&fm=26&gp=0.jpg',
			'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2478350582,3338695212&fm=26&gp=0.jpg'
		]
	}
	
	return res.send(_SliderImages);
});

app.listen(5678,function(){
	console.log('5678,中间件已经启动')
});