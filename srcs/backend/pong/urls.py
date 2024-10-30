from django.urls import path
from . import views

urlpatterns = [
	path('matchmaker/', views.matchmaker, name='matchmaker'),
	path('matchmaker/<str:id>', views.matchmaker_id, name='matchmaker_id'),
	path('tournament/', views.tournament, name='tournament'),
	path('login/', views.login, name='login'),
]