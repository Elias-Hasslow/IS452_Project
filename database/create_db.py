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
    role = db.Column(db.String(100), nullable=False, default='shareholder')
    token = db.Column(db.Integer, default=0)

class Proposal(db.Model):
    pid = db.Column(db.Integer,primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
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

# Function to add initial users
def add_initial_users():
    initial_users = [
        {
            "role": "admin",
            "token": 0,
            "uid": 1,
            "username": "EliasAdmin",
            "wallet_address": "0x72fe47904B323FED0f7E178f7f0A08C09016f7ac"
        },
        {
            "role": "user",
            "token": 0,
            "uid": 2,
            "username": "EliasUser",
            "wallet_address": "0xDA410B9ADab7B585ecea1bA4B25B0d0fd9875Bef"
        },
        {
            "role": "user",
            "token": 25,
            "uid": 3,
            "username": "MajaUser",
            "wallet_address": "0xd82FA69A03E90A85aE943EF29d8816ca10Ca1681"
        },
        {
            "role": "user",
            "token": 0,
            "uid": 4,
            "username": "KlariceUser",
            "wallet_address": "0x32fdAbC879572d382cB7C93666a9C5e64a71467a"
        },
        {
            "role": "user",
            "token": 0,
            "uid": 5,
            "username": "ZijianUser",
            "wallet_address": "0x6Caca4438b90544475dF23f2C30d45a894bEa073"
        },
        {
            "role": "user",
            "token": 0,
            "uid": 6,
            "username": "test user",
            "wallet_address": "123456789"
        }
    ]

    # Add users to the database if they don't already exist
    for user_data in initial_users:
        if not User.query.filter_by(wallet_address=user_data["wallet_address"]).first():
            new_user = User(
                uid=user_data["uid"],
                wallet_address=user_data["wallet_address"],
                username=user_data["username"],
                role=user_data["role"],
                token=user_data["token"]
            )
            db.session.add(new_user)
    db.session.commit()
    print("Initial users added to the database.")

# Create the database file and tables, and add initial users
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        add_initial_users()
    print("Database created and tables are ready.")
