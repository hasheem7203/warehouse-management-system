from pydantic import BaseModel

class SalesOrderCreate(BaseModel):
    customer_id: int 
    created_by: int 
    
class SOLineCreate(BaseModel):
    so_id: int
    created_by: int
    
class SOAdvance(BaseModel):
    so_id: int
    
class SOCancel(BaseModel):
    so_id: int 
