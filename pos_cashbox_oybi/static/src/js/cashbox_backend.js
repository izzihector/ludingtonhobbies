odoo.define('pos_cashbox_oybi.cashbox_backend', function (require) {
"use strict";

var core = require('web.core');
var CashboxEpsonPrinter = require('pos_cashbox_oybi.Printer')
var AbstractAction = require('web.AbstractAction');

var OpenCashboxBackend = AbstractAction.extend({
    init: function(parent, action) {
        this._super(parent, action);
        var options = action.params || {};
        this.ip = options.ip;
    },
    start:function(){
        var cashbox = new CashboxEpsonPrinter(this.ip);
        cashbox.open_cashbox()
    },
});

core.action_registry.add('pos_cashbox_oybi.cashbox_backend', OpenCashboxBackend);

});
