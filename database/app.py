from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app) 

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///votingDApp.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Database schemas
class User(db.Model):
    uid = db.Column(db.Integer, primary_key=True)
    wallet_address = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(100), nullable=False)

class Proposal(db.Model):
    pid = db.Column(db.Integer, primary_key=True)
    proposal_address = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # duration in seconds
    timestamp = db.Column(db.DateTime, nullable=False)

class UserProposal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'), nullable=False)
    pid = db.Column(db.Integer, db.ForeignKey('proposal.pid'), nullable=False)
    token_assigned = db.Column(db.Integer, nullable=False)
    votes = db.Column(db.Integer, default=0)  # Initialize votes to 0


## CRUD: Users
#### Add User
@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    new_user = User(wallet_address=data['wallet_address'], username=data['username'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User added", "uid": new_user.uid}), 201

#### Read Users
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{"uid": user.uid, "wallet_address": user.wallet_address, "username": user.username} for user in users]), 200

## CRUD: Proposals
#### Add Proposal
@app.route('/proposals', methods=['POST'])
def add_proposal():
    data = request.get_json()
    new_proposal = Proposal(
        proposal_address=data['proposal_address'],
        description=data['description'],
        duration=data['duration'],
        timestamp=datetime.now()  # Set current timestamp
    )
    db.session.add(new_proposal)
    db.session.commit()
    return jsonify({"message": "Proposal added", "pid": new_proposal.pid}), 201


# Read Proposals
@app.route('/proposals', methods=['GET'])
def get_proposals():
    proposals = Proposal.query.all()
    return jsonify([{"pid": proposal.pid, "proposal_address": proposal.proposal_address, "description": proposal.description, "duration": proposal.duration, "timestamp": proposal.timestamp} for proposal in proposals]), 200

## CRUD: Users Proposals
#### Add User Proposal
@app.route('/userproposals', methods=['POST'])
def add_user_proposal():
    data = request.get_json()
    user_proposal = UserProposal(
        uid=data['uid'],
        pid=data['pid'],
        token_assigned=data['token_assigned']
    )
    db.session.add(user_proposal)
    db.session.commit()
    return jsonify({"message": "User Proposal added", "id": user_proposal.id}), 201

#### Read User Proposals
@app.route('/userproposals', methods=['GET'])
def get_user_proposals():
    user_proposals = UserProposal.query.all()
    return jsonify([{"id": up.id, "uid": up.uid, "pid": up.pid, "token_assigned": up.token_assigned, "votes": up.votes} for up in user_proposals]), 200

if __name__ == '__main__':
    app.run(debug=True)
 