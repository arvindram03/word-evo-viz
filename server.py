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

def getKey(obj):
	return obj["x"]

@app.route('/outlier')
def outlier_check():
	if os.path.exists("data/outlier.json"):
		with open("data/outlier.json", "r") as f:
			return Response(response=f.read(), mimetype="application/json")

	words = get_all_words()
	target_words = []
	outlier_data = []
	for word in words:
		count = 0
		data, model = transform_word_data(word)
		word_data = {"word": word};
		word_data["points"] = []
		for year in data["timeseries"]:
			target = [data["timeseries"][year]["x"], data["timeseries"][year]["y"]]
			target_dist_sum = 0
			for i in xrange(len(model.cluster_centers_)):
				c = model.cluster_centers_[i]
				target_dist = np.linalg.norm(target-c)
				points_dist = []

				for point in data["other_words"]:
					if int(point['c']) == i:
						a = [point['x'], point['y']]
						points_dist.append(np.linalg.norm(a-c))

				target_dist_sum += target_dist

				if year == "2005":
					# print i, target_dist, max(points_dist)
					if target_dist >= max(points_dist):
						count += 1

			word_data["points"].append({"x": year, "y": str(target_dist_sum)})
			word_data["points"] = sorted(word_data["points"], key=getKey)
		outlier_data.append(word_data)

		if count == 4:
			target_words.append(word)

	resp = {"outlier": outlier_data, "target_words": target_words}
	with open("data/outlier.json", "w") as f:
		f.write(json.dumps(resp))

	return Response(response=json.dumps(resp), mimetype="application/json")

def transform_word_data(word):
	word_data_file = 'data/words/{}_points_filtered.pkl'.format(word)
	word_data = pickle.load(open(word_data_file))
	scaling_factor = 10

	other_words = word_data[1]
	other_coords = []
	for word in other_words:
		other_coords.append({	"word":word[-1],
								"x":word[0]*scaling_factor,
								"y":word[1]*scaling_factor})

	model = perform_kmeans(other_coords)
	# model = perform_dbscan(other_coords)
	for i in xrange(len(other_coords)):
		other_coords[i]['c'] = str(model.labels_[i])

	timeseries = word_data[2]
	word_coords = {}
	for year_data in timeseries:
		word_coords[year_data[0]] = {	"x":year_data[1]*scaling_factor,
										"y":year_data[2]*scaling_factor}

	resp = {}
	resp["word"] = word_data[0]
	resp["other_words"]	= other_coords
	resp["timeseries"]	= word_coords

	return resp, model

@app.route('/word')
def get_word_data():
	query = request.args.get('q')
	resp, m = transform_word_data(query)
	return Response(response=json.dumps(resp), mimetype="application/json")

def get_all_words():
	data_folder1 = "./data/sample"
	data_folder2 = "./data/words"
	files = {}
	for subdirname in os.listdir(data_folder1):
		if subdirname.find(".DS_") > -1:
			continue
		files[subdirname.split("_")[0]] = 1
	for subdirname in os.listdir(data_folder2):
		if subdirname.find(".DS_") > -1:
			continue
		files[subdirname.split("_")[0]] = 1
	return files

@app.route('/word_cloud')
def get_word_cloud_weights():
	files = get_all_words()
	cloud = []
	for key in files:
		cloud.append({"text": key, "size": randint(10,30)})
	return Response(response=json.dumps(cloud), mimetype="application/json")

@app.route('/spark.html')
def spark():
    return app.send_static_file('spark.html')

@app.route('/index.html')
def index():
    return app.send_static_file('index.html')

@app.route('/')
def root():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
