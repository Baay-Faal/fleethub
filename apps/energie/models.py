from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class Consommation(models.Model):
    TYPE_CHOICES = (
        ('CARBURANT', 'Carburant'),
        ('RECHARGE', 'Recharge'),
    )

    vehicule = models.ForeignKey(
        'vehicules.Vehicule',
        on_delete=models.CASCADE,
        related_name='consommations',
        verbose_name=_('véhicule')
    )
    chauffeur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='consommations',
        verbose_name=_('chauffeur')
    )
    
    date = models.DateTimeField(_('date et heure'))
    type_energie = models.CharField(_('type d\'énergie'), max_length=20, choices=TYPE_CHOICES)
    
    litres = models.DecimalField(_('litres (carburant)'), max_digits=6, decimal_places=2, null=True, blank=True)
    kwh = models.DecimalField(_('kWh (recharge)'), max_digits=6, decimal_places=2, null=True, blank=True)
    
    prix = models.DecimalField(_('prix total'), max_digits=8, decimal_places=2)
    kilometrage = models.PositiveIntegerField(_('kilométrage au relevé'))
    
    nom_station = models.CharField(_('nom de la station'), max_length=150, blank=True)
    localisation_station = models.CharField(_('localisation de la station'), max_length=250, blank=True)
    
    recu = models.FileField(_('reçu / facture'), upload_to='recus_energie/%Y/%m/', null=True, blank=True)
    notes = models.TextField(_('notes'), blank=True)
    
    date_creation = models.DateTimeField(_('date de création'), auto_now_add=True)

    class Meta:
        db_table = 'energie_consommations'
        verbose_name = _('consommation')
        verbose_name_plural = _('consommations')
        indexes = [
            models.Index(fields=['vehicule', 'date']),
        ]

    def __str__(self):
        return f"{self.type_energie} - {self.vehicule} ({self.date.strftime('%Y-%m-%d')})"
