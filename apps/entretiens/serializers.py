from rest_framework import serializers
from .models import Entretien, AlerteEntretien

class EntretienSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entretien
        fields = '__all__'
        read_only_fields = ('cree_par',)

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['cree_par'] = request.user
        return super().create(validated_data)

class AlerteEntretienSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlerteEntretien
        fields = '__all__'
