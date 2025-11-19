from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email','username','password']
        extra_kwargs = {'password':{'write_only':True,'min_length':5}}
        
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
    def update(self, instance, validated_data):
        password = self.validated_data.pop('password',None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        # Example 2 (continued): Perform updates on related objects
        # if related_data:
        #     # Logic to update related model instances using the related_data
        #     pass

        # Return the final updated instance
        return user

class AuthenticationSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    username = serializers.CharField()

    def validate(self,attr):
        attr['username'] = attr.get('username')
        attr['email'] = attr.get('email')

        return super().validate(attr)