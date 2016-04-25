from flask import Flask, request

from flask import Flask
import json
app = Flask(__name__, static_url_path='/static')

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)