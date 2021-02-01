odoo.define('pos_cashbox_oybi.cashbox_backend', function (require) {
"use strict";

var core = require('web.core');
var BackendPrinterProxy = require('pos_cashbox_oybi.Printer')
var AbstractAction = require('web.AbstractAction');

var OpenCashboxBackend = AbstractAction.extend({
    init: function(parent, action) {
        this._super(parent, action);
        var options = action.params || {};
        this.iot_ip = options.iot_ip;
        this.identifier = options.identifier;
    },
    start:function(){
        var cashbox = new BackendPrinterProxy({iot_ip: this.iot_ip, identifier: this.identifier});
        cashbox.open_cashbox();
        window.location = "/web#action=point_of_sale.action_client_pos_menu";
    },
});
core.action_registry.add('pos_cashbox_oybi.cashbox_backend', OpenCashboxBackend);
});
