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

@app.route('/users/<int:uid>', methods=['GET'])
def get_user(uid):
    user = User.query.get(uid)
    if user is None:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"uid": user.uid, "wallet_address": user.wallet_address, "username": user.username}), 200

#### delete user
@app.route('/users/<int:uid>', methods=['DELETE'])
def delete_user(uid):
    user = User.query.get(uid)
    if user is None:
        return jsonify({"error": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200

# CRUD: Proposals
# Add Proposal
@app.route('/proposals', methods=['POST'])
def add_proposal():
    data = request.get_json()
    try:
        new_proposal = Proposal(
            name=data['name'],
            description=data['description'],
            deadline=datetime.strptime(data['deadline'], '%Y-%m-%d %H:%M:%S'),  # Deadline in 'YYYY-MM-DD HH:MM:SS' format
        )
        db.session.add(new_proposal)
        db.session.commit()
        return jsonify({"message": "Proposal added", "pid": new_proposal.pid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Get All Proposals
@app.route('/proposals', methods=['GET'])
def get_proposals():
    proposals = Proposal.query.all()
    result = [
        {
            "pid": proposal.pid,
            "name": proposal.name,
            "description": proposal.description,
            "deadline": proposal.deadline.strftime('%Y-%m-%d %H:%M:%S'),
            "total_votes": proposal.total_votes,
            "total_yes_votes": proposal.total_yes_votes,
            "total_no_votes": proposal.total_no_votes
        } for proposal in proposals
    ]
    return jsonify(result), 200

# Get a Specific Proposal by ID
@app.route('/proposals/<int:pid>', methods=['GET'])
def get_proposal(pid):
    proposal = Proposal.query.get(pid)
    if proposal is None:
        return jsonify({"error": "Proposal not found"}), 404
    
    return jsonify({
        "pid": proposal.pid,
        "name": proposal.name,
        "description": proposal.description,
        "deadline": proposal.deadline.strftime('%Y-%m-%d %H:%M:%S'),
        "total_votes": proposal.total_votes,
        "total_yes_votes": proposal.total_yes_votes,
        "total_no_votes": proposal.total_no_votes
    }), 200

# Update a Proposal
@app.route('/proposals/<int:pid>', methods=['PUT'])
def update_proposal(pid):
    data = request.get_json()
    proposal = Proposal.query.get(pid)
    if proposal is None:
        return jsonify({"error": "Proposal not found"}), 404
    
    try:
        proposal.name = data.get('name', proposal.name)
        proposal.description = data.get('description', proposal.description)
        if 'deadline' in data:
            proposal.deadline = datetime.strptime(data['deadline'], '%Y-%m-%d %H:%M:%S')
        proposal.total_votes = data.get('total_votes', proposal.total_votes)
        proposal.total_yes_votes = data.get('total_yes_votes', proposal.total_yes_votes)
        proposal.total_no_votes = data.get('total_no_votes', proposal.total_no_votes)
        
        db.session.commit()
        return jsonify({"message": "Proposal updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Delete a Proposal
@app.route('/proposals/<int:pid>', methods=['DELETE'])
def delete_proposal(pid):
    proposal = Proposal.query.get(pid)
    if proposal is None:
        return jsonify({"error": "Proposal not found"}), 404
    
    db.session.delete(proposal)
    db.session.commit()
    return jsonify({"message": "Proposal deleted"}), 200

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
 