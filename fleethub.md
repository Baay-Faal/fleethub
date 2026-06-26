CAHIER DES CHARGES - FLEETHUB
1. PRÉSENTATION DU PROJET
1.1 Contexte
Développement d'une application web de gestion de flotte de véhicules d'entreprise permettant le suivi complet des véhicules, des affectations, de l'entretien et de la consommation énergétique.

1.2 Objectifs
Centraliser la gestion de parc automobile (voitures, motos, utilitaires)
Optimiser l'affectation des véhicules aux chauffeurs
Planifier et suivre l'entretien préventif et curatif
Analyser la consommation énergétique (carburant et électricité)
Réduire les coûts d'exploitation de la flotte
1.3 Périmètre
Gestion multi-types de véhicules (thermiques, électriques, hybrides)
Système de permissions par rôles (Chauffeur, Gestionnaire, Administrateur)
API REST complète avec documentation Swagger
Interface web professionnelle responsive
2. SPÉCIFICATIONS TECHNIQUES
2.1 Architecture Backend
Technologies
Framework : Django 5.x
Base de données : MySQL 8.x
API : Django REST Framework 3.x
Documentation API : drf-yasg (Swagger/OpenAPI)
Authentification : JWT (djangorestframework-simplejwt)
Structure du projet
text

fleethub/
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── users/
│   ├── vehicles/
│   ├── assignments/
│   ├── maintenance/
│   ├── energy/
│   └── dashboard/
├── api/
│   ├── v1/
│   │   ├── serializers/
│   │   ├── views/
│   │   └── urls.py
│   └── permissions.py
└── static/
2.2 Modèles de données
Users (Utilisateurs)
text

- id (PK)
- email (unique)
- first_name
- last_name
- phone
- role (CHAUFFEUR, GESTIONNAIRE, ADMIN)
- driving_license_number
- driving_license_expiry
- is_active
- created_at
- updated_at
Vehicles (Véhicules)
text

- id (PK)
- registration_number (unique)
- brand
- model
- year
- vehicle_type (VOITURE, MOTO, CAMIONNETTE, UTILITAIRE, CAMION)
- engine_type (ESSENCE, DIESEL, ELECTRIQUE, HYBRIDE, HYBRIDE_RECHARGEABLE)
- status (DISPONIBLE, EN_UTILISATION, EN_MAINTENANCE, EN_CHARGE, HORS_SERVICE)
- mileage (kilométrage actuel)
- battery_capacity (kWh - nullable)
- range (autonomie km - nullable)
- purchase_date
- purchase_price
- vin (numéro de châssis)
- insurance_expiry
- technical_control_expiry
- created_at
- updated_at
Assignments (Affectations)
text

- id (PK)
- vehicle_id (FK)
- driver_id (FK)
- start_date
- end_date (nullable)
- assignment_type (TEMPORAIRE, PERMANENTE)
- notes
- created_by (FK User)
- created_at
- updated_at
Energy (Carburant/Recharge)
text

- id (PK)
- vehicle_id (FK)
- driver_id (FK)
- date
- energy_type (CARBURANT, RECHARGE)
- liters (nullable)
- kwh (nullable)
- price
- mileage
- station_name
- station_location
- receipt_file (upload)
- notes
- created_at
Maintenance (Entretien)
text

- id (PK)
- vehicle_id (FK)
- intervention_type (REVISION, VIDANGE, PNEUS, CONTROLE_TECHNIQUE, BATTERIE, etc.)
- scheduled_date
- completed_date (nullable)
- mileage
- cost
- description
- garage_name
- garage_contact
- invoice_file (upload)
- status (PLANIFIE, EN_COURS, TERMINE, ANNULE)
- created_by (FK User)
- created_at
- updated_at
MaintenanceAlerts (Alertes d'entretien)
text

- id (PK)
- vehicle_id (FK)
- alert_type (KILOMETRAGE, DATE)
- threshold_km (nullable)
- threshold_date (nullable)
- is_active
- last_triggered
2.3 API REST - Endpoints
Authentication
text

POST   /api/v1/auth/login/
POST   /api/v1/auth/logout/
POST   /api/v1/auth/refresh/
POST   /api/v1/auth/password-reset/
Users
text

GET    /api/v1/users/
POST   /api/v1/users/
GET    /api/v1/users/{id}/
PUT    /api/v1/users/{id}/
PATCH  /api/v1/users/{id}/
DELETE /api/v1/users/{id}/
GET    /api/v1/users/me/
Vehicles
text

GET    /api/v1/vehicles/
POST   /api/v1/vehicles/
GET    /api/v1/vehicles/{id}/
PUT    /api/v1/vehicles/{id}/
PATCH  /api/v1/vehicles/{id}/
DELETE /api/v1/vehicles/{id}/
GET    /api/v1/vehicles/{id}/history/
GET    /api/v1/vehicles/available/
GET    /api/v1/vehicles/statistics/
Assignments
text

GET    /api/v1/assignments/
POST   /api/v1/assignments/
GET    /api/v1/assignments/{id}/
PUT    /api/v1/assignments/{id}/
PATCH  /api/v1/assignments/{id}/
DELETE /api/v1/assignments/{id}/
GET    /api/v1/assignments/active/
POST   /api/v1/assignments/{id}/terminate/
Energy
text

GET    /api/v1/energy/
POST   /api/v1/energy/
GET    /api/v1/energy/{id}/
PUT    /api/v1/energy/{id}/
DELETE /api/v1/energy/{id}/
GET    /api/v1/energy/statistics/
GET    /api/v1/energy/by-vehicle/{vehicle_id}/
Maintenance
text

GET    /api/v1/maintenance/
POST   /api/v1/maintenance/
GET    /api/v1/maintenance/{id}/
PUT    /api/v1/maintenance/{id}/
PATCH  /api/v1/maintenance/{id}/
DELETE /api/v1/maintenance/{id}/
GET    /api/v1/maintenance/upcoming/
GET    /api/v1/maintenance/alerts/
Dashboard
text

GET    /api/v1/dashboard/overview/
GET    /api/v1/dashboard/fleet-status/
GET    /api/v1/dashboard/costs/
GET    /api/v1/dashboard/consumption/
GET    /api/v1/dashboard/alerts/
2.4 Permissions par rôle
Endpoint	Chauffeur	Gestionnaire	Admin
Consulter véhicules	Assignés uniquement	Tous	Tous
Créer véhicule	✗	✗	✓
Modifier véhicule	✗	Certains champs	✓
Supprimer véhicule	✗	✗	✓
Créer affectation	✗	✓	✓
Ajouter carburant/recharge	Ses véhicules	Tous	Tous
Consulter entretiens	Ses véhicules	Tous	Tous
Planifier entretien	✗	✓	✓
Gérer utilisateurs	✗	✗	✓
Consulter dashboard	Limité	Complet	Complet
3. SPÉCIFICATIONS FRONTEND
3.1 Design System
Inspiration
Style épuré et professionnel inspiré de wolverineworldwide.com
Palette de couleurs sobre (noir, blanc, gris, accent corporate)
Typographie moderne et lisible
Espaces aérés, layout minimal
Charte graphique
text

Couleurs principales :
- Primary: #1a1a1a (noir professionnel)
- Secondary: #f5f5f5 (gris clair)
- Accent: #0066cc (bleu corporate)
- Success: #28a745
- Warning: #ffc107
- Danger: #dc3545
- Text: #333333
- Text-light: #666666

Typographie :
- Headings: "Inter", "Helvetica Neue", sans-serif
- Body: "Inter", "Helvetica Neue", sans-serif
- Tailles: 14px (body), 16px (lead), 24-48px (headings)

Spacing :
- Base unit: 8px
- Margins/Paddings: multiples de 8px (8, 16, 24, 32, 48, 64)
Icônes
Bibliothèque : Heroicons SVG ou Feather Icons
Style : outline pour navigation, solid pour actions
Taille : 20px (small), 24px (default), 32px (large)
Pas d'emojis
3.2 Technologies Frontend
text

- HTML5 sémantique
- CSS3 / SCSS
- JavaScript ES6+
- Framework : Vue.js 3.x ou React 18.x
- UI Components : Headless UI / Radix UI
- Charts : Chart.js ou Apache ECharts
- Tables : TanStack Table
- Forms : Validation avec Vee-Validate ou React Hook Form
- HTTP Client : Axios
- State Management : Pinia (Vue) / Zustand (React)
- Build : Vite
3.3 Pages et composants
Pages principales
1. Dashboard (tableau de bord)

Vue d'ensemble de la flotte
Statistiques clés (véhicules disponibles, coûts mensuels, alertes)
Graphiques de consommation
Alertes d'entretien prioritaires
2. Véhicules

Liste avec filtres (type, motorisation, statut)
Vue détaillée d'un véhicule
Formulaire création/édition
Historique complet
3. Affectations

Planning des affectations
Formulaire d'affectation
Historique par chauffeur/véhicule
4. Carburant/Recharge

Liste des entrées
Formulaire de saisie
Statistiques de consommation
Graphiques d'évolution
5. Entretien

Planning d'entretien
Formulaire de maintenance
Historique par véhicule
Alertes
6. Utilisateurs (Admin uniquement)

Liste des utilisateurs
Gestion des rôles
Création/édition
7. Rapports

Rapports personnalisables
Export PDF/Excel
Graphiques avancés
Composants réutilisables
text

- Navbar (navigation principale)
- Sidebar (menu latéral selon rôle)
- Card (conteneur de contenu)
- Table (tableau de données avec tri/filtrage)
- Form (formulaire générique)
- Input (champs de saisie)
- Select (sélecteur)
- Button (boutons)
- Modal (fenêtre modale)
- Alert (notifications)
- Badge (étiquettes de statut)
- Chart (graphiques)
- DatePicker (sélecteur de date)
- FileUpload (upload de fichiers)
- Loader (chargement)
- Pagination
- Breadcrumb (fil d'ariane)
- Tooltip
- Dropdown
3.4 Responsive Design
text

Breakpoints :
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1439px
- Large Desktop: 1440px+

Comportement :
- Navigation : hamburger menu sur mobile
- Tables : scroll horizontal ou cards sur mobile
- Graphiques : adaptés à la largeur
- Formulaires : champs empilés sur mobile
3.5 Maquettes fonctionnelles attendues
Dashboard
text

┌─────────────────────────────────────────────────────┐
│ [Logo] FleetHub              [Notifs] [User Menu]  │
├─────────────────────────────────────────────────────┤
│ [Sidebar]  │  Dashboard                             │
│            │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│ Dashboard  │  │  45  │ │  12  │ │ 8.5K │ │  3   │  │
│ Véhicules  │  │Véhic.│ │Alerte│ │ € /m │ │Maint.│  │
│ Affectat.  │  └──────┘ └──────┘ └──────┘ └──────┘  │
│ Carburant  │                                        │
│ Entretien  │  ┌─────────────────────────────────┐  │
│ Utilisat.  │  │  Consommation mensuelle         │  │
│ Rapports   │  │  [Graphique linéaire]           │  │
│            │  └─────────────────────────────────┘  │
│            │                                        │
│            │  ┌─────────────────────────────────┐  │
│            │  │  Alertes d'entretien            │  │
│            │  │  ⚠ Peugeot 308 - Révision 500km│  │
│            │  │  ⚠ Renault Zoe - CT dans 15j   │  │
│            │  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
Liste Véhicules
text

┌─────────────────────────────────────────────────────┐
│ Véhicules                       [+ Nouveau véhicule]│
├─────────────────────────────────────────────────────┤
│ Filtres: [Type ▼] [Motorisation ▼] [Statut ▼]     │
├─────────────────────────────────────────────────────┤
│ Immat.    Marque  Type  Motor.  Km      Statut     │
│ AB-123-CD Renault Voiture Diesel 45000  Disponible │
│ EF-456-GH Tesla   Voiture Elect. 12000  En service │
│ IJ-789-KL BMW     Moto    Essence 8000  Maintenance│
│                                                     │
│ [1] 2 3 ... 10                     Afficher: 20 ▼  │
└─────────────────────────────────────────────────────┘
4. FONCTIONNALITÉS MÉTIER
4.1 Calculs automatiques
Consommation
Python

# Véhicules thermiques
consommation_moyenne = (litres_totaux / km_parcourus) * 100  # L/100km

# Véhicules électriques
consommation_moyenne = (kwh_totaux / km_parcourus) * 100  # kWh/100km

# Coût par kilomètre
cout_km = cout_total_energie / km_parcourus
Alertes d'entretien
text

Conditions de déclenchement :
- Révision tous les 15 000 km → alerte à -1000 km
- Contrôle technique annuel → alerte à -30 jours
- Vidange tous les 10 000 km → alerte à -500 km
- Assurance → alerte à -60 jours avant expiration
4.2 Validations métier
text

- Le kilométrage ne peut que croître
- Une affectation ne peut chevaucher une autre pour le même véhicule
- Un véhicule en maintenance ne peut être affecté
- Les dates de fin d'affectation >= dates de début
- Un chauffeur ne peut avoir plus de 2 véhicules simultanément
- Les véhicules électriques doivent avoir capacité batterie et autonomie
- Le prix du carburant/recharge doit être > 0
4.3 Notifications
text

Types de notifications :
- Email : alertes entretien, affectation, fin d'affectation
- In-app : toutes les notifications
- Fréquence : quotidienne pour alertes, immédiate pour actions

Destinataires :
- Gestionnaire : toutes les alertes
- Chauffeur : affectations, alertes de ses véhicules
- Admin : notifications système
5. SÉCURITÉ
5.1 Authentification
JWT avec refresh token
Expiration access token : 15 minutes
Expiration refresh token : 7 jours
Stockage sécurisé (httpOnly cookies pour web)
5.2 Autorisation
Middleware de vérification de rôle
Permissions au niveau objet (ownership)
CORS configuré strictement
5.3 Validation
Validation côté backend (Django serializers)
Validation côté frontend (formulaires)
Sanitization des inputs
Protection CSRF
5.4 Données sensibles
Mots de passe hashés (bcrypt/Argon2)
Pas de données sensibles en logs
Upload de fichiers : validation type/taille
Chiffrement des données en transit (HTTPS)
6. PERFORMANCE
6.1 Backend
text

- Pagination systématique (page size: 20)
- Utilisation de select_related / prefetch_related
- Indexes sur champs fréquemment filtrés
- Cache Redis pour requêtes courantes
- Compression des réponses API (gzip)
6.2 Frontend
text

- Lazy loading des composants
- Debouncing sur recherches
- Optimisation des images
- Code splitting
- Minification des assets
6.3 Base de données
text

Indexes sur :
- vehicles.registration_number
- vehicles.status
- assignments.vehicle_id, assignments.driver_id
- energy.vehicle_id, energy.date
- maintenance.vehicle_id, maintenance.scheduled_date
7. DOCUMENTATION
7.1 Documentation API (Swagger)
YAML

Contenu attendu :
- Description complète de chaque endpoint
- Paramètres de requête avec types et validations
- Exemples de requêtes
- Exemples de réponses (success + errors)
- Codes HTTP utilisés
- Schémas de données
- Authentication requirements
- Rate limiting
7.2 Documentation technique
text

- README.md : installation, configuration
- CONTRIBUTING.md : guide de contribution
- DEPLOYMENT.md : guide de déploiement
- API.md : documentation API détaillée
- Docstrings Python (Google style)
- Commentaires JSDoc pour JavaScript
8. TESTS
8.1 Backend
text

- Tests unitaires : modèles, serializers, utils
- Tests d'intégration : API endpoints
- Tests de permissions
- Couverture minimale : 80%
- Framework : pytest-django
8.2 Frontend
text

- Tests unitaires : composants, utils
- Tests d'intégration : flows utilisateurs
- Framework : Jest + Testing Library
9. ENVIRONNEMENTS
9.1 Développement
text

- Django DEBUG=True
- SQLite ou MySQL local
- Hot reload frontend
- Fixtures pour données de test
9.2 Production
text

- Django DEBUG=False
- MySQL 8.x
- Serveur : Gunicorn + Nginx
- Static files : WhiteNoise ou CDN
- HTTPS obligatoire
- Logging vers fichiers
- Monitoring : Sentry (optionnel)
10. LIVRABLES
10.1 Code source
text

- Repository Git (GitHub/GitLab)
- Branches : main, develop
- Commits conventionnels
- .gitignore configuré
- requirements.txt / package.json
10.2 Documentation
text

- Documentation API Swagger (accessible /api/docs/)
- README complet
- Guide d'installation
- Guide utilisateur (PDF)
- Schéma de base de données (ERD)
10.3 Déploiement
text

- Script de déploiement
- Variables d'environnement documentées
- Instructions de backup
- Script de migration de données
10.4 Données de test
text

- Fixtures Django
- 3 utilisateurs par rôle
- 50 véhicules (mix types et motorisations)
- 100+ entrées carburant/recharge
- 50+ entrées entretien
11. PLANNING PRÉVISIONNEL
Phase 1 - Setup & Backend Core (2 semaines)
Configuration projet Django + MySQL
Modèles de données
API REST (CRUD basiques)
Authentification JWT
Documentation Swagger
Phase 2 - Backend Avancé (2 semaines)
Logique métier (calculs, validations)
Permissions avancées
Alertes et notifications
Tests unitaires et d'intégration
Phase 3 - Frontend Core (2 semaines)
Setup frontend (Vue/React)
Design system et composants
Pages principales (Dashboard, Véhicules)
Intégration API
Phase 4 - Frontend Avancé (2 semaines)
Pages secondaires
Graphiques et statistiques
Upload fichiers
Responsive design
Phase 5 - Polish & Tests (1 semaine)
Tests frontend
Optimisations performance
Corrections bugs
Documentation utilisateur
Phase 6 - Déploiement (1 semaine)
Configuration production
Déploiement
Tests en production
Formation utilisateurs
Durée totale estimée : 10 semaines

12. CONTRAINTES ET EXIGENCES
12.1 Techniques
Compatible navigateurs : Chrome, Firefox, Safari, Edge (2 dernières versions)
Responsive : mobile, tablette, desktop
Performance : temps de réponse API < 200ms (90e percentile)
Disponibilité : 99% (hors maintenance programmée)
12.2 Qualité
Code respectant PEP8 (Python) et ESLint/Prettier (JavaScript)
Pas de warnings lors du build
Documentation à jour
Logs structurés
12.3 Accessibilité
Contraste conforme WCAG 2.1 niveau AA
Navigation clavier
Labels ARIA sur composants interactifs
Textes alternatifs sur icônes/images
13. BUDGET ET RESSOURCES
À définir avec Antigravity selon :

Nombre de développeurs
Stack technique choisie (Vue vs React)
Niveau de complexité des graphiques
Étendue des tests
Support post-livraison
14. CRITÈRES D'ACCEPTATION
Must Have (Obligatoire)
✓ Tous les modèles de données implémentés
✓ API REST complète et documentée (Swagger)
✓ Authentification JWT fonctionnelle
✓ Permissions par rôle opérationnelles
✓ Interface responsive
✓ Dashboard avec statistiques clés
✓ CRUD complet sur véhicules, affectations, énergie, entretien
✓ Calculs de consommation automatiques
✓ Système d'alertes d'entretien

Should Have (Souhaitable)
○ Graphiques interactifs
○ Export PDF/Excel
○ Upload de fichiers (factures, photos)
○ Notifications email
○ Recherche avancée et filtres
○ Historique complet par véhicule

Nice to Have (Bonus)
◇ Progressive Web App (PWA)
◇ Mode sombre
◇ Multi-langues (i18n)
◇ Intégration calendrier
◇ API de géolocalisation stations
◇ Application mobile native

15. ANNEXES
15.1 Glossaire
Affectation : attribution d'un véhicule à un chauffeur
Motorisation : type de moteur (thermique, électrique, hybride)
VIN : Vehicle Identification Number (numéro de châssis)
kWh : kilowatt-heure (unité de mesure énergie électrique)
15.2 Références
Django Documentation : https://docs.djangoproject.com/
Django REST Framework : https://www.django-rest-framework.org/
drf-yasg : https://drf-yasg.readthedocs.io/
Chart.js : https://www.chartjs.org/
