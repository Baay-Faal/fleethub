from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Consommation
from .serializers import ConsommationSerializer

from apps.utilisateurs.models import Notification
from apps.entretiens.models import Entretien
from django.contrib.auth import get_user_model

class ConsommationViewSet(viewsets.ModelViewSet):
    queryset = Consommation.objects.all()
    serializer_class = ConsommationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        consommation = serializer.save()
        vehicule = consommation.vehicule
        
        dernier_entretien = Entretien.objects.filter(vehicule=vehicule, statut='TERMINE').order_by('-kilometrage').first()
        km_reference = dernier_entretien.kilometrage if dernier_entretien else 0
        
        if consommation.kilometrage - km_reference >= 15000:
            User = get_user_model()
            gestionnaires = User.objects.filter(role__in=['GESTIONNAIRE', 'ADMIN'])
            for g in gestionnaires:
                Notification.objects.create(
                    destinataire=g,
                    message=f"Alerte Kilométrage : Le véhicule {vehicule.immatriculation} nécessite un entretien (>{consommation.kilometrage} km)."
                )
