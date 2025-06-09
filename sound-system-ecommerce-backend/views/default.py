from flask import Blueprint, jsonify

# Placeholder for default views (e.g., health check)
default_bp = Blueprint('default', __name__)

@default_bp.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Sound System E-commerce Backend API',
        'status': 'running',
        'version': '1.0.0'
    })

@default_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Service is running properly'
    }), 200

@default_bp.route('/api/info', methods=['GET'])
def api_info():
    return jsonify({
        'api_name': 'Sound System E-commerce API',
        'endpoints': {
            'health': '/health',
            'products': '/api/products',
            'users': '/api/users',
            'orders': '/api/orders'
        }
    })