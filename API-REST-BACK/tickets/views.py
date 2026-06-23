from rest_framework import viewsets, permissions
from .models import Ticket, Comment
from .serializers import TicketSerializer, CommentSerializer

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


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)