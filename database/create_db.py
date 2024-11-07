from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///votingDApp.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Define models
class User(db.Model):
    uid = db.Column(db.Integer, primary_key=True)
    wallet_address = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(100), nullable=False)
    role =db.Column(db.String(100), nullable=False, default='shareholder')
    token = db.Column(db.Integer, default=0)

class Proposal(db.Model):
    pid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    deadline = db.Column(db.DateTime, nullable=False)
    total_votes = db.Column(db.Integer, default=0) 
    total_yes_votes = db.Column(db.Integer, default=0) 
    total_no_votes = db.Column(db.Integer, default=0)


class UserProposal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'), nullable=False)
    pid = db.Column(db.Integer, db.ForeignKey('proposal.pid'), nullable=False)
    vote = db.Column(db.Boolean, default=False)  # Initialize votes to 0

# Create the database file and tables
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    print("Database created and tables are ready.")
