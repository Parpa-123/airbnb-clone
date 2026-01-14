from rest_framework import generics, authentication, permissions

from .serializers import UserSerializer, AuthenticationSerializer, UserProfileSerializer

from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework_simplejwt.authentication import JWTAuthentication

class CreateUserView(generics.CreateAPIView):

    serializer_class = UserSerializer

class AuthenticationView(TokenObtainPairView):

    serializer_class = AuthenticationSerializer

class AuthenticatedUserView(generics.RetrieveUpdateAPIView):

    serializer_class = UserProfileSerializer

    authentication_classes = [JWTAuthentication]

    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):

        return self.request.user
