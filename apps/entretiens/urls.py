from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EntretienViewSet, AlerteEntretienViewSet

router = DefaultRouter()
router.register(r'entretiens', EntretienViewSet, basename='entretien')
router.register(r'alertes', AlerteEntretienViewSet, basename='alerte')

urlpatterns = [
    path('', include(router.urls)),
]
