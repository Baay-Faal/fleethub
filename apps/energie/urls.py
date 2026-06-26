from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConsommationViewSet

router = DefaultRouter()
router.register(r'consommations', ConsommationViewSet, basename='consommation')

urlpatterns = [
    path('', include(router.urls)),
]
