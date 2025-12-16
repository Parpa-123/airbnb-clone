from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


class UserSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ['email', 'username', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8}
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username', 'phone', 'avatar','password','is_host']
        read_only_fields = ['username','is_host']
        extra_kwargs = {
            'password' : {'write_only':True,'min_length':8},
            'avatar' : {'required':False},
            'phone' : {'required':False},
        }

    def validate_phone(self, value):
    
        if not value or value == '':
            return None
        return value
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user


class AuthenticationSerializer(TokenObtainPairSerializer):
    username_field = 'username'

    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    


    def validate(self, attrs):
        if not User.objects.filter(username=attrs.get("username")).exists():
            raise serializers.ValidationError("User doesn't exist. Please sign up first.")
        return super().validate(attrs)
