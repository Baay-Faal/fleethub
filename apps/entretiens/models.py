from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class Entretien(models.Model):
    INTERVENTION_CHOICES = (
        ('REVISION', 'Révision'),
        ('VIDANGE', 'Vidange'),
        ('PNEUS', 'Changement de pneus'),
        ('CONTROLE_TECHNIQUE', 'Contrôle technique'),
        ('BATTERIE', 'Batterie 12V'),
        ('SYSTEME_HT', 'Système Haute Tension (VE)'),
        ('MOTEUR_ELEC', 'Moteur Électrique (VE)'),
        ('AUTRE', 'Autre'),
    )

    STATUT_CHOICES = (
        ('EN_ATTENTE_VALIDATION', 'En attente de validation'),
        ('PLANIFIE', 'Planifié'),
        ('EN_COURS', 'En cours'),
        ('TERMINE', 'Terminé'),
        ('REFUSE', 'Refusé'),
        ('ANNULE', 'Annulé'),
    )

    vehicule = models.ForeignKey(
        'vehicules.Vehicule',
        on_delete=models.CASCADE,
        related_name='entretiens',
        verbose_name=_('véhicule')
    )
    
    type_intervention = models.CharField(_('type d\'intervention'), max_length=50, choices=INTERVENTION_CHOICES)
    est_immediat = models.BooleanField(_('demande immédiate (panne)'), default=False)
    
    chauffeur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='demandes_entretiens',
        verbose_name=_('demandeur (chauffeur)')
    )
    
    date_prevue = models.DateField(_('date prévue'))
    date_realisation = models.DateField(_('date de réalisation'), null=True, blank=True)
    
    kilometrage = models.PositiveIntegerField(_('kilométrage lors de l\'entretien'))
    cout = models.DecimalField(_('coût'), max_digits=10, decimal_places=2, default=0.00)
    
    description = models.TextField(_('description détaillée'), blank=True)
    
    nom_garage = models.CharField(_('nom du garage'), max_length=150, blank=True)
    contact_garage = models.CharField(_('contact du garage'), max_length=150, blank=True)
    
    facture = models.FileField(_('facture'), upload_to='factures_entretien/%Y/%m/', null=True, blank=True)
    
    statut = models.CharField(_('statut'), max_length=30, choices=STATUT_CHOICES, default='PLANIFIE')
    
    cree_par = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='entretiens_crees',
        verbose_name=_('créé par')
    )
    
    date_creation = models.DateTimeField(_('date de création'), auto_now_add=True)
    date_modification = models.DateTimeField(_('date de modification'), auto_now=True)

    class Meta:
        db_table = 'entretiens'
        verbose_name = _('entretien')
        verbose_name_plural = _('entretiens')
        indexes = [
            models.Index(fields=['vehicule', 'date_prevue']),
            models.Index(fields=['statut']),
        ]

    def __str__(self):
        return f"{self.get_type_intervention_display()} - {self.vehicule} ({self.date_prevue})"


class AlerteEntretien(models.Model):
    TYPE_ALERTE_CHOICES = (
        ('KILOMETRAGE', 'Kilométrage'),
        ('DATE', 'Date'),
    )

    vehicule = models.ForeignKey(
        'vehicules.Vehicule',
        on_delete=models.CASCADE,
        related_name='alertes',
        verbose_name=_('véhicule')
    )
    
    type_alerte = models.CharField(_('type d\'alerte'), max_length=20, choices=TYPE_ALERTE_CHOICES)
    
    seuil_km = models.PositiveIntegerField(_('seuil (kilomètres)'), null=True, blank=True)
    seuil_date = models.DateField(_('seuil (date)'), null=True, blank=True)
    
    actif = models.BooleanField(_('alerte active'), default=True)
    dernier_declenchement = models.DateTimeField(_('dernier déclenchement'), null=True, blank=True)

    class Meta:
        db_table = 'alertes_entretien'
        verbose_name = _('alerte d\'entretien')
        verbose_name_plural = _('alertes d\'entretien')

    def __str__(self):
        return f"Alerte {self.get_type_alerte_display()} pour {self.vehicule}"
