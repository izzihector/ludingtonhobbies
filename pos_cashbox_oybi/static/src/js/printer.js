odoo.define('pos_cashbox_oybi.Printer', function (require) {
"use strict";

var core = require('web.core');
var DeviceProxy = require('iot.widgets').DeviceProxy;
var IoTLongpolling = require('iot.widgets').IoTLongpolling;
var PrinterMixin = require('point_of_sale.Printer').PrinterMixin;

// In Odoo standard PoS, IoTLongpolling accesses the variable 'posmodel', which
// represents the current open POS session. Because we are opening the cashbox when
// no session is open, we need to override the action function so it works when
// 'posmodel' is undefined
IoTLongpolling.include({
    action: function (iot_ip, device_id, data) {
        this.protocol = window.location.protocol;
        var self = this;
        var data = {
            params: {
                session_id: self._session_id,
                device_id: device_id,
                data: JSON.stringify(data),
            }
        };
        var options = {
            timeout: this.ACTION_TIMEOUT,
        };
        var prom = new Promise(function(resolve, reject) {
            self._rpcIoT(iot_ip, self.ACTION_ROUTE, data, options)
                .then(resolve)
                .fail(reject);
        });
        prom.then(function () {
            if (typeof posmodel !== 'undefined') {
                posmodel.proxy.proxy_connection_status(iot_ip, true);
            }
            alert("Success connecting to printer!");
            window.location = "/web#action=point_of_sale.action_client_pos_menu";

        }).guardedCatch(function () {
            if (typeof posmodel !== 'undefined') {
                posmodel.proxy.proxy_connection_status(iot_ip, false);
            }
            alert("Failure to connect to printer");
            window.location = "/web#action=point_of_sale.action_client_pos_menu";
        });
        return prom;
    },
});


var BackendPrinterProxy = DeviceProxy.extend(PrinterMixin, {
    init: function (device) {
        PrinterMixin.init.call(this, arguments);
        this._super(device);
    },
    _onIoTActionResult: function (data){
        if (data.result === true) {
            alert('Successfully sent to printer!');
        } else {
            alert('Connection to Printer failed: Please check if the printer is still connected.');
        }
    },

    open_cashbox: function () {
        var self = this;
        return this.action({action: 'cashbox'})
            .then(self._onIoTActionResult.bind(self))
            .guardedCatch(self._onIoTActionFail.bind(self));
    },
});
return BackendPrinterProxy;
});
