from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Ticket, CustomUser, Comment

# 1. Serializador de Información de Usuarios
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role']

# 2. Serializador para los Comentarios
class CommentSerializer(serializers.ModelSerializer):
    author_detail = UserSerializer(source='author', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'ticket', 'author', 'author_detail', 'message', 'created_at']
        read_only_fields = ['author', 'created_at']

# 3. Serializador para los Tickets
class TicketSerializer(serializers.ModelSerializer):
    created_by_detail = UserSerializer(source='created_by', read_only=True)
    assigned_to_detail = UserSerializer(source='assigned_to', read_only=True)
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

# 4. Token Personalizado (Para meter el Nombre y Rol de Staff encriptados)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = str(user.username)
        token['is_staff'] = bool(user.is_staff)
        return token

# 5. NUEVO: Serializador para el Registro de Usuarios Públicos
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser  # Usamos directamente tu modelo CustomUser
        fields = ('username', 'password')

    def create(self, validated_data):
        # Usamos create_user para encriptar la contraseña en la Base de Datos
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user