from models.product import Product
from database import get_db_connection
from typing import List, Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class ProductService:
    def __init__(self):
        self.db = get_db_connection()
    
    def get_all_products(self) -> List[Dict[str, Any]]:
        """Get all products"""
        try:
            cursor = self.db.cursor(dictionary=True)
            cursor.execute("SELECT * FROM products WHERE is_active = 1")
            return cursor.fetchall()
        except Exception as e:
            logger.error(f"Error fetching products: {e}")
            return []
    
    def get_product_by_id(self, product_id: int) -> Optional[Dict[str, Any]]:
        """Get product by ID"""
        try:
            cursor = self.db.cursor(dictionary=True)
            cursor.execute("SELECT * FROM products WHERE id = %s AND is_active = 1", (product_id,))
            return cursor.fetchone()
        except Exception as e:
            logger.error(f"Error fetching product {product_id}: {e}")
            return None
    
    def create_product(self, product_data: Dict[str, Any]) -> Optional[int]:
        """Create new product"""
        try:
            cursor = self.db.cursor()
            query = """
                INSERT INTO products (name, description, price, category_id, stock_quantity, image_url)
                VALUES (%(name)s, %(description)s, %(price)s, %(category_id)s, %(stock_quantity)s, %(image_url)s)
            """
            cursor.execute(query, product_data)
            self.db.commit()
            return cursor.lastrowid
        except Exception as e:
            logger.error(f"Error creating product: {e}")
            self.db.rollback()
            return None
    
    def update_product(self, product_id: int, product_data: Dict[str, Any]) -> bool:
        """Update existing product"""
        try:
            cursor = self.db.cursor()
            query = """
                UPDATE products 
                SET name = %(name)s, description = %(description)s, price = %(price)s,
                    category_id = %(category_id)s, stock_quantity = %(stock_quantity)s,
                    image_url = %(image_url)s
                WHERE id = %s
            """
            cursor.execute(query, (*product_data.values(), product_id))
            self.db.commit()
            return cursor.rowcount > 0
        except Exception as e:
            logger.error(f"Error updating product {product_id}: {e}")
            self.db.rollback()
            return False
    
    def delete_product(self, product_id: int) -> bool:
        """Soft delete product"""
        try:
            cursor = self.db.cursor()
            cursor.execute("UPDATE products SET is_active = 0 WHERE id = %s", (product_id,))
            self.db.commit()
            return cursor.rowcount > 0
        except Exception as e:
            logger.error(f"Error deleting product {product_id}: {e}")
            self.db.rollback()
            return False
    
    def search_products(self, query: str) -> List[Dict[str, Any]]:
        """Search products by name or description"""
        try:
            cursor = self.db.cursor(dictionary=True)
            search_query = """
                SELECT * FROM products 
                WHERE (name LIKE %s OR description LIKE %s) AND is_active = 1
            """
            search_term = f"%{query}%"
            cursor.execute(search_query, (search_term, search_term))
            return cursor.fetchall()
        except Exception as e:
            logger.error(f"Error searching products: {e}")
            return []
