from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tickets.views import TicketViewSet, CommentViewSet # <--- Importamos CommentViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'comments', CommentViewSet, basename='comment') # <--- NUEVA RUTA

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),
]