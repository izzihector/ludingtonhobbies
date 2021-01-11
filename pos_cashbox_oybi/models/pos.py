#-*- coding: utf-8 -*-

import logging

from odoo import models
from odoo.addons.hw_drivers.controllers.driver import iot_devices
from odoo.exceptions import ValidationError

_logger = logging.getLogger(__name__)

class PosConfig(models.Model):
    _inherit = 'pos.config'

    def open_backend_cb(self):
        """Open the cashdrawer associated with this pos.config"""

        _logger.info('Opening Cashdrawer: Sending signal to printer...')

        if not self:
            return False
        if not self.epson_printer_ip:
            raise ValidationError('No printer configured on this PoS Station. Please set up the IP address of the printer in Settings.')

        data = {'action': 'cashbox'}

        printer = next((d for d in iot_devices if iot_devices[d].device_type == 'printer' \
                                and iot_devices[d].device_connection == 'direct' \
                                and iot_devices[d].iot_ip == self.epson_printer_ip), None)
        if printer:
            iot_devices[printer].action(data)
            return True

        raise ValidationError('Connection to the printer failed. Please check if the printer is still connected.')
