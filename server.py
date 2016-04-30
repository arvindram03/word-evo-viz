from flask import Flask, request, Response

from flask import Flask
import json
import pickle
from sklearn.cluster import KMeans

import os
from random import randint
from collections import Counter

app = Flask(__name__, static_url_path='/static')

# Run kmeans clustering iteratively with k=4
def perform_kmeans(data, k=4):
	kmeans_data = [[point["x"], point["y"]] for point in data]
	print kmeans_data
	kmeans = KMeans(n_clusters = k, n_jobs = 2)
	kmeans.fit(kmeans_data)
	# print "perform_kmeans", Counter(kmeans.labels_)
	return kmeans

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

	kmeans = perform_kmeans(other_coords)
	# c = Counter(kmeans.labels_)
	for i in xrange(len(other_coords)):
		other_coords[i]['c'] = str(kmeans.labels_[i])
	resp["other_words"]	= other_coords

	timeseries = word_data[2]
	# word_coords = []
	word_coords = {}
	for year_data in timeseries:
		# word_coords.append({"word":query,"year":int(year_data[0]),"x":year_data[1]*scaling_factor,"y":year_data[2]*scaling_factor})
		# word_coords[year_data[0]] = (year_data[1],year_data[2])
		word_coords[year_data[0]] = {"x":year_data[1]*scaling_factor,"y":year_data[2]*scaling_factor}

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