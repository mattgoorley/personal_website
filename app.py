
from flask import Flask, render_template, request, redirect, url_for, flash, json, jsonify
# from forms import ContactForm
# from flask_mail import Mail, Message
from magicwork.magicwork import Email, SecretKeying, SundayFunday
import requests
import foursquare

# mail = Mail()

app = Flask(__name__)

app.secret_key = SecretKeying.secret_key

# app.config["MAIL_SERVER"] = "plus.smtp.mail.yahoo.com"
# app.config["MAIL_PORT"] = 465
# app.config["MAIL_USE_SSL"] = True
# app.config["MAIL_USERNAME"] = Email.ymail
# app.config["MAIL_PASSWORD"] = Email.ymailpw

# mail.init_app(app)

@app.route('/')
@app.route('/home')
@app.route('/about')
def home():
    return render_template('index.html')

@app.route('/snowday')
def snowday():
    return render_template('snowday.html')

@app.route('/finder', methods=['GET'])
def get_results():
    url = "https://api.foursquare.com/v2/venues/search?ll=40.8117233,-73.95621249999999&client_id=XVODQ5S2KJJ0BORRXJLTGKOIFMYOLCW0YHABIFKFQPQTINRU&client_secret=FI1YNOKL5YPEMOK3ITQS5U3DRBWWJNMIWMO05WJVTAATUOF2&v=20170101&categoryId=4d4b7105d754a06374d81259&"
    results = requests.get(url).json()
    return jsonify(results=results)

@app.route('/sundayfunday/')
def index():
    client = foursquare.Foursquare(client_id=SundayFunday.CLIENT_ID, client_secret=SundayFunday.CLIENT_SECRET, redirect_uri='http://mattgoorley.com/sundayfunday')
    auth_uri = client.oauth.auth_url()
    code = request.args.get('code')
    if code:
        access_token = client.oauth.get_token(code)
        client.set_access_token(access_token)
        user = client.users()
        return redirect(url_for('sundayfunday_home', access_token=access_token))
    return redirect(auth_uri)



@app.route('/sundayfunday/home')
def sundayfunday_home():
    access_token = request.args.get('access_token')
    return render_template('sundayfunday.html', access_token=access_token)

@app.route('/sundayfunday/about')
def sundayfunday_about():
    return render_template('sundayfundayabout.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000,debug=False)
