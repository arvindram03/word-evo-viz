from flask import Flask, request, Response

from flask import Flask
import json
import pickle

app = Flask(__name__, static_url_path='/static')

@app.route('/word')
def get_word_data():
	query = request.args.get('q')
	word_data_file = 'data/words/{}_points_filtered.pkl'.format(query)
	word_data = pickle.load(open(word_data_file))

	resp = {}
	resp["word"] = word_data[0]
	
	other_words = word_data[1]
	other_coords = []
	for word in other_words:
		other_coords.append({"word":word[-1],"x":word[0],"y":word[1]})

	resp["other_words"]	= other_coords

	timeseries = word_data[2]
	word_coords = []
	for year_data in timeseries:
		word_coords.append({"word":query,"year":int(year_data[0]),"x":year_data[1],"y":year_data[2]})
		# word_coords[year_data[0]] = (year_data[1],year_data[2])

	resp["timeseries"]	= word_coords
	
	return Response(response=json.dumps(resp), mimetype="application/json")

@app.route('/')
def index():
    return app.send_static_file('index.html')	

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)