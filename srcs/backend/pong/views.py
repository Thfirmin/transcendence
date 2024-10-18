from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import uuid, json
match_list = []
tournament_list = []

# Create your views here.
# # /pong/match/<match_id>
@csrf_exempt
def	match(request):
	if request.method == 'GET':
		return match_get(request)
	elif request.method == 'POST':
		return match_post(request)
	elif request.method == 'DELETE':
		return match_delete(request)

	return HttpResponse('Hello, World')

# GET /pong/match
# Get match list
def	match_get(request):
	return JsonResponse(match_list, safe=False)

# POST /pong/match
# Subscribe to a match
def	match_post(request):
	player = json.loads(request.body)
	for match in match_list:
		if match["player2"] == None:
			match["player2"] = player
			match["status"] = "in_progress"
			return HttpResponse(str(match["id"]))
	match_id = uuid.uuid4()
	match_list.append({
		"id": match_id,
		"status": "pending",
		"player1": player,
		"player2": None,
	})
	return HttpResponse(str(match_id))

# DELETE /pong/match
# Unsubscribe from a match
def	match_delete(request):
	player = json.loads(request.body)
	for match in match_list:
		if match["player1"] == player or match["player2"] == player:
			if match["status"] == "in_progress":
				match["status"] = "completed"
				return HttpResponse('Match completed')
			elif match["status"] == "pending" or match["status"] == "completed":
				match_list.remove(match)
				return HttpResponse('Match removed')
	return HttpResponse('Match not found')




# /pong/tournament/<tournament_id>/<match_id>

def tournament(request):
	tournament = uuid.uuid4()
	tournament_list.append(tournament)
	return HttpResponse('tournament_{}'.format(tournament))