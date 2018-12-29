<template>
 <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item v-for="(i, k) in breadCrumb()" :key="k">{{i}}</el-breadcrumb-item>
</el-breadcrumb>
</template>
<script>
import leftSideItems from "../../assets/js/leftSideItems"
export default {
  data: ()=>({

  }),
  methods: {
    getCurrentPage(arr, cont, path){
      for(let i in arr){
        path = path ? path : arr[i].title
        if(arr[i].index === cont) {
          path = path ? `${path}-${arr[i].title}` : arr[i].title
          return path
        } 

        if(arr[i].subs){
          let temp = this.getCurrentPage(arr[i].subs, cont, path)
          if(temp){
            return temp
          } else {
            path = undefined
          }
        }
      }
    },
    breadCrumb(){
      let arr =  leftSideItems
      console.log(leftSideItems)
      let cont = this.$route.path.replace('/', '')
      let temp = this.getCurrentPage(arr, cont)
      if(temp){
        return temp.split('-')
      } else {
        return []
      }
    }
  }
}
</script>
<style lang="less">

</style>
