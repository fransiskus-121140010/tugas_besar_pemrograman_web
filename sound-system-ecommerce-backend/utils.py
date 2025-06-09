import hashlib
import secrets
import re
from datetime import datetime, timedelta
from typing import Optional, Union

# Common utility functions
def hash_password(password: str) -> str:
    """Hash a password using SHA-256 with salt."""
    salt = secrets.token_hex(16)
    hashed = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}:{hashed}"

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    try:
        salt, hash_part = hashed_password.split(':')
        return hashlib.sha256((password + salt).encode()).hexdigest() == hash_part
    except ValueError:
        return False

def validate_email(email: str) -> bool:
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def generate_token() -> str:
    """Generate a secure random token."""
    return secrets.token_urlsafe(32)

def format_currency(amount: Union[int, float]) -> str:
    """Format amount as currency string."""
    return f"${amount:,.2f}"

def calculate_discount(original_price: float, discount_percent: int) -> float:
    """Calculate discounted price."""
    return original_price * (1 - discount_percent / 100)

def sanitize_filename(filename: str) -> str:
    """Remove unsafe characters from filename."""
    return re.sub(r'[^\w\-_\.]', '_', filename)

def paginate_query(page: int, per_page: int = 20) -> tuple:
    """Calculate offset and limit for pagination."""
    offset = (page - 1) * per_page
    return offset, per_page