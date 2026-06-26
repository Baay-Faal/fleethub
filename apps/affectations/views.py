from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Affectation
from .serializers import AffectationSerializer

from apps.utilisateurs.models import Notification

class AffectationViewSet(viewsets.ModelViewSet):
    queryset = Affectation.objects.all()
    serializer_class = AffectationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        affectation = serializer.save()
        
        # Mettre à jour le statut du véhicule
        vehicule = affectation.vehicule
        vehicule.statut = 'EN_UTILISATION'
        vehicule.save()
        
        # Création de la notification pour le chauffeur
        Notification.objects.create(
            destinataire=affectation.chauffeur,
            message=f"Vous avez été affecté au véhicule {affectation.vehicule.immatriculation}."
        )
