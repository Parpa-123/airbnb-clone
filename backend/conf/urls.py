from django.contrib import admin

from django.urls import path, include

from drf_spectacular.views import (

    SpectacularAPIView,

    SpectacularSwaggerView,

    SpectacularRedocView,

)

from django.conf.urls.static import static

from django.conf import settings

urlpatterns = [

    path('admin/', admin.site.urls),

    path('api/', include('users.urls')),

    path("api/listings/", include("listings.urls", namespace="listing")),

    path("api/bookings/", include("bookings.urls", namespace="booking")),

    path("api/reviews/", include("reviews.urls", namespace="review")),

    path("api/wishlist/", include("wishlist.urls", namespace="wishlist")),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),

    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

]

if settings.DEBUG:

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
