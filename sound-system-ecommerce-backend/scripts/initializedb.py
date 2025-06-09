import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import logging
from app.models import Base, User, Product, Category, Order, OrderItem
from app.database import get_database_url
from werkzeug.security import generate_password_hash

# Add the parent directory to the path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_database():
    """Create database tables"""
    try:
        engine = create_engine(get_database_url())
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
        return engine
    except Exception as e:
        logger.error(f"Error creating database: {e}")
        raise

def seed_initial_data(engine):
    """Seed database with initial data"""
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Create admin user
        admin_user = User(
            username="admin",
            email="admin@soundsystem.com",
            password_hash=generate_password_hash("admin123"),
            is_admin=True
        )
        session.add(admin_user)
        
        # Create sample categories
        categories = [
            Category(name="Speakers", description="High-quality speakers"),
            Category(name="Amplifiers", description="Audio amplifiers"),
            Category(name="Headphones", description="Premium headphones"),
            Category(name="Microphones", description="Professional microphones")
        ]
        session.add_all(categories)
        session.flush()
        
        # Create sample products
        products = [
            Product(
                name="Premium Bluetooth Speaker",
                description="Wireless speaker with excellent sound quality",
                price=299.99,
                stock_quantity=50,
                category_id=categories[0].id
            ),
            Product(
                name="Studio Monitor Headphones",
                description="Professional headphones for studio monitoring",
                price=199.99,
                stock_quantity=30,
                category_id=categories[2].id
            )
        ]
        session.add_all(products)
        
        session.commit()
        logger.info("Initial data seeded successfully")
        
    except Exception as e:
        session.rollback()
        logger.error(f"Error seeding data: {e}")
        raise
    finally:
        session.close()

def main():
    """Main initialization function"""
    try:
        logger.info("Starting database initialization...")
        engine = create_database()
        seed_initial_data(engine)
        logger.info("Database initialization completed successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
