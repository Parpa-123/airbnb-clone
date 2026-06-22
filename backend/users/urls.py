from django.urls import path

from . import views

app_name = 'users'

urlpatterns = [

    path('create/', views.CreateUserView.as_view(), name='create'),

    path('token/', views.AuthenticationView.as_view(), name='token_obtain_pair'),

    path('token/refresh/', views.ThrottledTokenRefreshView.as_view(), name='token_refresh'),

    path('me/', views.AuthenticatedUserView.as_view(),name='me')

]
