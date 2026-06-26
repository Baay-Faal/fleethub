from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Consommation
from .serializers import ConsommationSerializer

class ConsommationViewSet(viewsets.ModelViewSet):
    queryset = Consommation.objects.all()
    serializer_class = ConsommationSerializer
    permission_classes = [IsAuthenticated]
