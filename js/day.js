
var app = angular.module('myApp', []);
app.controller('myController', function ($scope, $http) {


	$scope.login = function () {
		console.log($scope.pin);
		if ($scope.pin == "1234") {
			$scope.user = "Viewpoint";
			$scope.auth = true;
		}
		else if ($scope.pin == "1111") {
			$scope.user = "Admin";
			$scope.auth = true;
		}
		else {
			$scope.pin = ""
		}

	}
	
	openSection('production');
	appGlobals();
	presentDay();


	function appGlobals() {
		$scope.shift = 0;
		$scope.begin = new Date(2019, 9, 5, 6, 0, 0, 0);
		$scope.shovel_names = ['P&H-06', 'P&H-07', 'P&H-09', 'P&H-10', 'P&H-11', 'P&H-12', 'P&H-13', 'P&H-14', 'P&H-15',
			'P&H-16', 'P&H-17', 'P&H-18', 'P&H-19', 'HIM-20', 'PC-TATA', 'PL-06', 'PL-07'];
		$scope.dragline_names = ['Jyoti', 'Pawan', 'Vindhya', 'Jwala'];
		$scope.surface_miner_names = ['LnT'];
		$scope.outsourcing_names = [
			'BGR-EAST-APT',
			'GAJRAJ-WEST-APT',
			'GAJRAJ-EAST-APB',
			'GAJRAJ-WEST-APB',
			'DL-EAST',
			'DL-WEST'
		];
	}

	function presentDay() {
		var a = $scope.begin;
		var b = a.getTime();
		var c = new Date().getTime();
		var d = Math.floor((c - b) / (24 * 3600 * 1000));
		$scope.day = d;
		dayDecode();
	}

	function dayDecode() {
		var days = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thirsday',
			'Friday',
			'Saturday'
		];
		shifts = ['First', 'Second', 'Night'];

		var a = $scope.begin;
		var b = a.getTime();
		var c = $scope.day;
		var d = b + (c * 24 * 3600 * 1000) + 1;
		var e = new Date(d);
		var f = e.getDate() + '-' + (e.getMonth() + 1) + '-' + e.getFullYear() + ', ' + days[e.getDay()];
		$scope.f = f;
		getData();
	}



	function appInitialize() {
		$scope.shovels = [];
		$scope.draglines = [];
		$scope.surfaceMiners = [];
		$scope.outsourcings = [];
		$scope.status = '----------';
		$scope.packet_string = "ready";
		$scope.obj = { name: 'scope object' };
		$scope.disp = new Dispatch('zuke');
		$scope.disp.initialize();


		angular.forEach($scope.shovel_names, function (x) {
			var temp = new Shovel(x);
			temp.initialize();
			$scope.shovels.push(temp);
		});
		angular.forEach($scope.dragline_names, function (x) {
			var temp = new Dragline(x);
			temp.initialize();
			$scope.draglines.push(temp);
		});
		angular.forEach($scope.surface_miner_names, function (x) {
			var temp = new SurfaceMiner(x);
			temp.initialize();
			$scope.surfaceMiners.push(temp);
		});
		angular.forEach($scope.outsourcing_names, function (x) {
			var temp = new Outsourcing(x);
			temp.initialize();
			$scope.outsourcings.push(temp);
		});

		$scope.shovels_total = new Shovel('total');
		$scope.draglines_total = new Dragline('total');
		$scope.surfaceMiners_total = new SurfaceMiner('total');
		$scope.outsourcings_total = new Outsourcing('total');
	}

	function getData() {
		appInitialize();
		var a = $scope.day;
		var s1 = 3 * a;
		var s2 = s1 + 1;
		var s3 = s1 + 2;

		var a1 = false;
		var a2 = false;
		var a3 = false;

		var d1 = fetch(s1);
		var d2 = fetch(s2);
		var d3 = fetch(s3);

		$scope.d1 = d1;
		$scope.d2 = d2;
		$scope.d3 = d3;


		if (d1) {
			a1 = true;
		}

		if (d2) {
			a2 = true;
		}

		if (d3) {
			a3 = true;
		}


		$scope.a1 = a1;
		$scope.a2 = a2;
		$scope.a3 = a3;

		if (a1) {
			dayTotal();
		}

	}

	function fetch(s) {
		console.log("Data requested for " + s);
		var obj = null;
		obj = JSON.parse(localStorage.getItem(s));
		return obj;
	}

	function pop() {
		var t = $scope.obj;
		angular.forEach(t.shovels, function (x, i) {
			$scope.shovels[i].set(x);
		});
		angular.forEach(t.draglines, function (x, i) {
			$scope.draglines[i].set(x);
		});
		angular.forEach(t.surfaceMiners, function (x, i) {
			$scope.surfaceMiners[i].set(x);
		});
		angular.forEach(t.outsourcings, function (x, i) {
			$scope.outsourcings[i].set(x);
		});
		ref();
	};

	function dayTotal() {
		var k = null;
		$scope.obj = JSON.parse(JSON.stringify($scope.d1));
		pop();
		if ($scope.a2) {
			angular.forEach($scope.shovels, function (x, i) {
				k = new Shovel('temp');
				k.initialize();
				k.set($scope.d2.shovels[i]);
				x.sum(k);
		
		
			});
			angular.forEach($scope.draglines, function (x, i) {

				k = new Dragline('temp');
				k.initialize();
				k.set($scope.d2.draglines[i]);
				x.sum(k);
			
		
			});
			angular.forEach($scope.surfaceMiners, function (x, i) {
				k = new SurfaceMiner('temp');
				k.initialize();
				k.set($scope.d2.surfaceMiners[i]);
				x.sum(k);
				
			
			});
			angular.forEach($scope.outsourcings, function (x, i) {
				k = new Outsourcing('temp');
				k.initialize();
				k.set($scope.d2.outsourcings[i]);
				x.sum(k);
			});
		}

		if ($scope.a3) {
			angular.forEach($scope.shovels, function (x, i) {
				k = new Shovel('temp');
				k.initialize();
				k.set($scope.d3.shovels[i]);
				x.sum(k);
			});
			angular.forEach($scope.draglines, function (x, i) {

				k = new Dragline('temp');

				k.initialize();
				k.set($scope.d3.draglines[i]);
				x.sum(k);
			});
			angular.forEach($scope.surfaceMiners, function (x, i) {
				k = new SurfaceMiner('temp');
	
				k.initialize();
				k.set($scope.d3.surfaceMiners[i]);
				x.sum(k);
			});
			angular.forEach($scope.outsourcings, function (x, i) {
				k = new Outsourcing('temp');
		
				k.initialize();
				k.set($scope.d3.outsourcings[i]);
				x.sum(k);
			});
		}
		ref();
	}

	function ref() {
		$scope.packet = {
			shift: $scope.shift,
			shovels: [],
			draglines: [],
			surfaceMiners: [],
			outsourcings: []
		};
		$scope.shovels_total.initialize();
		$scope.draglines_total.initialize();
		$scope.surfaceMiners_total.initialize();
		$scope.outsourcings_total.initialize();

		angular.forEach($scope.shovels, function (x) {
			x.inflate();
			$scope.packet.shovels.push(x.get());
			$scope.shovels_total.sum(x);
		});

		angular.forEach($scope.draglines, function (x) {
			x.inflate();
			$scope.packet.draglines.push(x.get());
			$scope.draglines_total.sum(x);
		});

		angular.forEach($scope.surfaceMiners, function (x) {
			$scope.packet.surfaceMiners.push(x.get());
			$scope.surfaceMiners_total.sum(x);
		});

		angular.forEach($scope.outsourcings, function (x) {
			$scope.packet.outsourcings.push(x.get());
			$scope.outsourcings_total.sum(x);
		});

		$scope.shovels_total.inflate();
		$scope.draglines_total.inflate();

		$scope.packet_string = JSON.stringify($scope.packet);
	}


	function prev() {
		if ($scope.day > 0) {
			$scope.day--;
		}
		dayDecode();
	}
	function next() {
		$scope.day++;
		dayDecode();
	}


	$scope.ref = function () {
		ref();
	}

	$scope.dayTotal = function () {
		dayTotal();
	}


	$scope.sub = function () {
		sub();
	};


$scope.prev = function () {
	prev();
}

$scope.next = function () {
	next();
}






function sub() {
	console.log('Submitting for' + $scope.shift);
	localStorage.setItem($scope.shift, $scope.packet_string);
	var k = localStorage.getItem($scope.shift);
	if (k) {
		$scope.status = "Record set for " + $scope.shift;
	}
	}
	


});
