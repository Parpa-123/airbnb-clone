from rest_framework import serializers

from drf_spectacular.utils import extend_schema_field

from decimal import Decimal

from .models import Listings, ListingImages, Amenities

from users.models import User

class HostSerializer(serializers.ModelSerializer):

    avatar = serializers.SerializerMethodField()

    class Meta:

        model = User

        fields = ["username", "avatar"]

    @extend_schema_field(serializers.URLField)

    def get_avatar(self, obj):

        if obj.avatar:

            return obj.avatar.url if hasattr(obj.avatar, 'url') else str(obj.avatar)

        return None

class ListingImageSerializer(serializers.ModelSerializer):

    image = serializers.SerializerMethodField()

    class Meta:

        model = ListingImages

        fields = ["name", "image"]

    @extend_schema_field(serializers.URLField)

    def get_image(self, obj):

        if obj.image:

            return obj.image.url if hasattr(obj.image, 'url') else str(obj.image)

        return None

class AmenitySerializer(serializers.ModelSerializer):

    display_name = serializers.CharField(source='get_name_display', read_only=True)

    class Meta:

        model = Amenities

        fields = ["name", "display_name"]

class ListingSerializer(serializers.ModelSerializer):

    host = HostSerializer(read_only=True)

    images = ListingImageSerializer(many=True, read_only=True, source="listingimages")

    property_type_display = serializers.CharField(source='get_property_type_display', read_only=True)

    class Meta:

        model = Listings

        fields = [

            "id",

            "host",

            "title",

            "title_slug",

            "country",

            "city",

            "property_type",

            "property_type_display",

            "max_guests",

            "bhk_choice",

            "bed_choice",

            "bathrooms",

            "price_per_night",

            "images",

            "allows_children",

            "allows_infants",

            "allows_pets",

            "created_at",

        ]

        read_only_fields = ["created_at"]

class ListingDetailSerializer(ListingSerializer):

    amenities = AmenitySerializer(many=True, read_only=True)

    class Meta(ListingSerializer.Meta):

        fields = ListingSerializer.Meta.fields + [

            "description",

            "address",

            "updated_at",

            "amenities",

        ]

        read_only_fields = ListingSerializer.Meta.read_only_fields + ["updated_at"]

class CreateUpdateListSerializer(serializers.ModelSerializer):

    amenities = serializers.ListField(

        child=serializers.ChoiceField(choices=Amenities.AMENITY_CHOICES),

        required=False,

        allow_empty=True,

        write_only=True

    )

    title = serializers.CharField(max_length=255, required=True)

    description = serializers.CharField(required=True)

    address = serializers.CharField(max_length=255, required=True)

    country = serializers.CharField(max_length=100, required=True)

    city = serializers.CharField(max_length=100, required=True)

    property_type = serializers.ChoiceField(choices=Listings.PROPERTY_TYPES, required=True)

    max_guests = serializers.IntegerField(required=True)

    bhk_choice = serializers.IntegerField(required=True)

    bed_choice = serializers.IntegerField(required=True)

    bathrooms = serializers.DecimalField(

        max_digits=3,

        decimal_places=1,

        required=True

    )

    price_per_night = serializers.DecimalField(

        max_digits=10,

        decimal_places=2,

        coerce_to_string=False,

        min_value=0,

        required=True,

        error_messages={

            "min_value": "Price must be greater than 0"

        }

    )

    images = ListingImageSerializer(many=True, required=False, write_only=True)

    class Meta:

        model = Listings

        fields = [

            "id",

            "title",

            "description",

            "address",

            "country",

            "city",

            "property_type",

            "max_guests",

            "bhk_choice",

            "bed_choice",

            "bathrooms",

            "price_per_night",

            "amenities",

            "images",

            "allows_children",

            "allows_infants",

            "allows_pets",

        ]

    def validate_max_guests(self, value):

        valid_choices = [choice[0] for choice in Listings.GUEST_COUNT_CHOICES]

        if value not in valid_choices:

            raise serializers.ValidationError(

                f"Invalid choice. Valid options are: {valid_choices}"

            )

        return value

    def validate_bhk_choice(self, value):

        valid_choices = [choice[0] for choice in Listings.BEDROOM_CHOICES]

        if value not in valid_choices:

            raise serializers.ValidationError(

                f"Invalid choice. Valid options are: {valid_choices}"

            )

        return value

    def validate_bed_choice(self, value):

        valid_choices = [choice[0] for choice in Listings.BED_CHOICES]

        if value not in valid_choices:

            raise serializers.ValidationError(

                f"Invalid choice. Valid options are: {valid_choices}"

            )

        return value

    def validate_bathrooms(self, value):

        valid_choices = [choice[0] for choice in Listings.BATHROOM_CHOICES]

        if value not in valid_choices:

            raise serializers.ValidationError(

                f"Invalid choice. Valid options are: {valid_choices}"

            )

        return value

    def validate(self, attrs):

        request = self.context.get('request')

        if request and 'amenities' in request.data:

            amenities_str = request.data.get('amenities')

            if isinstance(amenities_str, str):

                import json

                try:

                    attrs['amenities'] = json.loads(amenities_str)

                except json.JSONDecodeError:

                    pass

        if request and 'delete_images' in request.data:

            delete_images_str = request.data.get('delete_images')

            if isinstance(delete_images_str, str):

                import json

                try:

                    attrs['delete_images'] = json.loads(delete_images_str)

                except json.JSONDecodeError:

                    attrs['delete_images'] = []

        if request and request.FILES:

            image_groups = {}

            for key in request.FILES:

                if key.startswith('images[') and key.endswith(']file'):

                    index = key.split('[')[1].split(']')[0]

                    if index not in image_groups:

                        image_groups[index] = {}

                    image_groups[index]['image'] = request.FILES[key]

            for key in request.data:

                if key.startswith('images[') and key.endswith(']name'):

                    index = key.split('[')[1].split(']')[0]

                    if index not in image_groups:

                        image_groups[index] = {}

                    image_groups[index]['name'] = request.data[key]

            images_list = []

            for index in sorted(image_groups.keys(), key=int):

                img_data = image_groups[index]

                if 'image' in img_data and 'name' in img_data:

                    images_list.append(img_data)

            if images_list:

                attrs['images'] = images_list

        return attrs

    def create(self, validated_data):

        request = self.context.get('request')

        amenities_data = validated_data.pop("amenities", [])

        images_data = validated_data.pop("images", [])

        listing = Listings.objects.create(

            host=request.user,

            **validated_data

        )

        for a in amenities_data:

            amenity, _ = Amenities.objects.get_or_create(name=a)

            listing.amenities.add(amenity)

        for img_data in images_data:

            image_file = img_data.get('image')

            image_name = img_data.get('name')

            if image_file and image_name:

                ListingImages.objects.create(

                    listings=listing,

                    name=image_name,

                    image=image_file

                )

        return listing

    def update(self, instance, validated_data):

        amenities_data = validated_data.pop("amenities", None)

        images_data = validated_data.pop("images", None)

        delete_images = validated_data.pop("delete_images", None)

        for attr, value in validated_data.items():

            setattr(instance, attr, value)

        instance.save()

        if amenities_data is not None:

            instance.amenities.clear()

            for a in amenities_data:

                amenity, _ = Amenities.objects.get_or_create(name=a)

                instance.amenities.add(amenity)

        if delete_images:

            for image_url in delete_images:

                if 'cloudinary.com' in image_url:

                    try:

                        instance.listingimages.filter(image__icontains=image_url.split('/')[-1].split('.')[0]).delete()

                    except:

                        pass

                elif '/media/' in image_url:

                    image_path = image_url.split('/media/')[-1]

                    instance.listingimages.filter(image=image_path).delete()

                else:

                    try:

                        filename = image_url.split('/')[-1]

                        instance.listingimages.filter(name__icontains=filename).delete()

                    except:

                        pass

        if images_data is not None:

            for img_data in images_data:

                image_file = img_data.get('image')

                image_name = img_data.get('name')

                if image_file and image_name:

                    ListingImages.objects.create(

                        listings=instance,

                        name=image_name,

                        image=image_file

                    )

        return instance

    def to_representation(self, instance):

        return ListingDetailSerializer(instance, context=self.context).data
