from flask import Flask, request
from flask_restful import Resource, Api
from pymongo import MongoClient
import json


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


class Alert(Resource):
    def get(self):
        pass


api.add_resource(HelloWorld, '/')

if __name__ == '__main__':
    app.run(debug=True)
