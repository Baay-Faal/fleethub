from rest_framework import serializers
from .models import Entretien, AlerteEntretien

from apps.utilisateurs.serializers import UtilisateurSerializer
from apps.vehicules.serializers import VehiculeSerializer

class EntretienSerializer(serializers.ModelSerializer):
    chauffeur_details = UtilisateurSerializer(source='chauffeur', read_only=True)
    vehicule_details = VehiculeSerializer(source='vehicule', read_only=True)

    class Meta:
        model = Entretien
        fields = '__all__'
        read_only_fields = ('cree_par', 'chauffeur')

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['cree_par'] = request.user
        return super().create(validated_data)

class AlerteEntretienSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlerteEntretien
        fields = '__all__'
