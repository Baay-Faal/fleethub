from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Vehicule
from .serializers import VehiculeSerializer

class VehiculeViewSet(viewsets.ModelViewSet):
    queryset = Vehicule.objects.all()
    serializer_class = VehiculeSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        vehicules = Vehicule.objects.filter(statut='DISPONIBLE')
        serializer = self.get_serializer(vehicules, many=True)
        return Response(serializer.data)
