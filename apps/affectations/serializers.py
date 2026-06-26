from rest_framework import serializers
from .models import Affectation

class AffectationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Affectation
        fields = '__all__'
        read_only_fields = ('cree_par',)

    def create(self, validated_data):
        # Assigne automatiquement l'utilisateur connecté comme créateur de l'affectation
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['cree_par'] = request.user
        return super().create(validated_data)
