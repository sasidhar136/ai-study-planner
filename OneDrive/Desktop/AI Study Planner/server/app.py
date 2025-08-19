from flask import Flask

app = Flask(__name__)

@app.route("/")

def home():
    return {"message":"Backend server"}

@app.route("/ping")

def ping():
    return {"status":"ok"}

if __name__ == "__main__":
    app.run(debug=True)

