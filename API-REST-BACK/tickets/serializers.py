from rest_framework import serializers
from .models import Ticket, CustomUser, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role']

# NUEVO: Serializador para los comentarios
class CommentSerializer(serializers.ModelSerializer):
    author_detail = UserSerializer(source='author', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'ticket', 'author', 'author_detail', 'message', 'created_at']
        read_only_fields = ['author', 'created_at']

class TicketSerializer(serializers.ModelSerializer):
    created_by_detail = UserSerializer(source='created_by', read_only=True)
    assigned_to_detail = UserSerializer(source='assigned_to', read_only=True)
    
    # Traemos los comentarios asociados a este ticket de forma automática (Lectura)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description', 'status', 'priority', 'category',
            'created_by', 'created_by_detail', 
            'assigned_to', 'assigned_to_detail', 
            'comments', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

        from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

        class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
            @classmethod
            def get_token(cls, user):
                token = super().get_token(user)

                token['username'] = str(user.username)
                token['is_staff'] = bool(user.is_staff)
                return token