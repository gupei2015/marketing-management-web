<template>
  <div class="layout">
    <el-container>
      <el-header height="70px">
        <div class="logo">优惠券管理系统</div>
        <div class="user-info">
          <el-dropdown
            trigger="click"
            @command="handleCommand"
          >
            <span class="el-dropdown-link">
              <img
                class="user-logo"
                src="/static/img/img.jpg"
              >
              <strong>admin</strong>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="loginout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="250px">
          <el-menu
            :default-active="onRoutes"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
            unique-opened
          >
            <label
              v-for="(item, k) in items"
              :key="k"
            >
              <el-submenu
                :index="item.index"
                v-if="item.subs"
              >
                <template slot="title">
                  <i
                    v-if="item.icon"
                    :class="item.icon"
                  ></i>
                  <span>{{item.title}}</span>
                </template>
                <el-menu-item
                  v-for="(subItem, i) in item.subs"
                  :key="i + 1"
                  :index="subItem.index"
                  router="true"
                >
                  <i :class="subItem.icon"></i>
                  <span slot="title">{{subItem.title}}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                :index="item.index"
                v-else
              >
                <i :class="item.icon"></i>
                <span slot="title">{{item.title}}</span>
              </el-menu-item>
            </label>
          </el-menu>
        </el-aside>
        <el-main>
          <transition
            name="fade"
            mode="out-in"
          >
            <Breadcrumb v-show="onRoutes !== 'home'"></Breadcrumb>
          </transition>
          <transition
            name="fade"
            mode="out-in"
          >
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import leftSideItems from "../../assets/js/leftSideItems";
import Breadcrumb from "../common/breadcrumb";
export default {
  data() {
    return {
      items: leftSideItems
    };
  },
  methods: {
    handleCommand(command) {
      if (command === "loginout") {
        this.$message("登出");
        localStorage.removeItem("loginInfo");
        this.$router.go(-1);
      }
    }
  },
  components: {
    Breadcrumb
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  }
};
</script>

<style lang = "less">
html,
body,
.layout,
#app {
  width: 100%;
  height: 100%;
}
.layout > .el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  display: flex;
  background-color: #242f42;
  color: #fff;
  text-align: center;
  line-height: 70px;
  font-size: 22px;
  .logo {
    flex: 1;
    padding-left: 20px;
    text-align: left;
  }
  .user-info {
    padding-right: 50px;
    font-size: 16px;
    color: #fff;
  }
  .user-info .el-dropdown-link {
    position: relative;
    display: inline-block;
    padding-left: 50px;
    color: #fff;
    cursor: pointer;
    vertical-align: top;
  }
  .user-info .user-logo {
    vertical-align: middle;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .el-dropdown-menu__item {
    text-align: center;
  }
}

.el-aside {
  background-color: #545c64;
  color: #333;
  line-height: 200px;
}

.el-main {
  background-color: #fff;
  color: #333;
  padding: 40px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
