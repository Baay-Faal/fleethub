from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Entretien, AlerteEntretien
from .serializers import EntretienSerializer, AlerteEntretienSerializer

class EntretienViewSet(viewsets.ModelViewSet):
    queryset = Entretien.objects.all()
    serializer_class = EntretienSerializer
    permission_classes = [IsAuthenticated]

class AlerteEntretienViewSet(viewsets.ModelViewSet):
    queryset = AlerteEntretien.objects.all()
    serializer_class = AlerteEntretienSerializer
    permission_classes = [IsAuthenticated]
