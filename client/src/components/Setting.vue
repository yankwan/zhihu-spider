<template>
  <div class="setting">
    <mu-appbar title="设置"></mu-appbar>
    <div class="app-content">
         <div class="user-info">
             <img class="avatar" :src="userInfo.avatar" />
             <p class="username">{{userInfo.name}}</p>
         </div>
         <div class="logout">
            <mu-flat-button @click="openBottomSheet" label="退出" class="demo-flat-button logout-button"/>
            <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
                <mu-list>
                    <mu-sub-header>
                        请选择一个
                    </mu-sub-header>
                    <mu-list-item title="退出登录" @click="selectedItem(1)" />
                    <mu-list-item title="取消" @click="selectedItem(0)"/>
                </mu-list>
            </mu-bottom-sheet>
         </div>
    </div>
  </div>
</template>

<script>
export default {

  data() {
    return {
      bottomSheet: false,
      userInfo: {}
    };
  },
  created() {
      this._getUserInfo();
  },
  methods: {
    _getUserInfo() {
        this.$api.getUser().then(data => {
            if (data.status === 200 && data.statusText === 'OK') {
                this.userInfo = data.data.user;
            } else {
                console.log(`get user error, status: ${data.status}, statusText: ${data.statusText}`);
            }
        }).catch(err => {
            console.log(err);
        })
    },
    closeBottomSheet() {
      this.bottomSheet = false;
    },
    openBottomSheet() {
      this.bottomSheet = true;
    },
    selectedItem(type) {
        if (type === 1) {
            this.$api.logout().then((res) => {
                console.log(res)
                // 退出跳转到首页
                this.$router.push({
                    path: '/login'
                })
            }).catch(err => {
                console.log(err);
            })
        } else {
            this.bottomSheet = false;
        }
    }
  }
};
</script>

<style lang="scss" scoped>
.setting {
  height: 100px;
  .app-content {
    background-color: lightgray;
    // text-align: center;
    .user-info {
      position: relative;
      display: flex;
      height: 60px;
      background-color: #fff;
      line-height: 60px;
      justify-content: space-between;
      align-items: center;
      .username {
        line-height: 2rem;
        display: inline;
        font-size: 2rem;
        text-align: right;
        margin-right: 2rem;
      }
      .avatar {
          margin-left: 16px;
      }
    }
    .logout {
      height: 40px;
      line-height: 40px;
      margin-top: 18px;
      background-color: #fff;
      font-size: 2rem;

      .logout-button {
          width: 100%;
          height: 100%;
          text-align: center;
      }
    }
  }
}

</style>


