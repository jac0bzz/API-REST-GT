from rest_framework import viewsets, permissions
from .models import Ticket, Comment
from .serializers import TicketSerializer, CommentSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'user':
            return Ticket.objects.filter(created_by=user)
        return Ticket.objects.all()


# NUEVO: Controlador para crear y ver comentarios
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatización: Al guardar el comentario, el autor es el usuario logueado
        serializer.save(author=self.request.user)