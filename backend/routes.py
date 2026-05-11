from flask import jsonify, request
from flask_jwt_extended import create_access_token
from database import db
from models import Activity, Emission, EmissionFactor, User
from services import EmissionCalculator
from sqlalchemy import func
from datetime import datetime
from dateutil.relativedelta import relativedelta


def register_routes(app):
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        payload = request.get_json() or {}
        username = payload.get('username')
        email = payload.get('email')
        password = payload.get('password')

        if not username or not email or not password:
            return jsonify({'message': 'Missing required fields'}), 400

        # Email kontrol - aynı email varsa hata döndür
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'message': 'Email already registered'}), 409

        # Username kontrol - aynı username varsa hata döndür
        existing_username = User.query.filter_by(username=username).first()
        if existing_username:
            return jsonify({'message': 'Username already taken'}), 409

        user = User(username=username, email=email)
        user.set_password(password)  # Şifreyi hash'le
        db.session.add(user)
        db.session.commit()

        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'message': 'User registered successfully'
        }), 201

    @app.route('/api/auth/login', methods=['POST'])
    def login():
        payload = request.get_json() or {}
        email = payload.get('email')
        password = payload.get('password')

        if not email or not password:
            return jsonify({'message': 'Missing email or password'}), 400

        user = User.query.filter_by(email=email).first()
        
        # Kullanıcı yoksa veya şifre yanlışsa
        if not user or not user.check_password(password):
            return jsonify({'message': 'Invalid credentials'}), 401

        # JWT token oluştur
        access_token = create_access_token(identity=user.id)

        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'message': 'Login successful'
        }), 200

    @app.route('/api/activities', methods=['GET', 'POST'])
    def activities():
        if request.method == 'GET':
            user_id = request.args.get('user_id')
            query = Activity.query
            if user_id:
                query = query.filter_by(user_id=user_id)
            activities = query.all()
            return jsonify([{
                'id': item.id,
                'user_id': item.user_id,
                'category': item.category,
                'source': item.source,
                'amount': item.amount,
                'unit': item.unit,
                'timestamp': item.timestamp.isoformat(),
            } for item in activities])

        payload = request.get_json() or {}
        activity = Activity(
            user_id=payload.get('user_id'),
            category=payload.get('category'),
            source=payload.get('source'),
            amount=payload.get('amount'),
            unit=payload.get('unit'),
        )
        db.session.add(activity)
        db.session.commit()
        return jsonify({'id': activity.id}), 201

    @app.route('/api/emissions/calculate', methods=['POST'])
    def calculate_emission():
        payload = request.get_json() or {}
        user_id = payload.get('user_id')
        category = payload.get('category')
        source = payload.get('source')
        amount = payload.get('amount')
        scope = payload.get('scope', 'scope_1')

        co2_kg = EmissionCalculator.calculate(category, source, amount)
        emission = Emission(
            user_id=user_id,
            activity_id=payload.get('activity_id'),
            co2_kg=co2_kg,
            scope=scope,
        )
        db.session.add(emission)
        db.session.commit()
        return jsonify({'co2_kg': co2_kg, 'scope': scope}), 201

    @app.route('/api/emissions', methods=['GET'])
    def list_emissions():
        user_id = request.args.get('user_id')
        query = Emission.query
        if user_id:
            query = query.filter_by(user_id=user_id)
        emissions = query.all()
        return jsonify([{
            'id': item.id,
            'user_id': item.user_id,
            'activity_id': item.activity_id,
            'co2_kg': item.co2_kg,
            'scope': item.scope,
            'created_at': item.created_at.isoformat(),
        } for item in emissions])

    @app.route('/api/leaderboard', methods=['GET'])
    def leaderboard():
        results = (
            db.session.query(
                User.id,
                User.username,
                func.sum(Emission.co2_kg).label('total_co2')
            )
            .join(Emission, Emission.user_id == User.id)
            .group_by(User.id)
            .order_by(func.sum(Emission.co2_kg).asc())
            .all()
        )
        return jsonify([
            {
                'user_id': row.id,
                'username': row.username,
                'total_co2': float(row.total_co2 or 0),
            }
            for row in results
        ])

    @app.route('/api/emissions/add', methods=['POST'])
    def add_emission():
        payload = request.get_json() or {}
        user_id = payload.get('user_id')
        category = payload.get('category')
        source = payload.get('source')
        amount = payload.get('amount')

        if not all([user_id, category, source, amount]):
            return jsonify({'message': 'Missing required fields'}), 400

        # EmissionFactor'dan bul
        factor = EmissionFactor.query.filter_by(activity_category=category, source=source).first()
        if not factor:
            return jsonify({'message': 'Emission factor not found for given category and source'}), 404

        calculated_co2 = amount * factor.factor_value

        # Emission kaydet
        emission = Emission(
            user_id=user_id,
            co2_kg=calculated_co2,
            scope='scope_1'
        )
        db.session.add(emission)
        db.session.commit()

        return jsonify({
            'calculated_co2': calculated_co2,
            'unit': 'kg CO2'
        }), 201

    @app.route('/api/emissions/summary/<int:user_id>', methods=['GET'])
    def emissions_summary(user_id):
        period = request.args.get('period', 'all_time')
        valid_periods = ['daily', 'monthly', '6_months', 'yearly', 'all_time']
        if period not in valid_periods:
            return jsonify({'message': 'Invalid period. Valid values: daily, monthly, 6_months, yearly, all_time'}), 400

        now = datetime.utcnow()
        if period == 'daily':
            start_date = now - relativedelta(days=1)
        elif period == 'monthly':
            start_date = now - relativedelta(months=1)
        elif period == '6_months':
            start_date = now - relativedelta(months=6)
        elif period == 'yearly':
            start_date = now - relativedelta(years=1)
        else:  # all_time
            start_date = None

        query = db.session.query(
            Emission.scope,
            func.sum(Emission.co2_kg).label('total_co2')
        ).filter(Emission.user_id == user_id)

        if start_date:
            query = query.filter(Emission.created_at >= start_date)

        results = query.group_by(Emission.scope).all()

        summary = {row.scope: float(row.total_co2 or 0) for row in results}
        total_co2 = sum(summary.values())

        return jsonify({
            'user_id': user_id,
            'period': period,
            'total_co2': total_co2,
            'summary_by_scope': summary
        })
