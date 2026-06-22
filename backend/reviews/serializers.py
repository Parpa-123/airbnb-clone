from rest_framework import serializers

from drf_spectacular.utils import extend_schema_field

from .models import Review
from bookings.models import Bookings
from users.serializers import UserSerializer

class ReviewSerializer(serializers.ModelSerializer):
    avg_rating = serializers.SerializerMethodField()
    listing = serializers.PrimaryKeyRelatedField(read_only=True)
    user = UserSerializer(read_only=True)
    booking = serializers.PrimaryKeyRelatedField(queryset=Bookings.objects.all(), write_only=True)

    @extend_schema_field(serializers.FloatField)

    def get_avg_rating(self,obj):

        return obj.get_avg_rating()

    class Meta:

        model = Review

        fields = '__all__'

        read_only_fields = ('listing', 'user', 'created_at', 'updated_at', )

        extra_kwargs = {

            'avg_rating': {'read_only': True}

        }

    def validate(self, attrs):

        booking = attrs.get('booking')

        user = self.context['request'].user

        if not booking:

            raise serializers.ValidationError('Booking is required')

        if booking.guest != user:

            raise serializers.ValidationError('You are not the guest of this booking')

        attrs.pop('booking', None)
        return attrs
