from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
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

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def accepter_cgu(self, request):
        user = request.user
        user.cgu_acceptees = True
        user.save()
        return Response({"status": "CGU acceptées avec succès", "cgu_acceptees": True})

from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(destinataire=self.request.user)

    @action(detail=False, methods=['get'])
    def non_lues(self, request):
        notifs = self.get_queryset().filter(est_lu=False)
        serializer = self.get_serializer(notifs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def marquer_lu(self, request, pk=None):
        notif = self.get_object()
        notif.est_lu = True
        notif.save()
        return Response({'status': 'notification marked as read'})
