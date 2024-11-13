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
    role =db.Column(db.String(100), nullable=False, default='user')
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
    vote = db.Column(db.Integer, default=0)  # Initialize votes to 0


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
    return jsonify([{"uid": user.uid, "wallet_address": user.wallet_address, "username": user.username, "role": user.role, "token": user.token} for user in users]), 200

@app.route('/users/<int:uid>', methods=['GET'])
def get_user(uid):
    user = User.query.get(uid)
    if user is None:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"uid": user.uid, "wallet_address": user.wallet_address, "username": user.username, "role": user.role, "token": user.token}), 200

#### delete user
@app.route('/users/<int:uid>', methods=['DELETE'])
def delete_user(uid):
    user = User.query.get(uid)
    if user is None:
        return jsonify({"error": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200

#### Update User
@app.route('/users/<int:uid>', methods=['PUT'])
def update_user(uid):
    data = request.get_json()
    user = User.query.get(uid)
    
    if user is None:
        return jsonify({"error": "User not found"}), 404
    
    # Update user fields if provided in the request data
    if 'wallet_address' in data:
        user.wallet_address = data['wallet_address']
    if 'username' in data:
        user.username = data['username']
    if 'role' in data:
        user.role = data['role']
    if 'token' in data:
        user.token = data['token']
    
    # Commit the changes to the database
    db.session.commit()
    
    # Return success message
    return jsonify({"message": "User updated successfully"}), 200

# CRUD: Proposals
# Add Proposal
@app.route('/proposals', methods=['POST'])
def add_proposal():
    data = request.get_json()
    
    try:
        # Extract data from the incoming request, use defaults if missing
        name = data['name']
        description = data['description']
        deadline = datetime.strptime(data['deadline'], '%Y-%m-%d %H:%M:%S')  # Deadline in 'YYYY-MM-DD HH:MM:SS' format
        
        # Extract totals, default to 0 if not provided
        total_votes = data.get('total_votes', 0)
        total_yes_votes = data.get('total_yes_votes', 0)
        total_no_votes = data.get('total_no_votes', 0)
        
        # Extract pid, default to None if not provided (assuming it's auto-incremented by the database)
        pid = data.get('pid', None)

        # Create a new proposal instance
        new_proposal = Proposal(
            pid=pid,  # If pid is provided, it will be used, otherwise the database will auto-generate it
            name=name,
            description=description,
            deadline=deadline,
            total_votes=total_votes,
            total_yes_votes=total_yes_votes,
            total_no_votes=total_no_votes
        )

        # Add and commit the new proposal to the database
        db.session.add(new_proposal)
        db.session.commit()

        return jsonify({
            "message": "Proposal added",
            "pid": new_proposal.pid,
            "name": new_proposal.name,
            "description": new_proposal.description,
            "deadline": new_proposal.deadline,
            "total_votes": new_proposal.total_votes,
            "total_yes_votes": new_proposal.total_yes_votes,
            "total_no_votes": new_proposal.total_no_votes
        }), 201
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

#### Read User Proposals
@app.route('/userproposals', methods=['GET'])
def get_user_proposals():
    user_proposals = UserProposal.query.all()
    return jsonify([{"id": up.id, "uid": up.uid, "pid": up.pid, "vote": up.vote} for up in user_proposals]), 200

### read user proposal by uid and pid
@app.route('/userproposals/<int:uid>/<int:pid>', methods=['GET'])
def get_user_proposal(uid, pid):
    user_proposal = UserProposal.query.filter_by(uid=uid, pid=pid).first()
    if user_proposal is None:
        return jsonify({"error": "User Proposal not found"}), 404
    return jsonify({"id": user_proposal.id, "uid": user_proposal.uid, "pid": user_proposal.pid, "vote": user_proposal.vote}), 200

@app.route('/users/wallet/<wallet_address>', methods=['GET'])
def get_user_by_wallet_address(wallet_address):
    user = User.query.filter_by(wallet_address=wallet_address).first()
    if user:
        return jsonify(uid=user.uid, username=user.username, role=user.role, token=user.token)
    else:
        return jsonify({"error": "User not found"}), 404


#### Add User Proposal
@app.route('/userproposals', methods=['POST'])
def add_user_proposal():
    data = request.get_json()
    existing_proposal = UserProposal.query.filter_by(uid=data['uid'], pid=data['pid']).first()

    if existing_proposal:
        # Return a message if the vote already exists
        return jsonify({"message": "A vote for this user and proposal already exists", "id": existing_proposal.id}), 409
    
    
    user_proposal = UserProposal(
        uid=data['uid'],
        pid=data['pid'],
        vote=data['vote']
    )
    db.session.add(user_proposal)
    db.session.commit()
    return jsonify({"message": "User Proposal added", "id": user_proposal.id}), 201

if __name__ == '__main__':
    app.run(debug=True)
 