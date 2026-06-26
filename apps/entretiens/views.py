from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Entretien, AlerteEntretien
from .serializers import EntretienSerializer, AlerteEntretienSerializer

from apps.utilisateurs.models import Notification
from django.contrib.auth import get_user_model

Utilisateur = get_user_model()

class EntretienViewSet(viewsets.ModelViewSet):
    queryset = Entretien.objects.all()
    serializer_class = EntretienSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'CHAUFFEUR':
            entretien = serializer.save(chauffeur=user, statut='EN_ATTENTE_VALIDATION')
            # Notifier les gestionnaires
            gestionnaires = Utilisateur.objects.filter(role__in=['GESTIONNAIRE', 'ADMIN'])
            for g in gestionnaires:
                Notification.objects.create(
                    destinataire=g,
                    message=f"Le chauffeur {user.prenom} {user.nom} a fait une demande d'entretien pour le véhicule {entretien.vehicule.immatriculation}."
                )
        else:
            new_entretien = serializer.save()
            # Mettre à jour le statut du véhicule si créé par un gestionnaire (ex: PLANIFIE)
            if new_entretien.statut in ['PLANIFIE', 'EN_COURS']:
                vehicule = new_entretien.vehicule
                vehicule.statut = 'EN_MAINTENANCE'
                vehicule.save()
                
                from apps.affectations.models import Affectation
                from django.utils import timezone
                Affectation.objects.filter(
                    vehicule=vehicule, 
                    date_fin__isnull=True
                ).update(date_fin=timezone.now().date())

    def perform_update(self, serializer):
        old_entretien = self.get_object()
        old_statut = old_entretien.statut
        new_entretien = serializer.save()
        new_statut = new_entretien.statut

        if old_statut == 'EN_ATTENTE_VALIDATION' and new_statut != 'EN_ATTENTE_VALIDATION':
            if new_entretien.chauffeur:
                if new_statut == 'REFUSE':
                    msg = f"Votre demande d'entretien pour {new_entretien.vehicule.immatriculation} a été refusée."
                else:
                    msg = f"Votre demande d'entretien pour {new_entretien.vehicule.immatriculation} a été acceptée."
                
                Notification.objects.create(
                    destinataire=new_entretien.chauffeur,
                    message=msg
                )

        from apps.affectations.models import Affectation
        from django.utils import timezone
        
        # Logique pour le statut du véhicule
        if new_statut in ['PLANIFIE', 'EN_COURS']:
            vehicule = new_entretien.vehicule
            vehicule.statut = 'EN_MAINTENANCE'
            vehicule.save()
            
            # Fin de mission automatique (Option A)
            Affectation.objects.filter(
                vehicule=vehicule, 
                date_fin__isnull=True
            ).update(date_fin=timezone.now().date())
            
        elif new_statut == 'TERMINE':
            vehicule = new_entretien.vehicule
            vehicule.statut = 'DISPONIBLE'
            vehicule.save()

class AlerteEntretienViewSet(viewsets.ModelViewSet):
    queryset = AlerteEntretien.objects.all()
    serializer_class = AlerteEntretienSerializer
    permission_classes = [IsAuthenticated]
