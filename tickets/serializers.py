from rest_framework import serializers
from .models import Ticket, CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role']

class TicketSerializer(serializers.ModelSerializer):
    # Mostramos los datos del creador y asignado usando el serializador de arriba (solo lectura)
    created_by_detail = UserSerializer(source='created_by', read_only=True)
    assigned_to_detail = UserSerializer(source='assigned_to', read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description', 'status', 
            'created_by', 'created_by_detail', 
            'assigned_to', 'assigned_to_detail', 
            'created_at', 'updated_at'
        ]
        # El creador del ticket se asignará automáticamente en la vista, no lo envía el usuario
        read_only_fields = ['created_by', 'created_at', 'updated_at']