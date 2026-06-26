from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="FleetHub API",
      default_version='v1',
      description="API REST pour la gestion de flotte automobile (FleetHub)",
      contact=openapi.Contact(email="contact@fleethub.com"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Swagger Documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Routes API v1
    path('api/v1/', include('apps.utilisateurs.urls')),
    path('api/v1/', include('apps.vehicules.urls')),
    path('api/v1/', include('apps.affectations.urls')),
    path('api/v1/', include('apps.energie.urls')),
    path('api/v1/', include('apps.entretiens.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
