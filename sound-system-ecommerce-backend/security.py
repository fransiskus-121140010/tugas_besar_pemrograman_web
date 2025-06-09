from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from flask import request, jsonify, current_app
import jwt
from datetime import datetime, timedelta

# Define security policies here
def hash_password(password):
    """Hash a password for storing."""
    return generate_password_hash(password)

def check_password(password_hash, password):
    """Check a password against a hash."""
    return check_password_hash(password_hash, password)

def generate_token(user_id):
    """Generate JWT token for user authentication."""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=24),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    """Decorator to require valid JWT token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated

def admin_required(f):
    """Decorator to require admin privileges."""
    @wraps(f)
    def decorated(current_user_id, *args, **kwargs):
        # Add your admin check logic here
        # This would typically check user role in database
        return f(current_user_id, *args, **kwargs)
    return decorated