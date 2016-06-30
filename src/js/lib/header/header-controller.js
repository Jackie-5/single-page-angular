export default (() => {
    return ['$scope', 'Ajax', '$cookieStore', ($scope, Ajax, $cookieStore)=> {
        const headerAjaxUrl = {
            userInfoLoad: '/midas/kepler/ajax/userInfoLoad'
        };
        let codeResult = (data)=> {
            $scope.toggleOpen1 = function ($event) {
                console.log('dfdfd')
            };
            $scope.name = data.user.name;
        };
        $scope.popover = {
            content:'<a class="menuitem" href="/platform/logout">退出</a>'
        };

        Ajax('POST', headerAjaxUrl.userInfoLoad, {}).then(
            (data)=> {
                codeResult(data.msg);
                $cookieStore.put('login', data.msg.user.login);
                $cookieStore.put('name', data.msg.user.name);
                $cookieStore.put('id', data.msg.user.id);
                $cookieStore.put('employeeId', data.msg.employeeDto.employeeId);
            }
        );
    }]
})()
