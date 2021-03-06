angular.module('app.controllers', ['ionic', 'ngMessages'])

  .controller('cMenu', function ($scope, $state, $ionicPopup, $ionicSideMenuDelegate, mCODE, sAuthentication) {
    $scope.isLogin = function () {
      return sAuthentication.isLogin();
    };
    $scope.logout = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Logout',
        template: 'Are you sure you want to logout?'
      });

      confirmPopup.then(function (res) {
        $ionicSideMenuDelegate.toggleLeft();
        if (res) {
          return sAuthentication.logout();
        } else {
        }
      });
    }
  })

  .controller('cBidReportApp', function ($state, sAuthentication, sInitDataService) {

  })

  .controller('cScheduleVaccineToday', function ($scope, ngProgressFactory, mInitdata, mCODE, mDataCommon, sAuthentication, sUtils) {
    var firstLoadDb = false;
    var progressbar = ngProgressFactory.createInstance();
    progressbar.setParent(document.getElementById("progress"));
    progressbar.setAbsolute();
    $scope.mEventDetails = [];
    $scope.dataElements = mDataCommon.dataElements;

    $scope.attributes = mDataCommon.attributes;


    //update progress when commondb updated
    $scope.$on(mCODE.MSG.UPDATECOMMONDB, function () {
      progressbar.reset();
    });
    $scope.$on(mCODE.MSG.APIERROR, function () {

      progressbar.reset();
    });
    //update ui from cache
    $scope.$on(mCODE.MSG.EVENTRENDER, function (event, args) {
      console.log("EVENTRENDER");
      $scope.mEventDetails = mDataCommon.eventCacheReports;
      if (progressbar.status() == 0) {
        progressbar.start();
      }
      progressbar.set(mDataCommon.eventCacheReports.length * 100 / mDataCommon.events.length);
      if (mDataCommon.eventCacheReports.length == mDataCommon.events.length) {
        progressbar.complete();
      }
    });

    //if caching, get full db in local, remember init cache in the first time
    if(!firstLoadDb){
      progressbar.start();
      sUtils.openStore(function (store) {
        store.getAll().then(function (data) {
          if (data.length >= mDataCommon.eventCacheReports.length) {
            $scope.mEventDetails = data;
            progressbar.complete();
          } else {
            $scope.mEventDetails = mDataCommon.eventCacheReports;
            progressbar.complete();
          }
          firstLoadDb=true;
        });
      });
    }else{
      progressbar.complete();
    }
  })

  .controller('cStockInHand', function ($scope) {
    $(function () {
      $('#container').highcharts({
        title: {
          text: 'Monthly Average Temperature',
          x: -20 //center
        },
        subtitle: {
          text: 'Source: WorldClimate.com',
          x: -20
        },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
          title: {
            text: 'Temperature (°C)'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        tooltip: {
          valueSuffix: '°C'
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        },
        series: [{
          name: 'Tokyo',
          data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
          name: 'New York',
          data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
          name: 'Berlin',
          data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
          name: 'London',
          data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
      });
    });


  })

  .controller('cStockInHandVsDemand', function ($scope) {

    $(function () {
      $(document).ready(function () {
        Highcharts.setOptions({
          global: {
            useUTC: false
          }
        });

        $('#container').highcharts({
          chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
              load: function () {

                // set up the updating of the chart each second
                var series = this.series[0];
                setInterval(function () {
                  var x = (new Date()).getTime(), // current time
                    y = Math.random();
                  series.addPoint([x, y], true, true);
                }, 1000);
              }
            }
          },
          title: {
            text: 'Live random data'
          },
          xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
          },
          yAxis: {
            title: {
              text: 'Value'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          tooltip: {
            formatter: function () {
              return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 2);
            }
          },
          legend: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          series: [{
            name: 'Random data',
            data: (function () {
              // generate an array of random data
              var data = [],
                time = (new Date()).getTime(),
                i;

              for (i = -19; i <= 0; i += 1) {
                data.push({
                  x: time + i * 1000,
                  y: Math.random()
                });
              }
              return data;
            }())
          }]
        });
      });
    });

  })

  .controller('cVaccineHistoryReport', function ($scope) {
    $(function () {
      $('#container').highcharts({
        title: {
          text: 'Combination chart'
        },
        xAxis: {
          categories: ['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']
        },
        labels: {
          items: [{
            html: 'Total fruit consumption',
            style: {
              left: '50px',
              top: '18px',
              color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
            }
          }]
        },
        series: [{
          type: 'column',
          name: 'Jane',
          data: [3, 2, 1, 3, 4]
        }, {
          type: 'column',
          name: 'John',
          data: [2, 3, 5, 7, 6]
        }, {
          type: 'column',
          name: 'Joe',
          data: [4, 3, 3, 9, 0]
        }, {
          type: 'spline',
          name: 'Average',
          data: [3, 2.67, 3, 6.33, 3.33],
          marker: {
            lineWidth: 2,
            lineColor: Highcharts.getOptions().colors[3],
            fillColor: 'white'
          }
        }, {
          type: 'pie',
          name: 'Total consumption',
          data: [{
            name: 'Jane',
            y: 13,
            color: Highcharts.getOptions().colors[0] // Jane's color
          }, {
            name: 'John',
            y: 23,
            color: Highcharts.getOptions().colors[1] // John's color
          }, {
            name: 'Joe',
            y: 19,
            color: Highcharts.getOptions().colors[2] // Joe's color
          }],
          center: [100, 80],
          size: 100,
          showInLegend: false,
          dataLabels: {
            enabled: false
          }
        }]
      });
    });
  })

  .controller('cLogin', function ($http, $scope, $ionicPopup, $state, ngProgressFactory, sInitDataService, sAuthentication, sUtils, sApiCall) {
    if (sAuthentication.isLogin(true)) {
      sInitDataService.populateData();
    }
    var progressbar = ngProgressFactory.createInstance();
    progressbar.setParent(document.getElementById("progress"));
    progressbar.setAbsolute();

    var login = $scope.login = {
      host: undefined,
      username: undefined,
      password: undefined
    };

    $scope.loginClick = function (form) {
      if (form.$valid && sUtils.isValue(login.host) && sUtils.isValue(login.username) && sUtils.isValue(login.password)) {
        if (login.host.length > 3 && (login.host[login.host.length - 1] == '/' || login.host[login.host.length - 1] == '\\')) {
          $scope.login.host = login.host = login.host.substr(0, login.host.length - 1);
        }

        progressbar.start();
        var host = login.host;
        var authen = "Basic " + btoa(login.username + ":" + login.password);
        sApiCall.getMe(host, authen).then(function (data) {
          sAuthentication.setupAuthenSuccess(host, authen, data.organisationUnits[0].id);
          progressbar.complete();
        }, function (error) {
          progressbar.reset();
          showAlert(error);
        });
        //$scope.login.username = "";
        //$scope.login.password = "";
      }
    };

    var showAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your input data again.'
      });
      alertPopup.then(function (res) {
        //console.log(res);
      });
    };
  })

  .controller('cConsole', function ($scope, ngProgressFactory, mCODE, mInitdata, sAuthentication, sApiCall, sUtils) {
      sAuthentication.isLogin(true);

      var progressbar = ngProgressFactory.createInstance();
      progressbar.setParent(document.getElementById("progress"));
      progressbar.setAbsolute();

      $scope.getTestClick = function () {
        var e = document.getElementById("slApi");
        switch (Number(e.options[e.selectedIndex].value)) {
          case 0:
            progressbar.start();
            sApiCall.getMe().then(function (data) {
              $scope.output = sUtils.prettyJsonPrint(data);
              progressbar.complete();
            }, function (error) {
              $scope.output = sUtils.prettyJsonPrint(error);
              progressbar.reset();
            });
            break;
          case 1:
            progressbar.start();
            sApiCall.getConstants().then(function (data) {
              $scope.output = sUtils.prettyJsonPrint(data);
              progressbar.complete();
            }, function (error) {
              $scope.output = sUtils.prettyJsonPrint(error);
              progressbar.reset();
            });
            break;
          case 2:
            progressbar.start();
            sApiCall.getProgramTrackedEntityAttributes().then(function (data) {
              $scope.output = sUtils.prettyJsonPrint(data);
              progressbar.complete();
            }, function (error) {
              $scope.output = sUtils.prettyJsonPrint(error);
              progressbar.reset();
            });
            break;
          case 3:
            progressbar.start();
            sApiCall.getProgramStageDataElements().then(function (data) {
              $scope.output = sUtils.prettyJsonPrint(data);
              progressbar.complete();
            }, function (error) {
              $scope.output = sUtils.prettyJsonPrint(error);
              progressbar.reset();
            });
            break;
          case 4:
            progressbar.start();
            sApiCall.getProgramIndicators().then(function (data) {
              $scope.output = sUtils.prettyJsonPrint(data);
              progressbar.complete();
            }, function (error) {
              $scope.output = sUtils.prettyJsonPrint(error);
              progressbar.reset();
            });
            break;
          case 5:
            progressbar.start();
            sApiCall.getProgramValidations().then(function (data) {
              $scope.output = sUtils.prettyJsonPrint(data);
              progressbar.complete();
            }, function (error) {
              $scope.output = sUtils.prettyJsonPrint(error);
              progressbar.reset();
            });
            break;
          case 6:
            progressbar.start();
            sApiCall.getProgramRuleVariables().then(function (data) {
              $scope.output = sUtils.prettyJsonPrint(data);
              progressbar.complete();
            }, function (error) {
              $scope.output = sUtils.prettyJsonPrint(error);
              progressbar.reset();
            });
            break;
          case 7:
            progressbar.start();
            sApiCall.getProgramRules().then(function (data) {
              $scope.output = sUtils.prettyJsonPrint(data);
              progressbar.complete();
            }, function (error) {
              $scope.output = sUtils.prettyJsonPrint(error);
              progressbar.reset();
            });
            break;
          case 8:
            progressbar.start();
            sApiCall.getEvents().then(function (data) {
              $scope.output = sUtils.prettyJsonPrint(data);
              progressbar.complete();
            }, function (error) {
              $scope.output = sUtils.prettyJsonPrint(error);
              progressbar.reset();
            });
            break;
          case 9:
            progressbar.start();
            sApiCall.getTrackedEntityInstances("s54asTMkAKf").then(function (data) {
              $scope.output = sUtils.prettyJsonPrint(data);
              progressbar.complete();
            }, function (error) {
              $scope.output = sUtils.prettyJsonPrint(error);
              progressbar.reset();
            });
            break;
          case 10:
            progressbar.start();
            sApiCall.getEnrollments("vg1QlYDhoa5").then(function (data) {
              $scope.output = sUtils.prettyJsonPrint(data);
              progressbar.complete();
            }, function (error) {
              $scope.output = sUtils.prettyJsonPrint(error);
              progressbar.reset();
            });
            break;
          case 11:
            progressbar.start();
            sApiCall.getEventTrackedEntityInstances("s54asTMkAKf").then(function (data) {
              $scope.output = sUtils.prettyJsonPrint(data);
              progressbar.complete();
            }, function (error) {
              $scope.output = sUtils.prettyJsonPrint(error);
              progressbar.reset();
            });
            break;
        }


      }
    }
  )


;
