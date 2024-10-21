from django.urls import path
from . import views

urlpatterns = [
	path('match/', views.match, name='match'),
	path('match/<str:match_id>', views.match_id, name='match_id'),
	path('tournament/', views.tournament, name='tournament'),
]