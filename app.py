from flask import Flask, render_template, request, redirect, url_for, flash, json, jsonify
from forms import ContactForm
from flask_mail import Mail, Message
from magicwork.magicwork import Email, SecretKeying, SundayFunday
import requests
import foursquare

mail = Mail()

app = Flask(__name__)

app.secret_key = SecretKeying.secret_key

app.config["MAIL_SERVER"] = "plus.smtp.mail.yahoo.com"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USE_SSL"] = True
app.config["MAIL_USERNAME"] = Email.ymail
app.config["MAIL_PASSWORD"] = Email.ymailpw

mail.init_app(app)

@app.route('/')
@app.route('/home')
@app.route('/about')
def home():
    return render_template('home.html')

@app.route('/about/')
def about():
    return render_template('about.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    form = ContactForm()

    if request.method == 'POST':
        if form.validate() == False:
            flash('All fields are required')
            return render_template('contact.html', form=form)
        else:
            msg = Message(form.subject.data, sender=Email.ymail, recipients=[Email.gmail])
            msg.body = """
            From: {} <{}>
            {}
            """.format(form.name.data, form.email.data, form.message.data)
            mail.send(msg)

            return redirect(url_for('contact'))

    elif request.method == 'GET':
        return render_template('contact.html', form=form)

@app.route('/snowday')
def snowday():
    return render_template('snowday.html')

@app.route('/sundayfunday')
def index():
    client = foursquare.Foursquare(client_id=SundayFunday.CLIENT_ID, client_secret=SundayFunday.CLIENT_SECRET, redirect_uri='http://mattgoorley.com/sundayfunday')
    auth_uri = client.oauth.auth_url()
    code = request.args.get('code')
    if code:
        access_token = client.oauth.get_token(code)
        client.set_access_token(access_token)
        user = client.users()
        return redirect(url_for('sundayfunday', access_token=access_token))
    return redirect(auth_uri)



@app.route('/sundayfunday/home')
def sundayfunday():
    access_token = request.args.get('access_token')
    return render_template('sundayfunday.html', access_token=access_token)

@app.route('/sundayfunday/about')
def sundayfunday_about():
    return render_template('sundayfundayabout.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000,debug=False)

