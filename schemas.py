from pydantic import BaseModel
from typing import List, Optional

class StepBase(BaseModel):
    title: str
    description: Optional[str] = None

class StepCreate(StepBase):
    pass

class Step(StepBase):
    id: int
    class Config:
        orm_mode = True

class TripBase(BaseModel):
    title: str
    description: Optional[str] = None

class TripCreate(TripBase):
    pass

class Trip(TripBase):
    id: int
    steps: List[Step] = []
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    trips: List[Trip] = []
    class Config:
        orm_mode = True
