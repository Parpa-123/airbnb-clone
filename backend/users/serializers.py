from rest_framework import serializers

from rest_framework.validators import UniqueValidator

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User

from drf_spectacular.utils import extend_schema_field

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

from conf.cloudinary_utils import delete_cloudinary_asset

class UserProfileSerializer(serializers.ModelSerializer):

    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:

        model = User

        fields = ['email', 'username', 'phone', 'avatar', 'password', 'is_host']

        read_only_fields = ['username', 'is_host']

        extra_kwargs = {

            'password': {'write_only': True, 'min_length': 8, 'required': False},

            'phone': {'required': False},

        }

    def validate_avatar(self, value):
        if value:
            # 5MB limit
            if hasattr(value, 'size') and value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Avatar file size cannot exceed 5MB.")
            
            content_type = getattr(value, 'content_type', '')
            if content_type and not content_type.startswith('image/'):
                raise serializers.ValidationError("File must be a valid image (JPEG, PNG, WEBP, etc.).")
        return value

    def validate_phone(self, value):

        if not value or value == '':

            return None

        return value

    def update(self, instance, validated_data):

        password = validated_data.pop('password', None)
        new_avatar = validated_data.get('avatar', None)

        # If a new avatar is uploaded, delete the old Cloudinary asset
        if new_avatar is not None and instance.avatar and instance.avatar != new_avatar:
            delete_cloudinary_asset(instance.avatar)

        user = super().update(instance, validated_data)

        if password:

            user.set_password(password)

            user.save()

        return user

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data['avatar'] = instance.avatar.url if hasattr(instance.avatar, 'url') else str(instance.avatar)
        else:
            data['avatar'] = None
        return data

class AuthenticationSerializer(TokenObtainPairSerializer):

    username_field = 'username'

    username = serializers.CharField(write_only=True)

    password = serializers.CharField(write_only=True)

    def validate(self, attrs):

        if not User.objects.filter(username=attrs.get("username")).exists():

            raise serializers.ValidationError("User doesn't exist. Please sign up first.")

        return super().validate(attrs)
