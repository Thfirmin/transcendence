from django.urls import path
from . import views

urlpatterns = [
	path('match/', views.match, name='match'),
	path('tournament/', views.tournament, name='tournament'),
]