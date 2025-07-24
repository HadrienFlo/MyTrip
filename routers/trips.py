from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas, crud, models
from database import SessionLocal
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

router = APIRouter(
    prefix="/trips",
    tags=["trips"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

# Utilitaire pour récupérer l'utilisateur courant à partir du token

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user

@router.post("/", response_model=schemas.Trip)
def create_trip(trip: schemas.TripCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_trip(db=db, trip=trip, user_id=current_user.id)

@router.get("/", response_model=list[schemas.Trip])
def get_trips(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_trips_by_user(db, user_id=current_user.id)

@router.delete("/{trip_id}", response_model=schemas.Trip)
def delete_trip(trip_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    trip = crud.delete_trip(db=db, trip_id=trip_id, user_id=current_user.id)
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found or not owned by user")
    return trip
