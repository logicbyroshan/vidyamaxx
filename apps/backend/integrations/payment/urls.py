from django.urls import path
from .views import PaymentGatewayWebhookView, PaymentOrderCreateView

urlpatterns = [
    path("orders/", PaymentOrderCreateView.as_view(), name="integrations-payment-order"),
    path("webhook/", PaymentGatewayWebhookView.as_view(), name="integrations-payment-webhook"),
]
