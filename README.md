# MyTrip - Carnet de voyage

Ce projet est une API FastAPI pour gérer un carnet de voyage avec authentification des utilisateurs (JWT), gestion des voyages, étapes, et utilisateurs.

## Démarrage rapide

1. Installer les dépendances :
   ```bash
   pip install -r requirements.txt
   ```
2. Lancer le serveur :
   ```bash
   uvicorn main:app --reload
   ```

## Fonctionnalités
- Authentification JWT (inscription, connexion)
- CRUD utilisateurs, voyages, étapes

## Structure du projet
- `main.py` : point d'entrée FastAPI
- `models.py` : modèles SQLAlchemy
- `schemas.py` : schémas Pydantic
- `crud.py` : opérations CRUD
- `auth.py` : gestion de l'authentification

## À venir
- Documentation Swagger sur `/docs`
- Frontend React (prochainement)
