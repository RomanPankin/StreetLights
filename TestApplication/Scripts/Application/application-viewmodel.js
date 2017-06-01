/// <reference path="../Definitions/knockout.d.ts" />
/// <reference path="../Definitions/jquery.d.ts" />
var Rsl;
(function (Rsl) {
    var ERROR_LIFE_TIME = 2000;
    var ApplicationViewModel = (function () {
        // get applicant to add a loader here
        function ApplicationViewModel(_apiAccess) {
            var _this = this;
            this._apiAccess = _apiAccess;
            this.longProcessesCount = 0;
            this.errorsCount = 0;
            this.isLongProcess = ko.observable(false);
            this.lastErrorMessage = ko.observable('');
            this.streetlights = ko.observable();
            this.selectedStreetlight = ko.observable();
            this.loadData().done(function (x) {
                _this.streetlights(x);
            });
            this.totalLightPower = ko.computed(function () {
                return _this.getLightPower(_this.selectedStreetlight());
            });
        }
        ApplicationViewModel.prototype.selectStreetlight = function (parent, streetlight) {
            parent.selectedStreetlight(null);
            parent.loadDetails(streetlight.id).done(function (x) {
                parent.selectedStreetlight(x);
            });
        };
        ApplicationViewModel.prototype.clickObject = function (parent, data) {
            parent.set(data);
        };
        ApplicationViewModel.prototype.isFailed = function (bulb) {
            return bulb.bulbStatus().faultCondition > 0;
        };
        ApplicationViewModel.prototype.getLightPower = function (light) {
            var result = 0;
            if (light && light.isSwitchedOn()) {
                for (var _i = 0, _a = light.bulbs; _i < _a.length; _i++) {
                    var bulb = _a[_i];
                    if (bulb.bulbStatus().isOn) {
                        result += bulb.bulbInformation.powerDraw;
                    }
                }
            }
            return result;
        };
        ApplicationViewModel.prototype.toggleLightState = function (light) {
            var _this = this;
            var isOn = light.isSwitchedOn();
            if (isOn) {
                this.runLongProcess(this._apiAccess.switchOffLight(light.id).always(function (x) {
                    _this.selectStreetlight(_this, {
                        id: light.id,
                        description: light.description
                    });
                }));
            }
            else {
                this.runLongProcess(this._apiAccess.switchOnLight(light.id).always(function (x) {
                    _this.selectStreetlight(_this, {
                        id: light.id,
                        description: light.description
                    });
                }));
            }
        };
        ApplicationViewModel.prototype.toggleBulbState = function (parent, light, bulb) {
            if (!light.isSwitchedOn())
                return;
            var isOn = bulb.bulbStatus().isOn;
            if (isOn) {
                // always switch off
                this.runLongProcess(parent._apiAccess.switchOffBulb(bulb.bulbInformation.id)
                    .done(function (x) {
                    // reload bulb data
                    parent.updateBulbStatus(bulb);
                }));
            }
            else {
                // always switch on
                this.runLongProcess(parent._apiAccess.switchOnBulb(bulb.bulbInformation.id)
                    .done(function (x) {
                    // reload bulb data
                    parent.updateBulbStatus(bulb);
                }));
            }
        };
        ApplicationViewModel.prototype.setFault = function (parent, bulb, fault) {
            this.runLongProcess(parent._apiAccess.setFault(bulb.bulbInformation.id, fault)
                .done(function (x) {
                // reload bulb data
                parent.updateBulbStatus(bulb);
            }));
        };
        ApplicationViewModel.prototype.runLongProcess = function (promise) {
            var _this = this;
            if (++this.longProcessesCount == 1)
                this.isLongProcess(true);
            return promise.always(function () {
                if (--_this.longProcessesCount == 0)
                    _this.isLongProcess(false);
            }).fail(function (error) {
                _this.setError(error);
            });
        };
        ApplicationViewModel.prototype.setError = function (error) {
            var _this = this;
            if (error == null) {
                this.lastErrorMessage('');
                return;
            }
            var errorId = ++this.errorsCount;
            this.lastErrorMessage(error.toString());
            setTimeout(function () {
                if (errorId == _this.errorsCount)
                    _this.lastErrorMessage('');
            }, ERROR_LIFE_TIME);
        };
        ApplicationViewModel.prototype.updateBulbStatus = function (bulb) {
            this._apiAccess.loadBulbDetail(bulb.bulbInformation.id).done(function (x) {
                bulb.bulbStatus(x.bulbCurrentState);
                console.log(x.bulbCurrentState);
            });
        };
        ApplicationViewModel.prototype.loadData = function () {
            return this._apiAccess.loadStreetlights();
        };
        ApplicationViewModel.prototype.loadDetails = function (id) {
            return this._apiAccess.loadStreetlightDetail(id);
        };
        return ApplicationViewModel;
    }());
    Rsl.ApplicationViewModel = ApplicationViewModel;
})(Rsl || (Rsl = {}));
