from flask import Flask, render_template, request, redirect, url_for, flash
from forms import ContactForm
from flask_mail import Mail, Message
from magicwork.magicwork import Email, SecretKeying

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

            return 'Form posted.'

    elif request.method == 'GET':
        return render_template('contact.html', form=form)


if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000,debug=False)

