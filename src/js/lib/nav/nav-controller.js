export default (() => {
    return ['$scope', '$location', '$state', 'Ajax', '$rootScope', ($scope, $location, $state, Ajax, $rootScope) => {
        const navAjaxUrl = {
            menuList: '/midas/kepler/ajax/menuList'
        };
        let menus = false;
        const urlChange = (menuList)=> {
            let isUrl = true;
            let menusI = -1;
            angular.forEach(menuList, (item, i)=> {
                let a = document.createElement('a');
                a.href = item.url;
                let hrefHash = a.hash.split('#').slice(1).join('');
                // 获取hash值 确保 只留下第一个 / 后面的第一个值 用在页面的选中上
                let hash = hrefHash.split('?')[0].split('/').slice(1)[0];
                // 因为这个hash值是没有 /的 所以加上 切换页面用到
                item.hash = '/' + hash;
                let search = hrefHash.split('?')[1].split('&');
                let searchObj = {};

                search.forEach((it)=>{
                    let split = it.split('=');
                    searchObj[split[0]] = split[1]
                });
                // 确定当前在哪个页面上 并且选中

                item.isOpen = false;
                item.menuActive = hash === $location.$$path.split('/')[1];
                if(item.menuActive && item.menus.length > 0){
                    menus = true;
                    menusI = i;
                    item.isOpen = true;
                }
                // 确定当前的icon 是什么 一级菜单
                item.indexIcon = 'icon-' + searchObj.i;
                // 这里判断权限, 如果导航里没有传过来js已有的页面,那么如果用户用url输入的话会返回刚刚进入的页面
                if(hash === $location.$$path.split('/')[1]){
                    isUrl = false;
                }

                if (item.menus.length > 0) {
                    angular.forEach(item.menus, (menu, k)=> {
                        let link = document.createElement('a');
                        let obj = {};
                        link.href = menu.url;
                        let search = link.hash.split('#').slice(1).join('').split('?').slice(1).join('').split('&');
                        search.forEach((it)=> {
                            let split = it.split('=');
                            obj[split[0]] = split[1]
                        });
                        menu.search = obj;
                        // 确定一下当前的icon
                        menu.subIndexIcon = 'icon-' + obj.i;
                        // 查看url上是否有modelId 为了二级菜单选中做准备,所有二级菜单必须要有modelId
                        if (item.menuActive) {
                            if ($location.$$search && $location.$$search.modelId) {
                                menu.modelActive = obj.modelId === $location.$$search.modelId;
                            } else {
                                // 如果url没有 modelId 那么就默认选中第一个
                                menu.modelActive = k === 0;
                                $location.$$search.modelId = obj.modelId;
                            }
                        }

                    })
                }


            });
            if(menus){
                $scope.activePanels = menusI;
            }else{
                $scope.activePanels = [];
            }
            if(isUrl === true){
                location.href = 'http://kepler.dp/midas/kepler/indexAction#/index?i=0'
            }
            $scope.listClick = (e)=> {
                menuList[e.$index].isOpen = !menuList[e.$index].isOpen
            };
        };
        let listEach = (menuList)=> {
            urlChange(menuList);
            $scope.menuList = menuList;
        };
        Ajax('POST', navAjaxUrl.menuList, {}).then(
            (data)=> {
                listEach(data.msg.menuList);
                $rootScope.$on('$locationChangeSuccess', function () {
                    menus = false;
                    listEach(data.msg.menuList);
                });

            }
        );


        $scope.subTitleBtn = ($event)=> {
            let hash = $event.target.getAttribute('data-hash');
            let parameter = JSON.parse($event.target.getAttribute('data-url'));
            $state.go(hash, parameter)
        };
    }]
})()
