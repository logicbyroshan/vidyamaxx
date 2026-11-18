from django.urls import path
from .views import (
    CurrentSchoolView,
    PlatformSubscriptionView,
    SubscriptionCancelView,
    SubscriptionPaymentMethodView,
)

urlpatterns = [
    path("schools/current/", CurrentSchoolView.as_view(), name="school-current"),
    path("platform/subscription/", PlatformSubscriptionView.as_view(), name="platform-subscription"),
    path("platform/subscription/payment-method/", SubscriptionPaymentMethodView.as_view(), name="subscription-payment-method"),
    path("platform/subscription/cancel/", SubscriptionCancelView.as_view(), name="subscription-cancel"),
]
