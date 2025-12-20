from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class AuthAPIView:
    """
    Base mixin for authenticated API views.
    Provides JWT authentication and requires user to be authenticated.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
