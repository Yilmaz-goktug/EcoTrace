from datetime import datetime
from database import db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    activities = db.relationship('Activity', backref='user', lazy=True, cascade='all, delete-orphan')
    emissions = db.relationship('Emission', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Şifreyi hash'le ve kaydet"""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        """Girilen şifreyi hash'lı şifre ile karşılaştır"""
        return bcrypt.check_password_hash(self.password_hash, password)


class Activity(db.Model):
    __tablename__ = 'activities'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    source = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(30), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


class Emission(db.Model):
    __tablename__ = 'emissions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    activity_id = db.Column(db.Integer, db.ForeignKey('activities.id', ondelete='CASCADE'), nullable=True)
    co2_kg = db.Column(db.Float, nullable=False)
    scope = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    activity = db.relationship('Activity', backref='emission', lazy=True)


class EmissionFactor(db.Model):
    __tablename__ = 'emission_factors'

    id = db.Column(db.Integer, primary_key=True)
    activity_category = db.Column(db.String(50), nullable=False)
    source = db.Column(db.String(100), nullable=False)
    factor_value = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class UserGoal(db.Model):
    __tablename__ = 'user_goals'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    goal_name = db.Column(db.String(100), nullable=False)
    target_co2_reduction = db.Column(db.Float, nullable=False)
    current_progress = db.Column(db.Float, default=0.0)
    target_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('goals', cascade='all, delete-orphan'), lazy=True)


class Achievement(db.Model):
    __tablename__ = 'achievements'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    goal_id = db.Column(db.Integer, db.ForeignKey('user_goals.id', ondelete='CASCADE'), nullable=True)
    achievement_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    points_earned = db.Column(db.Integer, default=0)
    unlocked_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('achievements', cascade='all, delete-orphan'), lazy=True)
    goal = db.relationship('UserGoal', backref=db.backref('achievements', cascade='all, delete-orphan'), lazy=True)
