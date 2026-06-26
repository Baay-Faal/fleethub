from django.db import models
from django.utils.translation import gettext_lazy as _

class Vehicule(models.Model):
    TYPE_CHOICES = (
        ('VOITURE', 'Voiture'),
        ('MOTO', 'Moto'),
        ('CAMIONNETTE', 'Camionnette'),
        ('UTILITAIRE', 'Utilitaire'),
        ('CAMION', 'Camion'),
    )

    MOTORISATION_CHOICES = (
        ('ESSENCE', 'Essence'),
        ('DIESEL', 'Diesel'),
        ('ELECTRIQUE', 'Électrique'),
        ('HYBRIDE', 'Hybride'),
        ('HYBRIDE_RECHARGEABLE', 'Hybride Rechargeable'),
    )

    STATUT_CHOICES = (
        ('DISPONIBLE', 'Disponible'),
        ('EN_UTILISATION', 'En utilisation'),
        ('EN_MAINTENANCE', 'En maintenance'),
        ('EN_CHARGE', 'En charge'),
        ('HORS_SERVICE', 'Hors service'),
    )

    immatriculation = models.CharField(_('immatriculation'), max_length=20, unique=True)
    marque = models.CharField(_('marque'), max_length=100)
    modele = models.CharField(_('modèle'), max_length=100)
    annee = models.IntegerField(_('année'))
    
    type_vehicule = models.CharField(_('type de véhicule'), max_length=20, choices=TYPE_CHOICES)
    motorisation = models.CharField(_('motorisation'), max_length=30, choices=MOTORISATION_CHOICES)
    statut = models.CharField(_('statut'), max_length=20, choices=STATUT_CHOICES, default='DISPONIBLE')
    
    kilometrage = models.PositiveIntegerField(_('kilométrage'), default=0)
    capacite_batterie = models.DecimalField(_('capacité batterie (kWh)'), max_digits=6, decimal_places=2, null=True, blank=True)
    autonomie = models.PositiveIntegerField(_('autonomie (km)'), null=True, blank=True)
    
    date_achat = models.DateField(_('date d\'achat'))
    prix_achat = models.DecimalField(_('prix d\'achat'), max_digits=10, decimal_places=2)
    vin = models.CharField(_('numéro de châssis (VIN)'), max_length=50, unique=True)
    
    expiration_assurance = models.DateField(_('expiration assurance'))
    expiration_controle_technique = models.DateField(_('expiration contrôle technique'))
    
    date_creation = models.DateTimeField(_('date de création'), auto_now_add=True)
    date_modification = models.DateTimeField(_('date de modification'), auto_now=True)

    class Meta:
        db_table = 'vehicules'
        verbose_name = _('véhicule')
        verbose_name_plural = _('véhicules')
        indexes = [
            models.Index(fields=['immatriculation']),
            models.Index(fields=['statut']),
        ]

    def __str__(self):
        return f"{self.immatriculation} - {self.marque} {self.modele}"
