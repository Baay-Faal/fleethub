from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class Affectation(models.Model):
    TYPE_CHOICES = (
        ('TEMPORAIRE', 'Temporaire'),
        ('PERMANENTE', 'Permanente'),
    )

    vehicule = models.ForeignKey(
        'vehicules.Vehicule',
        on_delete=models.CASCADE,
        related_name='affectations',
        verbose_name=_('véhicule')
    )
    chauffeur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='affectations_chauffeur',
        verbose_name=_('chauffeur')
    )
    date_debut = models.DateField(_('date de début'))
    date_fin = models.DateField(_('date de fin'), null=True, blank=True)
    
    type_affectation = models.CharField(
        _('type d\'affectation'),
        max_length=20,
        choices=TYPE_CHOICES,
        default='TEMPORAIRE'
    )
    notes = models.TextField(_('notes'), blank=True)
    
    cree_par = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='affectations_creees',
        verbose_name=_('créé par')
    )
    
    date_creation = models.DateTimeField(_('date de création'), auto_now_add=True)
    date_modification = models.DateTimeField(_('date de modification'), auto_now=True)

    class Meta:
        db_table = 'affectations'
        verbose_name = _('affectation')
        verbose_name_plural = _('affectations')
        indexes = [
            models.Index(fields=['vehicule', 'chauffeur']),
        ]

    def __str__(self):
        return f"Affectation de {self.vehicule} à {self.chauffeur}"
