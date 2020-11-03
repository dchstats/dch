
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

	
	openSection('shovel-east');
	appGlobals();
	presentShift();


	function appGlobals() {
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

	function presentShift() {
		var a = $scope.begin;
		var b = a.getTime();
		var c = new Date().getTime();
		var d = Math.floor((c - b) / (8 * 3600 * 1000));
		$scope.shift = d;
		shiftDecode();
	}

	function shiftDecode() {
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
		var c = $scope.shift;
		var d = b + (c * 8 * 3600 * 1000) + 1;
		var e = new Date(d);
		var f = e.getDate() + '-' + (e.getMonth() + 1) + '-' + e.getFullYear();
		var g = c % 3;
		var h = shifts[g];
		var i = h + " Shift, " + f;
		$scope.i = i;
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
		fetch();
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

	function populate() {
		console.log('populating.');
		populate_helper();
	}

	function populate_helper() {
		if ($scope.shift >= 0) {
			dummy();
			sub();
			$scope.shift--;
			setTimeout(populate_helper(), 1);
		}
	}

	function dummy() {
		var l = '{"shift":171,"shovels":[["P&H_1",true,true,54,77,51,35,10,21,41,65],["P&H_2",true,true,53,72,82,69,63,76,40,67],["P&H_3",true,true,10,85,33,64,87,51,14,59],["P&H_4",true,true,2,11,77,21,59,77,22,93],["P&H_5",true,true,67,35,71,53,24,25,67,28],["P&H_6",true,true,4,18,42,97,54,85,67,28],["P&H_7",true,true,13,81,7,94,69,92,21,59],["P&H_8",true,true,7,8,66,27,96,36,2,29],["P&H_9",true,true,64,32,90,75,9,44,85,73],["P&H_10",true,true,73,85,48,34,48,85,65,83]],"draglines":[["Jyoti",42,85,null,null,null,null,"Remark1"],["Pawan",81,7,null,null,null,null,"Remark2"],["Vindhya",57,40,null,null,null,null,"Remark3"],["Jwala",11,39,null,null,null,null,"Remark4"]],"surfaceMiners":[["LnT",76,0,76,"Remark1"]],"outsourcings":[["BGR-EAST-APT",3,"Remark1"],["GAJRAJ-WEST-APT",36,"Remark2"],["GAJRAJ-EAST-APB",12,"Remark3"],["GAJRAJ-WEST-APB",10,"Remark4"],["DL-EAST",5,"Remark5"],["DL-WEST",9,"Remark6"]]}';

		$scope.obj = JSON.parse(l);
		randomValues();
		pop();
	}
	
	function randomValues() {
		t = $scope.obj;
		angular.forEach(t.shovels, function (x, i) {
			t.shovels[i][1] = true;
			t.shovels[i][2] = true;
			t.shovels[i][3] = Math.floor(100 * Math.random());
			t.shovels[i][4] = Math.floor(100 * Math.random());
			t.shovels[i][5] = Math.floor(100 * Math.random());
			t.shovels[i][6] = Math.floor(100 * Math.random());
			t.shovels[i][7] = Math.floor(100 * Math.random());
			t.shovels[i][8] = Math.floor(100 * Math.random());
			t.shovels[i][9] = Math.floor(100 * Math.random());
			t.shovels[i][10] = Math.floor(100 * Math.random());
		});
		angular.forEach(t.draglines, function (x, i) {
			t.draglines[i][1] = Math.floor(100 * Math.random());
			t.draglines[i][2] = Math.floor(100 * Math.random());

		});
		angular.forEach(t.surfaceMiners, function (x, i) {
			t.surfaceMiners[i][1] = Math.floor(100 * Math.random());
			t.surfaceMiners[i][2] = Math.floor(100 * Math.random());
			t.surfaceMiners[i][3] = Math.floor(100 * Math.random());
		});
		angular.forEach(t.outsourcings, function (x, i) {
			t.outsourcings[i][1] = Math.floor(100 * Math.random());
		});
	}

	function prev() {
		if ($scope.shift > 0) {
			$scope.shift--;
		}
		shiftDecode();
	}
	function next() {
		$scope.shift++;
		shiftDecode();
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


	$scope.populate = function () {
		populate();
		presentShift();
	}

	$scope.clear = function () {
		localStorage.clear();
		presentShift();
	}

	$scope.prev = function () {
		prev();
	}

	$scope.next = function () {
		next();
	}




	function fetch() {
		var s = $scope.shift;
		console.log("Data requested for " + s);
		var obj = JSON.parse(localStorage.getItem(s));
		if (obj) {
			$scope.obj = obj;
			pop();
		}

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
