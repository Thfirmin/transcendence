import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json

# receber uma mensagem, adicionar ao array e enviar tudo que foi guardado

# class HelloWorldConsumer(AsyncWebsocketConsumer):
# 	async def connect(self):
# 		self.messages = []
# 		self.room_group_name = self.scope['url_route']['kwargs']['id']
# 		await self.accept()
# 		# conectar a um canal
# 		await self.channel_layer.group_add(
# 			self.room_group_name,
# 			self.channel_name
# 		)
# 		#await self.send(text_data=json.dumps({'message': 'Hello World'}))

# 	async def receive(self, text_data):
# 		data = json.loads(text_data)
# 		#self.messages.append(data['message'])
# 		await self.channel_layer.group_send(
# 			self.room_group_name,
# 			{
# 				'type': 'hello_message',
# 				'message': data['message']
# 			}
# 		)

# 	async def hello_message(self, event):
# 		message = event['message']
# 		self.messages.append(message)
# 		await self.send(text_data=json.dumps({'message': self.messages}))

# 	async def disconnect(self, close_code):
# 		# desconectar do canal
# 		await self.channel_layer.group_discard(
# 			self.room_group_name,
# 			self.channel_name
# 		)

#@method_decorator(csrf_exempt, name='dispatch')
class	PongConsumer(AsyncWebsocketConsumer):
	# Entrar na sala do jogo
	async def connect(self):
		# array de players
		self.players = []
		# Enrar na sala do channel
		#self.room_group_name = "pla"
		self.room_group_name = self.scope['url_route']['kwargs']['id']
		self.players.append(self)
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		# aceitar conexão
		await self.accept()
		await self.channel_layer.group_send(
			self.room_group_name,
			{
				'type': 'hello_message',
				'message': 'Hello World'
			}
		)

	# Sair da sala do jogo
	async def disconnect(self, close_code):
		# sair da sala do channel
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
		self.players.remove(self)
		#if len(self.players) == 0:
		#	self.stop_game_loop()

	# Receber peido de stado do jogo
	async def receive(self, text_data):
		pass
		#data = json.loads(text_data)
		#if data['type'] == 'join':
		#	self.players.append(self)
		#	if len(self.players) == 2:
		#		await self.start_game_loop()

	# processar o jogo
	async def game_loop(self):
		while len(self.players) == 2:
			game_data = {
				'type': 'game_update',
				'data': 'game state information'
			}
			await self.send_to_players(game_data)
			await asyncio.sleep(1/60)

	async def hello_message(self, event):
		message = event['message']
		await self.send(text_data=json.dumps({'message': message}))
	# enviar o estado para os players
	#async def send_to_players(self, message):
	#	for player in self.players:
	#		await player.send(text_data=json.dumps(message))

#class PongConsumer(AsyncWebsocketConsumer):
#	async def connect(self):
#		self.players = []
#		await self.accept()
#
#	async def disconnect(self, close_code):
#		self.players.remove(self)
#		if len(self.players) == 0:
#			self.stop_game_loop()
#
#	async def receive(self, text_data):
#		data = json.loads(text_data)
#		if data['type'] == 'join':
#			self.players.append(self)
#			if len(self.players) == 2:
#				await self.start_game_loop()
#
#	async def start_game_loop(self):
#		while len(self.players) == 2:
#			game_data = {
#				'type': 'game_update',
#				'data': 'game state information'
#			}
#			await self.send_to_players(game_data)
#			await asyncio.sleep(1/60)
#
#	async def send_to_players(self, message):
#		for player in self.players:
#			await player.send(text_data=json.dumps(message))