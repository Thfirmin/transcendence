from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
	re_path(r'ws/match/(?P<id>\w+)/$', consumers.PongConsumer.as_asgi()),
	#re_path(r'ws/matc/$', consumers.HelloWorldConsumer.as_asgi()),
]