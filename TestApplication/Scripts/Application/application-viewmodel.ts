/// <reference path="../Definitions/knockout.d.ts" />
/// <reference path="../Definitions/jquery.d.ts" />

module Rsl {
    const ERROR_LIFE_TIME = 2000;

    export class ApplicationViewModel {
        public streetlights: KnockoutObservable<Models.IStreetlightSummary[]>;
        public selectedStreetlight: KnockoutObservable<IStreetlightDetailViewModel>;

        private longProcessesCount: number = 0;
        private errorsCount: number = 0;

        public isLongProcess: KnockoutObservable<boolean> = ko.observable(false);
        public lastErrorMessage: KnockoutObservable<string> = ko.observable('');

        // get applicant to add a loader here
        constructor(private _apiAccess: IApiAccess) {
            this.streetlights = ko.observable<Models.IStreetlightSummary[]>();
            this.selectedStreetlight = ko.observable<IStreetlightDetailViewModel>();
            this.loadData().done(x => {
                this.streetlights(x);
            });
        }

        public selectStreetlight(parent: ApplicationViewModel, streetlight: Models.IStreetlightSummary): void {
            parent.selectedStreetlight(null);
            parent.loadDetails(streetlight.id).done(x => {
                parent.selectedStreetlight(x);
            });
        }

        public clickObject(parent:any, data: any): void {
            parent.set(data);
        }
        public isFailed(bulb: IBulbStateViewModel): boolean {
            return bulb.bulbStatus().fault > 0;
        }

        public getLightPower(light: IStreetlightDetailViewModel): number {
            let result = 0;

            if (light.isSwitchedOn()) {
                for (let bulb of light.bulbs) {
                    if (bulb.bulbStatus().isOn) {
                        result += bulb.bulbInformation.powerDraw;
                    }
                }
            }

            return result;
        }

        public toggleLightState(light: IStreetlightDetailViewModel): void {
            var isOn = light.isSwitchedOn();

            if (isOn) {
                this.runLongProcess(
                    this._apiAccess.switchOffLight(light.id).always(x => {
                        this.selectStreetlight(this, {
                            id: light.id,
                            description: light.description
                        });
                    })
                );
            }
            else {
                this.runLongProcess(
                    this._apiAccess.switchOnLight(light.id).always(x => {
                        this.selectStreetlight(this, {
                            id: light.id,
                            description: light.description
                        });
                    })
                );
            }
        }

        public toggleBulbState(parent: ApplicationViewModel, light: IStreetlightDetailViewModel, bulb: IBulbStateViewModel): void {
            if (!light.isSwitchedOn()) return;

            var isOn = bulb.bulbStatus().isOn;
            
            if (isOn) {
                // always switch off
                this.runLongProcess(
                    parent._apiAccess.switchOffBulb(bulb.bulbInformation.id)
                        .done(x => {
                            // reload bulb data
                            parent.updateBulbStatus(bulb);
                        })
                );
            }
            else {
                // always switch on
                this.runLongProcess(
                    parent._apiAccess.switchOnBulb(bulb.bulbInformation.id)
                        .done(x => {
                            // reload bulb data
                            parent.updateBulbStatus(bulb);
                        })
                );
            }
        }

        private runLongProcess(promise: JQueryPromise<any>): JQueryPromise<any> {
            if (++this.longProcessesCount == 1)
                this.isLongProcess(true);

            return promise.always(() => {
                if (--this.longProcessesCount == 0)
                    this.isLongProcess(false);

            }).fail((error) => {
                this.setError(error);
            });
        }

        private setError(error: any) {
            if (error == null) {
                this.lastErrorMessage('');
                return;
            }

            let errorId = ++this.errorsCount;
            this.lastErrorMessage(error.toString());

            setTimeout(() => {
                if (errorId == this.errorsCount)
                    this.lastErrorMessage('');
            }, ERROR_LIFE_TIME);
        }

        private updateBulbStatus(bulb: IBulbStateViewModel) {
            this._apiAccess.loadBulbDetail(bulb.bulbInformation.id).done(x => {
                bulb.bulbStatus(x.bulbCurrentState);
            });
        }

        private loadData(): JQueryPromise<Models.IStreetlightSummary[]> {
            return this._apiAccess.loadStreetlights();
        }

        private loadDetails(id: string): JQueryPromise<IStreetlightDetailViewModel> {
            return this._apiAccess.loadStreetlightDetail(id);
        }
    }
}