# FleetHub

Application web de gestion de flotte de véhicules d'entreprise permettant le suivi complet des véhicules, des affectations, de l'entretien et de la consommation énergétique.

## Description
Ce projet contient l'API (Backend) construite avec Django et Django REST Framework. Il fournit les fonctionnalités de base, l'authentification et les accès sécurisés à la base de données.

## Installation

### Prérequis
- Python 3.10+
- MySQL 8.x

### Étapes
1. Cloner le dépôt.
2. Créer un environnement virtuel : `python -m venv venv`
3. Activer l'environnement virtuel : `.\venv\Scripts\activate` (Windows) ou `source venv/bin/activate` (Linux/Mac)
4. Installer les dépendances (ex: `pip install -r requirements.txt`). (À venir)
5. Créer la base de données `fleethub` dans MySQL.
6. Copier `.env.example` vers `.env` et renseigner les informations de connexion à la base de données MySQL.
7. Lancer les migrations : `python manage.py migrate`
8. Lancer le serveur : `python manage.py runserver`

## Endpoints principaux
- `/api/v1/auth/` : Authentification (login, logout, refresh, reset)
- `/api/v1/users/` : Gestion des utilisateurs
- `/api/v1/vehicles/` : Gestion des véhicules
- `/api/v1/assignments/` : Affectations des véhicules
- `/api/v1/energy/` : Gestion de la consommation et recharges
- `/api/v1/maintenance/` : Entretien et alertes
- `/api/v1/dashboard/` : Statistiques du tableau de bord
- `/api/docs/` : Documentation complète de l'API (Swagger)

## Comptes de démo
*(Les comptes de démo seront injectés lors du premier chargement des fixtures)*
- Administrateur : `admin@fleethub.com` / `password123`
- Gestionnaire : `manager@fleethub.com` / `password123`
- Chauffeur : `driver@fleethub.com` / `password123`
