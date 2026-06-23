from rest_framework import viewsets, permissions, generics
from rest_framework.permissions import AllowAny
from .models import Ticket, Comment, CustomUser
from .serializers import TicketSerializer, CommentSerializer, RegisterSerializer

# 1. Controlador para los Tickets
class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if not user.is_staff:
            return Ticket.objects.filter(created_by=user).order_by('-id')
        return Ticket.objects.all().order_by('-id')


# 2. Controlador para los Comentarios
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# 3. NUEVO: Controlador para el Registro de Usuarios (¡Afuera y libre de tabulaciones!)
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]  # Permite acceso público sin tokens
    serializer_class = RegisterSerializer