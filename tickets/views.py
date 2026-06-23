from rest_framework import viewsets, permissions
from .models import Ticket
from .serializers import TicketSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    # Obligamos a que el usuario esté autenticado con su Token para interactuar con los tickets
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatización: Cuando se crea un ticket, Django le amarra automáticamente el usuario que está logueado
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        # Lógica de Roles:
        # Si es un usuario común, SOLO puede ver sus propios tickets creados.
        if user.role == 'user':
            return Ticket.objects.filter(created_by=user)
        # Si es Administrador o Soporte, puede ver ABSOLUTAMENTE TODOS los tickets del sistema.
        return Ticket.objects.all()