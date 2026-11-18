"""
VidyaFloww Shared View & Serializer Mixins
"""


class TenantViewMixin:
    """Helper mixin providing authenticated school/branch extraction on DRF views."""

    def get_school(self):
        return getattr(self.request, "school", None)

    def get_branch(self):
        return getattr(self.request, "branch", None)

    def get_membership(self):
        return getattr(self.request, "membership", None)
