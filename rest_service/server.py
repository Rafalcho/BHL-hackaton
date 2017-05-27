from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from pymongo import MongoClient
import json
import datetime as dt
import time
from multiprocessing import Process
import logging
from settings import SECONDS_THRESHOLD, PERIOD_TIME_SECONDS_CLEANING_PATROL
import math
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
api = Api(app)
mongo_client = MongoClient()['bhl']
logging.basicConfig(format='%(asctime)s -> %(message)s', level=logging.INFO)


def cleaner_patrol_worker(seconds_threshold, period_time_seconds):
    while True:
        for entity in mongo_client['patrols'].find():
            if (dt.datetime.now() - dt.datetime.fromtimestamp(entity['time'])).total_seconds() > seconds_threshold:
                mongo_client['patrols'].remove(entity)
        logging.info("Cleaning process.")
        time.sleep(period_time_seconds)


def _points_to_distance(olat, olng, dlat, dlong):
    start_long = math.radians(olng)
    start_latt = math.radians(olat)
    end_long = math.radians(dlong)
    end_latt = math.radians(dlat)
    d_latt = end_latt - start_latt
    d_long = end_long - start_long
    a = math.sin(d_latt / 2) ** 2 + math.cos(start_latt) * math.cos(end_latt) * math.sin(d_long / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))
    return 6371 * c


class Patrols(Resource):
    def get(self):
        args = request.args
        client_x = float(args['x'])
        client_y = float(args['y'])
        radius = float(args['rad'])

        posts = mongo_client['patrols']
        patrols = []

        for post in posts.find():
            if _points_to_distance(client_x, client_y, post['x'], post['y']) < radius:
                patrols.append({"x": post["x"], "y": post["y"],
                                "time": post["time"], "description": post["description"]})
        logging.info("GET request on /patrols/")
        return json.dumps(patrols), 200

    def post(self):
        print (request.data)
        data = json.loads(request.data.decode())
        print (data)
        entity = {'x': float(data['x']), 'y': float(data['y']),
                  'time': dt.datetime.now().timestamp(), 'description': data['description']}
        to_response = json.dumps(entity)
        print(entity)
        mongo_client['patrols'].insert(entity)
        mongo_client['patrols'].save(entity)
        logging.info("POST request on /patrols/")
        return to_response, 201


class Parties(Resource):
    def get(self):
        args = request.args
        client_x = float(args['x'])
        client_y = float(args['y'])
        radius = float(args['rad'])

        posts = mongo_client['parties']
        patrols = []

        for post in posts.find():
            if _points_to_distance(client_x, client_y, post['x'], post['y']) < radius:
                patrols.append({"x": post["x"], "y": post["y"],
                                "description": post["description"]})
        logging.info("GET request on /parties/")
        return json.dumps(patrols), 200


    def post(self):
        print (request.data)
        data = json.loads(request.data.decode())
        entity = {'x': float(data['x']), 'y': float(data['y']),
                   'description': data['description']}
        to_response = json.dumps(entity)
        print(entity)
        mongo_client['parties'].insert(entity)
        mongo_client['parties'].save(entity)
        logging.info("POST request on /parties/")
        return to_response, 201




api.add_resource(Patrols, '/patrols/')
api.add_resource(Parties, '/parties/')


if __name__ == '__main__':
    Process(target=cleaner_patrol_worker, args=(SECONDS_THRESHOLD, PERIOD_TIME_SECONDS_CLEANING_PATROL)).start()
    context = ('domain.crt', 'domain.key')
    app.run(port=8080, host='0.0.0.0', ssl_context=context)
