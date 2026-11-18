"""
VidyaFloww Inventory Consumables (#16) & Fixed Assets / Maintenance (#17) Models
"""

from decimal import Decimal
from django.db import models
from common.models import TenantScopedModel


class InventoryStockItem(TenantScopedModel):
    """School consumable store item (Work Division #16 Inventory)."""

    sku_code = models.CharField(max_length=50)
    item_name = models.CharField(max_length=150)
    category = models.CharField(max_length=80, default="Lab Consumables")
    quantity_on_hand = models.PositiveIntegerField(default=50)
    reorder_threshold = models.PositiveIntegerField(default=10)
    unit_label = models.CharField(max_length=30, default="Units")

    class Meta:
        db_table = "inventory_stock_item"
        ordering = ["item_name"]


class FixedAssetRecord(TenantScopedModel):
    """Institutional fixed asset & maintenance log (Work Division #17 Assets & Maintenance)."""

    asset_tag = models.CharField(max_length=50)
    asset_name = models.CharField(max_length=150)
    location_room = models.CharField(max_length=80, default="Computer Lab 1")
    purchase_value_inr = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("45000.00"))
    condition_status = models.CharField(max_length=30, default="Operational")  # Operational | Under Maintenance | Retired
    last_service_notes = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        db_table = "inventory_fixed_asset"
        ordering = ["asset_tag"]
