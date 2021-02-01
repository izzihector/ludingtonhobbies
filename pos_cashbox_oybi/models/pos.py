#-*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

import logging

from odoo import models
from odoo.exceptions import ValidationError

_logger = logging.getLogger(__name__)

class PosConfig(models.Model):
    _inherit = 'pos.config'

    def open_backend_cashdrawer(self):
        """Open the cashdrawer associated with this pos.config"""

        _logger.info('Opening Cashdrawer: Sending signal to printer...')

        if not self:
            return False
        if not self.iface_printer_id or not self.iface_printer_id.iot_id or not self.iface_printer_id.iot_id.ip:
            raise ValidationError('No printer configured on this PoS Station. Please configure the printer in this station\'s IoT box Settings.')

        return {
            'type': 'ir.actions.client',
            'tag': 'pos_cashbox_oybi.cashbox_backend',
            'params': {'iot_ip': self.iface_printer_id.iot_id.ip, 'identifier': self.iface_printer_id.identifier}
        }
