﻿$app.controller('loginCtrl', ['$scope', '$http'
	, function ($scope, $http) {
		$scope.loggingIn = false;
		$scope.errors = {};
		$scope.submit = function () {
			/// will auto navigate to dashboard on its own
			if ($scope.validate()) {
				$scope.loggingIn = true;

				$http.post('http://app.buildfire.com/api/login/controlPanel/', {
					email: $scope.username,
					password: $scope.password
				}, {bypassInterceptorForStatus: 404})
					.success(function (user) {
						if (user) {
							localStorage.setItem('user', JSON.stringify(user));
							window.currentUser = user;
							window.location.hash = "/";
						}
						else {
							$rootScope.$broadcast('apiError', {
								code: "NOTFOUND",
								message: "Invalid username or password"
							});
						}
					})
					.error(function (err) {
						if (err && err.code == "NOTFOUND") {
							$rootScope.$broadcast('apiError', {
								code: "NOTFOUND",
								message: "Invalid username or password"
							});
						}
					});
			}
		};

		$scope.forgotPassword = function () {
			window.location = '/pages/forgetPassword.html';
		};

		$scope.validate = function () {
			$scope.errors.serverError = false;
			var valid = true;
			if (!$scope.username || !isValidEmail($scope.username)) {
				$scope.errors.email = true;
				valid = false;
			} else {
				$scope.errors.email = false;
			}


			if (!$scope.password) {
				$scope.errors.password = true;
				valid = false;
			} else {
				$scope.errors.password = false;
			}


			return valid;
		};

		var isValidEmail = function (literal) {
			return (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z\-0-9]{2,}))$/).test(literal);
		};


	}
]);