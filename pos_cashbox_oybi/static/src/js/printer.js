odoo.define('pos_cashbox_oybi.Printer', function (require) {
"use strict";

var core = require('web.core');
var PrinterMixin = require('point_of_sale.Printer').PrinterMixin;

var CashboxEpsonPrinter = core.Class.extend(PrinterMixin, {
    init: function (ip) {
        PrinterMixin.init.call(this, arguments);
        this.ePOSDevice = new epson.ePOSDevice();
        var port = window.location.protocol === 'http:' ? '8008' : '8043';
        this.ePOSDevice.connect(ip, port, this.callback_connect.bind(this), {eposprint: true});
    },

    callback_connect: function (resultConnect) {
        var self = this;
        var deviceId = 'local_printer';
        var options = {'crypto' : false, 'buffer' : false};
        if ((resultConnect == 'OK') || (resultConnect == 'SSL_CONNECT_OK')) {
            this.ePOSDevice.createDevice(deviceId, this.ePOSDevice.DEVICE_TYPE_PRINTER, options, this.callback_createDevice.bind(this));
        } else {
            alert('Connection to the printer failed: Please check if the printer is still connected, if the configured IP address is correct and if your printer supports the ePOS protocol.')
        }
        window.location = "/web#action=point_of_sale.action_client_pos_menu";
    },

    callback_createDevice: function (deviceObj, errorCode) {
        var self = this;
        if (deviceObj === null) {
            alert('Connection to the printer failed: Please check if the printer is still connected. Error code: ' + errorCode)
            return;
        }
        this.printer = deviceObj;
        this.printer.onreceive = function(response){
            if (!response.success) {
                alert('Epson ePOS Error: An error happened while sending data to the printer. Error code: ' + response.code)
            }
        };
        window.location = "/web#action=point_of_sale.action_client_pos_menu";
    },

    /**
     * @override
     */
    open_cashbox: function () {
        if (this.printer) {
            this.printer.addPulse();
            this.printer.send();
        }
        alert('Cashbox opened.')
    },
});

return CashboxEpsonPrinter;

});
