from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model
from .serializers import UtilisateurSerializer

Utilisateur = get_user_model()

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # Les administrateurs peuvent créer/supprimer, les autres peuvent seulement lire/modifier.
        if self.action in ['create', 'destroy']:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
