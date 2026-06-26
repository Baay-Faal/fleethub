from rest_framework import serializers
from .models import Vehicule

class VehiculeSerializer(serializers.ModelSerializer):
    kilometrage_dernier_entretien = serializers.SerializerMethodField()

    class Meta:
        model = Vehicule
        fields = '__all__'

    def get_kilometrage_dernier_entretien(self, obj):
        dernier_entretien = obj.entretiens.filter(
            type_intervention__in=['VIDANGE', 'REVISION'],
            statut='TERMINE'
        ).order_by('-date_realisation', '-id').first()
        
        return dernier_entretien.kilometrage if dernier_entretien else 0
