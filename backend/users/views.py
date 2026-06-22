from rest_framework import generics, permissions
from rest_framework.throttling import ScopedRateThrottle

from .serializers import UserSerializer, AuthenticationSerializer, UserProfileSerializer

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from rest_framework_simplejwt.authentication import JWTAuthentication

class CreateUserView(generics.CreateAPIView):

    serializer_class = UserSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_signup"

class AuthenticationView(TokenObtainPairView):

    serializer_class = AuthenticationSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_login"


class ThrottledTokenRefreshView(TokenRefreshView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_refresh"

class AuthenticatedUserView(generics.RetrieveUpdateAPIView):

    serializer_class = UserProfileSerializer

    authentication_classes = [JWTAuthentication]

    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):

        return self.request.user
