#-*- coding: utf-8 -*-

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
        if not self.epson_printer_ip:
            raise ValidationError('No printer configured on this PoS Station. Please set up the IP address of the printer in the session\'s Settings.')

        return {
            'type': 'ir.actions.client',
            'target': 'current',
            'tag': 'pos_cashbox_oybi.cashbox_backend',
            'params': {'ip': self.epson_printer_ip}
        }
