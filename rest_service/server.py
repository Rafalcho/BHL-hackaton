from flask import Flask, request
from flask_restful import Resource, Api
from pymongo import MongoClient
import json
import math
from .settings import RADIUS

app = Flask(__name__)
api = Api(app)
mongo_client = MongoClient()['bhl']


class Patrols(Resource):
    def get(self):
        pass

    def post(self):
        entity = {'x': request.args['x'], 'y': request.args['x'],
                  'time': request.args['time'], 'description': request.args['description']}
        mongo_client['patrol'].insert(entity)
        return json.dumps(entity), 201

    def find_patrol(self):

        args = request.args
        client_x = args['x']
        client_y = args['y']
        radius = args['rad']

        posts = mongo_client.posts
        patrols = []

        for post in posts.find():
            if self.points2distance(client_x, client_y, post['x'], post['y']) < radius:
                patrols.append(post)

        return json.dumps(patrols)


    def points2distance(self, olat, olng, dlat, dlong):
        start_long = math.radians(olng)
        start_latt = math.radians(olat)
        end_long = math.radians(dlong)
        end_latt = math.radians(dlat)
        d_latt = end_latt - start_latt
        d_long = end_long - start_long
        a = math.sin(d_latt / 2) ** 2 + math.cos(start_latt) * math.cos(end_latt) * math.sin(d_long / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        return 6371 * c


api.add_resource(HelloWorld, '/')

if __name__ == '__main__':
    app.run(debug=True)
