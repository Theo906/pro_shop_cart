// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import {
		Button, NavBar,Field,Dialog,Notify, Tab, Tabs ,Tabbar,Swipe,SwipeItem,
		TabbarItem,Sidebar, SidebarItem,Stepper,SubmitBar,Toast,Search,Lazyload,
		GoodsAction, GoodsActionIcon, GoodsActionButton,Sku,Pagination    
	} from 'vant'

Vue.use(Button).use(NavBar).use(Field).use(Sidebar).use(SidebarItem).use(Swipe).use(SwipeItem)
	.use(Dialog).use(Notify).use(Tab).use(Tabs).use(Pagination).use(Search).use(Lazyload)
	.use(Tabbar).use(TabbarItem).use(GoodsAction).use(GoodsActionButton)
	.use(GoodsActionIcon).use(Sku).use(Stepper).use(SubmitBar).use(Toast)
	
Vue.use(Lazyload, {
  lazyComponent: true,
});

Vue.config.productionTip = false;



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
