from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import uuid, json, random, jwt, datetime

match_list = []
tournament_list = []
secretKey = "pvieira--tde-souz-thfirmin-vchastin"

@csrf_exempt
def login(request):
	# get body request and generate jwt token
	body = json.loads(request.body)
	payload = {
		"exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
		"username": body["username"],
	}
	token = jwt.encode(payload, secretKey, algorithm="HS256")
	return JsonResponse({"token": token})




# Create your views here.
# # /pong/match/<match_id>
@csrf_exempt
def	matchmaker(request):
	if request.method == 'GET':
		return matchmaker_get(request)
	elif request.method == 'POST':
		return matchmaker_post(request)
	elif request.method == 'DELETE':
		return matchmaker_delete(request)

	return HttpResponse('Hello, World')

# GET /pong/match
# Get match list
def	matchmaker_get(request):
	return JsonResponse(match_list, safe=False)

# GET /pong/match/<match_id>
# Get match details
def	matchmaker_id(request, match_id):
	for match in match_list:
		if match["id"] == match_id:
			return JsonResponse(match)
	return HttpResponse('Match not found')

# POST /pong/match
# Subscribe to a match
def	matchmaker_post(request):
	body = json.loads(request.body)
	player = {
		"username": body["username"],
		"token": body["token"],
		"paddle": {
			"width": 10,
			"height": 50,
			"position": 0.5
		}
	}
	for match in match_list:
		if match["player2"] == None:
			match["player2"] = player
			match["status"] = "in_progress"
			return JsonResponse({ "match_id": match["id"] }, safe=False)
	match_id = uuid.uuid4()
	match_list.append({
		"id": match_id,
		"status": "pending",
		"player1": player,
		"player2": None,
		"ball": {
			"size": 4,
			"position": {
				"x": 0.5,
				"y": 0.5
			},
			"speed": 0,
			"direction": {
				"x": random.choice([1, -1]),
				"y": 0
			}
		}
	})
	return JsonResponse({ "match_id": match_id }, safe=False)
	

# DELETE /pong/match
# Unsubscribe from a match
def	matchmaker_delete(request):
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