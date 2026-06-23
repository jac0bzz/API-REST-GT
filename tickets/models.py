from django.contrib.auth.models import AbstractUser
from django.db import models

# 1. MODELO DE USUARIO
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrador'),
        ('support', 'Soporte Técnico'),
        ('user', 'Usuario Estándar'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


# 2. MODELO DE TICKET (Ahora más robusto)
class Ticket(models.Model):
    STATUS_CHOICES = (
        ('open', 'Abierto'),
        ('in_progress', 'En Progreso'),
        ('resolved', 'Resuelto'),
        ('closed', 'Cerrado'),
    )
    PRIORITY_CHOICES = (
        ('low', 'Baja'),
        ('medium', 'Media'),
        ('high', 'Alta'),
        ('critical', 'Crítica'),
    )
    CATEGORY_CHOICES = (
        ('hardware', 'Hardware'),
        ('software', 'Software'),
        ('network', 'Redes / Internet'),
        ('other', 'Otro'),
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tickets_created')
    assigned_to = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets_assigned')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Ticket #{self.id}: {self.title} [{self.get_priority_display()}]"


# 3. NUEVO MODELO: COMENTARIOS (Historial del ticket)
class Comment(models.Model):
    # Relacionamos el comentario con un ticket específico
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments')
    # Quién escribió el comentario
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comentario de {self.author.username} en Ticket #{self.ticket.id}"