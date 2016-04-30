from flask import Flask, request, Response

import os
import json
import pickle
from collections import Counter
from random import randint

from sklearn.cluster import KMeans
from sklearn.cluster import DBSCAN

import numpy as np

app = Flask(__name__, static_url_path='/static')

# Run kmeans clustering iteratively with k=4
def perform_kmeans(data, k=4):
	cluster_data = [[point["x"], point["y"]] for point in data]
	kmeans = KMeans(n_clusters = k, n_jobs = 1)
	kmeans.fit(cluster_data)
	return kmeans

# def perform_dbscan(data):
# 	cluster_data = [[point["x"], point["y"]] for point in data]
# 	db = DBSCAN(eps=0.3, min_samples=5).fit(cluster_data)
# 	return db

def check_outlier(model, data):
	a = [data["2005"]["x"], data["2005"]["y"]]
	dist = []
	for i in xrange(len(model.cluster_centers_)):
		b = model.cluster_centers_[i]
		dist.append({str(i): str(np.linalg.norm(a-b))})

	for i in range(0, len(model.cluster_centers_)):
		for j in range(i+1, len(model.cluster_centers_)):
			a = model.cluster_centers_[i]
			b = model.cluster_centers_[j]
			dist.append({str(i)+str(j) :str(np.linalg.norm(a-b))})
	return dist


@app.route('/word')
def get_word_data():
	query = request.args.get('q')
	word_data_file = 'data/words/{}_points_filtered.pkl'.format(query)
	word_data = pickle.load(open(word_data_file))
	scaling_factor = 10

	resp = {}
	resp["word"] = word_data[0]

	other_words = word_data[1]
	other_coords = []
	for word in other_words:
		other_coords.append({"word":word[-1],"x":word[0]*scaling_factor,"y":word[1]*scaling_factor})

	model = perform_kmeans(other_coords)
	# model = perform_dbscan(other_coords)
	for i in xrange(len(other_coords)):
		other_coords[i]['c'] = str(model.labels_[i])
	resp["other_words"]	= other_coords

	timeseries = word_data[2]
	# word_coords = []
	word_coords = {}
	for year_data in timeseries:
		# word_coords.append({"word":query,"year":int(year_data[0]),"x":year_data[1]*scaling_factor,"y":year_data[2]*scaling_factor})
		# word_coords[year_data[0]] = (year_data[1],year_data[2])
		word_coords[year_data[0]] = {"x":year_data[1]*scaling_factor,"y":year_data[2]*scaling_factor}

	resp["outlier"] = check_outlier(model, word_coords)
	resp["timeseries"]	= word_coords

	return Response(response=json.dumps(resp), mimetype="application/json")

@app.route('/word_cloud')
def get_word_cloud_weights():
	data_folder1 = "./data/sample"
	data_folder2 = "./data/words"
	files = {}
	for subdirname in os.listdir(data_folder1):
		files[subdirname.split("_")[0]] = randint(10,30)
	for subdirname in os.listdir(data_folder2):
		files[subdirname.split("_")[0]] = randint(10,30)

	cloud = []
	for key in files:
		tmp = {}
		tmp["text"] = key
		tmp["size"] = files[key]
		cloud.append(tmp)
	# keys = files.keys()
	# print len(files.keys())

	return Response(response=json.dumps(cloud), mimetype="application/json")
	# return cloud

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)