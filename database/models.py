from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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

    # Relationships for easier access
    user = db.relationship('User', backref='user_proposals')
    proposal = db.relationship('Proposal', backref='user_proposals')
