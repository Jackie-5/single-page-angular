export default (()=> {
    angular.module('angular.service', [])
        .service('Ajax', ['$http', '$q', ($http, $q)=> {
            return (method, url, data)=> {
                let defered = $q.defer();
                let config = {
                    method: method,
                    url: url
                };
                if (method === 'POST') {
                    config.data = data;
                } else if ('GET' === method) {
                    config.params = data;
                }
                $http(config).success((data)=> {
                    defered.resolve(data);

                }).error((err)=> {
                    defered.reject(err)
                });
                return defered.promise;
            }
        }]);
})()

