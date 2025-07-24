from sqlalchemy.orm import Session
import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_trip(db: Session, trip: schemas.TripCreate, user_id: int):
    db_trip = models.Trip(title=trip.title, description=trip.description, owner_id=user_id)
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

def get_trips_by_user(db: Session, user_id: int):
    return db.query(models.Trip).filter(models.Trip.owner_id == user_id).all()

def delete_trip(db: Session, trip_id: int, user_id: int):
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id, models.Trip.owner_id == user_id).first()
    if not trip:
        return None
    db.delete(trip)
    db.commit()
    return trip
