var app = angular.module("myApp", []);
app.controller("myController", function ($scope, $http) {

    $scope.crushers = ['Crusher-01', 'Crusher-02', 'Crusher-03'];
    $scope.shovels = ['P&H-06', 'P&H-07', 'P&H-09', 'P&H-10',
        'P&H-11', 'P&H-12', 'P&H-13', 'P&H-14', 'P&H-15',
        'P&H-16', 'P&H-17', 'P&H-18', 'P&H-19', 'HIM-20', 'PC-TATA', 'PL-06', 'PL-07', 'SM-L&T'];
    $scope.draglines = ['Jyoti', 'Pawan', 'Vindhya', 'Jwala'];
    $scope.siloNames = ['OLD SILO', 'NEW SILO', 'WHARF WALL'];
    $scope.dumperNames = ['EAST', 'WEST'];

    $scope.types = ['silo', 'crusher', 'shovel', 'dragline'];
    $scope.statusCodes = [0, 1, 2];
    $scope.statusStrings = ['Idle', 'Running', 'BreakDown', 'Undef'];


    $scope.machines = [];
    $scope.silos = [];




    $scope.time = new Date().getTime();
    $scope.stamp = ""  // time of fetched status

    $scope.pin = "";
    $scope.auth = false;
    $scope.user = "Guest";
    $scope.status = "Please user PIN:1234 to login as Viewpoint";
    $scope.upUrl = 'https://sushanttiwari.in/serv/upLive.php';
    $scope.downUrl = 'https://sushanttiwari.in/serv/downLive.php';
    $scope.upUrl = 'serv/upLive.php';
    $scope.downUrl = 'serv/downLive.php';

    $scope.min = 0;   // minutes since shift
    $scope.block = 0;
    $scope.hour = 0;
    $scope.uploader = true;


    // CONFIGS ////////
    $scope.changed = false;
    ///////////////////

    class Machine {
        constructor(name, type) {
            this.name = name;
            this.type = type;
            this.status = 0;
            this.remark = "";
            this.logs = [];
            this.idlmins = 0;
            this.runmins = 0;
            this.brkmins = 0;
            this.avlmins = 0;
            this.defmins = 0;
            this.avl = 0;
            this.utl = 0;
            this.idlhms = "";
            this.runhms = "";
            this.brkhms = "";
            this.avlhms = "";
            this.avlstr = "";
            this.utlstr = "";

        }
    }

    class Silo {
        constructor(name) {
            this.name = name;
            this.rakes = 0;
            this.remark = "";
        }
    }

    class Dumper {
        constructor(name, total) {
            this.name = name;
            this.total = total;
            this.avl = 0;
            this.run = 0;
            this.logs = [];
        }


        calculate() {
            this.idl = this.avl - this.run;
            this.brk = this.total - this.avl;
            this.avali = Math.round(this.avl * 100 / this.total);
            this.utli = Math.round(this.run * 100 / this.total);
        }

        log() {
            this.calculate();
            this.logs[$scope.hour] = {
                avl: this.avl,
                run: this.run,
                idl: this.idl,
                brk: this.brk,
                avli: this.avli,
                utli: this.utli
            }
        }

        change(command) {
            if (command == 1 && this.avl > 0) {
                this.avl--;
            }
            else if (command == 2 && this.avl < this.total) {
                this.avl++;
            }
            else if (command == 3 && this.run > 0) {
                this.run--;
            }
            else if (command == 4 && this.run < this.avl) {
                this.run++;
            }
            this.log();
        }
    }

    initialize();
    function initialize() {
        angular.forEach($scope.crushers, function (x, i) {
            var k = new Machine(x, 'crusher');
            $scope.machines.push(k);
        })
        angular.forEach($scope.shovels, function (x, i) {
            var k = new Machine(x, 'shovel');
            $scope.machines.push(k);
        })
        angular.forEach($scope.draglines, function (x, i) {
            var k = new Machine(x, 'dragline');
            $scope.machines.push(k);
        })
        angular.forEach($scope.siloNames, function (x, i) {
            var k = new Silo(x)
            $scope.silos.push(k);
        })

        $scope.eastDumper = new Dumper('east', 30);
        $scope.westDumper = new Dumper('west', 40);
        sync();
        setInterval(sync, 10000);
    }
    function sync() {
        var a = new Date(2019, 9, 5, 5, 0, 0, 0);
        var b = a.getTime();
        var c = new Date().getTime();
        var d = Math.floor((c - b) / (8 * 3600 * 1000));
        var e = b + d * (8 * 3600 * 1000);
        $scope.start = e;
        $scope.min = Math.floor((c - e) / (5 * 60 * 1000));
        $scope.hour = Math.floor($scope.min / 60);



        if ($scope.changed) {
            console.log('Uploading on status change...');
            upload();
        }
        else {
            console.log('Downloading...');
            download();
        }

    }
    $scope.update = function () {
        $scope.changed = true;
        performanceLog();
    }
    function download() {

        var payload = {};
        var req = {
            method: 'POST',
            url: $scope.downUrl,
            headers: {
                'Content-Type': undefined
            },
            data: payload
        };

        $http(req).then(
            function (res) {
                var a = res.data;
                var b = a.indexOf('{');
                var c = a.lastIndexOf('}');
                var d = a.slice(b, c + 1);
                var e = JSON.parse(d);
                var stamp = e.stamp;
                var f = new Date(stamp);
                var hh = f.getHours();
                var mm = f.getMinutes();
                var ss = f.getSeconds();
                var t = hh + ':' + mm + ':' + ss;
                $scope.machines = e.machines;
                $scope.silos = e.silos;
                console.log(e.user + ' @ ' + t);
                $scope.stamp = stamp;
                performanceLog();
            },
            function () {
                console.log("fetch failed");
            })
    }
    function upload() {
        $scope.obj = {
            user: $scope.user,
            stamp: new Date().getTime(),
            machines: $scope.machines,
            silos: $scope.silos
        };

        $scope.objString = JSON.stringify($scope.obj);
        var payload = { 'str': $scope.objString };
        // console.log(JSON.parse(payload.str));
        var req = {
            method: 'POST',
            url: $scope.upUrl,
            headers: {
                'Content-Type': undefined
            },
            data: payload
        };

        $http(req).then(
            function (res) {
                var a = res.data;
                var b = a.indexOf('{');
                var c = a.lastIndexOf('}');
                var d = a.slice(b, c + 1);
                var e = JSON.parse(d);
                // console.log(e);
                $scope.changed = false; // only when upload is successful.
            },
            function () {
                console.log("upload failed....");
            })
    }
    function interpolate() {
        if ($scope.stamp < $scope.start) {
            console.log('Obsolete data detected. Resetting....')
            angular.forEach($scope.machines, function (mach, i) {
                if (mach.status != 2) {
                    mach.status = 0;
                    mach.remark = "";
                }
                mach.logs[0] = mach.status;
                for (j = 1; j < 96; j++) {
                    mach.logs[j] = 3;
                }
            });
        }
        angular.forEach($scope.machines, function (machine, i) {
            for (j = 1; j < 96; j++) {
                if (j > $scope.min) {
                    machine.logs[j] = 3;
                }
                else if (j < $scope.min) {
                    if (machine.logs[j] > 2) {
                        machine.logs[j] = machine.logs[j - 1];
                    }
                }
                else {
                    machine.logs[j] = machine.status;
                }
            }
        })
    }
    function performanceLog() {


        $scope.crusherTotal = {
            idlmins: 0,
            runmins: 0,
            brkmins: 0,
            avlmins: 0,
            defmins: 0
        };
        $scope.shovelTotal = {
            idlmins: 0,
            runmins: 0,
            brkmins: 0,
            avlmins: 0,
            defmins: 0
        };
        $scope.draglineTotal = {
            idlmins: 0,
            runmins: 0,
            brkmins: 0,
            avlmins: 0,
            defmins: 0
        };

        interpolate(); // Will ensure data validity and continuity before logging.
        angular.forEach($scope.machines, function (mach, i) {
            mach.idlmins = 0;
            mach.runmins = 0;
            mach.brkmins = 0;

            for (j = 0; j <= $scope.min; j++) {
                s = mach.logs[j];
                if (s === 0) {
                    mach.idlmins += 5;
                }
                else if (s === 1) {
                    mach.runmins += 5;
                }
                else if (s === 2) {
                    mach.brkmins += 5;
                }
                else {
                    console.log('Status error while performance counting...')
                    console.log(j);
                    console.log(s);
                }
            }
            mach.defmins = mach.idlmins + mach.runmins + mach.brkmins;
            mach.avlmins = mach.idlmins + mach.runmins;
            mach.avl = Math.round(mach.avlmins * 100 / mach.defmins);
            mach.utl = Math.round(mach.runmins * 100 / mach.defmins);

            mach.idlhms = tohhmm(mach.idlmins);
            mach.runhms = tohhmm(mach.runmins);
            mach.brkhms = tohhmm(mach.brkmins);
            mach.avlhms = tohhmm(mach.avlmins);

            mach.avlstr = `${mach.avl} %`;
            mach.utlstr = `${mach.utl} %`;

            $scope.changed = true;


            ////// TOTALING CALCULATIONS /////////


            if (mach.type == 'crusher') {
                $scope.crusherTotal.idlmins += mach.idlmins;
                $scope.crusherTotal.runmins += mach.runmins;
                $scope.crusherTotal.brkmins += mach.brkmins;
                $scope.crusherTotal.avlmins += mach.avlmins;
                $scope.crusherTotal.defmins += mach.defmins;

                $scope.crusherTotal.avl = Math.round($scope.crusherTotal.avlmins * 100 / $scope.crusherTotal.defmins);
                $scope.crusherTotal.utl = Math.round($scope.crusherTotal.runmins * 100 / $scope.crusherTotal.defmins);

                $scope.crusherTotal.idlhms = tohhmm($scope.crusherTotal.idlmins);
                $scope.crusherTotal.runhms = tohhmm($scope.crusherTotal.runmins);
                $scope.crusherTotal.brkhms = tohhmm($scope.crusherTotal.brkmins);
                $scope.crusherTotal.avlhms = tohhmm($scope.crusherTotal.avlmins);

                $scope.crusherTotal.avlstr = `${$scope.crusherTotal.avl} %`;
                $scope.crusherTotal.utlstr = `${$scope.crusherTotal.utl} %`;
            }

            else if (mach.type == 'shovel') {
                $scope.shovelTotal.idlmins += mach.idlmins;
                $scope.shovelTotal.runmins += mach.runmins;
                $scope.shovelTotal.brkmins += mach.brkmins;
                $scope.shovelTotal.avlmins += mach.avlmins;
                $scope.shovelTotal.defmins += mach.defmins;

                $scope.shovelTotal.avl = Math.round($scope.shovelTotal.avlmins * 100 / $scope.shovelTotal.defmins);
                $scope.shovelTotal.utl = Math.round($scope.shovelTotal.runmins * 100 / $scope.shovelTotal.defmins);

                $scope.shovelTotal.idlhms = tohhmm($scope.shovelTotal.idlmins);
                $scope.shovelTotal.runhms = tohhmm($scope.shovelTotal.runmins);
                $scope.shovelTotal.brkhms = tohhmm($scope.shovelTotal.brkmins);
                $scope.shovelTotal.avlhms = tohhmm($scope.shovelTotal.avlmins);

                $scope.shovelTotal.avlstr = `${$scope.shovelTotal.avl} %`;
                $scope.shovelTotal.utlstr = `${$scope.shovelTotal.utl} %`;
            }

            else if (mach.type == 'dragline') {
                $scope.draglineTotal.idlmins += mach.idlmins;
                $scope.draglineTotal.runmins += mach.runmins;
                $scope.draglineTotal.brkmins += mach.brkmins;
                $scope.draglineTotal.avlmins += mach.avlmins;
                $scope.draglineTotal.defmins += mach.defmins;

                $scope.draglineTotal.avl = Math.round($scope.draglineTotal.avlmins * 100 / $scope.draglineTotal.defmins);
                $scope.draglineTotal.utl = Math.round($scope.draglineTotal.runmins * 100 / $scope.draglineTotal.defmins);

                $scope.draglineTotal.idlhms = tohhmm($scope.draglineTotal.idlmins);
                $scope.draglineTotal.runhms = tohhmm($scope.draglineTotal.runmins);
                $scope.draglineTotal.brkhms = tohhmm($scope.draglineTotal.brkmins);
                $scope.draglineTotal.avlhms = tohhmm($scope.draglineTotal.avlmins);

                $scope.draglineTotal.avlstr = `${$scope.draglineTotal.avl} %`;
                $scope.draglineTotal.utlstr = `${$scope.draglineTotal.utl} %`;
            }



        });
        
   
   
   
    }

    $scope.login = function () {
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



    function tohhmm(mins) {
        h = Math.floor(mins / 60);
        m = mins % 60;
        return h.toString() + " : " + (m < 10 ? "0" : "") + m.toString();
    }
});  