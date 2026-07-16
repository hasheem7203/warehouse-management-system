from fastapi import APIRouter, HTTPException ,Depends
from database import get_connection
from schemas.sales_orders import SalesOrderCreate, SOLineCreate, SOAdvance, SOCancel
from auth import require_logistics
import psycopg2

router = APIRouter(prefix="/sales-orders", tags=["Sales Orders"])

@router.get("/")
def get_sales_orders(current_user: dict = Depends(require_logistics)):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT so.so_id, c.customer_name, u.username,
                   so.status, so.payment_status, so.created_at
            FROM sales_orders so
            JOIN customers c ON c.customer_id = so.customer_id
            JOIN users u ON u.user_id = so.created_by
            ORDER BY so.so_id DESC
        """)
        rows = cursor.fetchall()
        return [
            {
                "so_id":          row[0],
                "customer_name":  row[1],
                "created_by":     row[2],
                "status":         row[3],
                "payment_status": row[4],
                "created_at":     str(row[5])
            }
            for row in rows
        ]
    except psycopg2.Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@router.get("/{so_id}")
def get_sales_order(so_id: int,current_user: dict = Depends(require_logistics)):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT so_id, customer_name, created_by, so_status,
                   payment_status, item_name, ordered_quantity,
                   shipped_quantity, pending_quantity, unit_price,
                   line_total, uom_symbol
            FROM vw_sales_order_full
            WHERE so_id = %s
        """, (so_id,))
        rows = cursor.fetchall()
        if not rows:
            raise HTTPException(status_code=404, detail=f"Sales Order {so_id} not found")
        return {
            "so_id":          rows[0][0],
            "customer_name":  rows[0][1],
            "created_by":     rows[0][2],
            "status":         rows[0][3],
            "payment_status": rows[0][4],
            "lines": [
                {
                    "item_name":        row[5],
                    "ordered_quantity": row[6],
                    "shipped_quantity": row[7],
                    "pending_quantity": row[8],
                    "unit_price":       row[9],
                    "line_total":       row[10],
                    "uom_symbol":       row[11]
                }
                for row in rows
            ]
        }
    except psycopg2.Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@router.post("/")
def create_sales_order(so: SalesOrderCreate,current_user: dict = Depends(require_logistics)):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("CALL sp_create_sales_order(%s, %s)",
                       (so.customer_id, so.created_by))
        cursor.execute("""
            SELECT so_id, customer_id, created_by, status, payment_status
            FROM sales_orders
            ORDER BY so_id DESC
            LIMIT 1
        """)
        new_so = cursor.fetchone()
        conn.commit()
        return {
            "so_id":          new_so[0],
            "customer_id":    new_so[1],
            "created_by":     new_so[2],
            "status":         new_so[3],
            "payment_status": new_so[4]
        }
    except psycopg2.Error as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@router.post("/lines")
def add_so_line(line: SOLineCreate,current_user: dict = Depends(require_logistics)):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("CALL sp_add_so_line(%s, %s, %s, %s)",
                       (line.so_id, line.item_id, line.quantity, line.unit_price))
        conn.commit()
        return {"message": "Line added and stock reserved successfully"}
    except psycopg2.Error as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@router.post("/advance")
def advance_so(data: SOAdvance,current_user: dict = Depends(require_logistics)):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("CALL sp_advance_so_status(%s)", (data.so_id,))
        conn.commit()
        return {"message": f"SO {data.so_id} status advanced successfully"}
    except psycopg2.Error as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@router.post("/cancel")
def cancel_so(data: SOCancel,current_user: dict = Depends(require_logistics)):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("CALL sp_cancel_sales_order(%s)", (data.so_id,))
        conn.commit()
        return {"message": f"SO {data.so_id} cancelled. Reserved stock released."}
    except psycopg2.Error as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()