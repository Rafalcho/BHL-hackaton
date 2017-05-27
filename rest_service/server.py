from flask import Flask, request
from flask_restful import Resource, Api
from pymongo import MongoClient
import json
import datetime as dt
import time
from multiprocessing import Process
import logging
from .settings import SECONDS_THRESHOLD, PERIOD_TIME_SECONDS_CLEANING_PATROL


app = Flask(__name__)
api = Api(app)
mongo_client = MongoClient()['bhl']
logging.basicConfig(format='%(level)s -> %(asctime)s -> %(message)s')


def cleaner_patrol_worker(seconds_threshold, period_time_seconds):
    while True:
        for entity in mongo_client['patrols'].find():
            if (dt.datetime.now() - dt.datetime.fromtimestamp(entity['time'])).total_seconds() > seconds_threshold:
                mongo_client['patrols'].remove(entity)
        logging.info("Cleaning process.")
        time.sleep(period_time_seconds)


class Patrols(Resource):
    def get(self):
        pass

    def post(self):
        entity = {'x': request.args['x'], 'y': request.args['x'],
                  'time': dt.datetime.now().timestamp(), 'description': request.args['description']}
        mongo_client['patrols'].insert(entity)
        return json.dumps(entity), 201


api.add_resource(Patrols, '/patrols/')

if __name__ == '__main__':
    app.run(port=8080, address='0.0.0.0')
    Process(target=cleaner_patrol_worker, args=(SECONDS_THRESHOLD, PERIOD_TIME_SECONDS_CLEANING_PATROL)).run()
