from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class UtilisateurManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_("L'adresse email est obligatoire."))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'ADMIN')

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Le superutilisateur doit avoir is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Le superutilisateur doit avoir is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)

class Utilisateur(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('CHAUFFEUR', 'Chauffeur'),
        ('GESTIONNAIRE', 'Gestionnaire'),
        ('ADMIN', 'Administrateur'),
    )

    email = models.EmailField(_('adresse email'), unique=True)
    prenom = models.CharField(_('prénom'), max_length=150, blank=True)
    nom = models.CharField(_('nom'), max_length=150, blank=True)
    telephone = models.CharField(_('téléphone'), max_length=20, blank=True)
    role = models.CharField(
        _('rôle'),
        max_length=20,
        choices=ROLE_CHOICES,
        default='CHAUFFEUR',
    )
    cgu_acceptees = models.BooleanField(_('CGU acceptées'), default=False)
    numero_permis = models.CharField(_('numéro de permis'), max_length=50, blank=True, null=True)
    expiration_permis = models.DateField(_('expiration du permis'), blank=True, null=True)
    
    is_staff = models.BooleanField(
        _('statut staff'),
        default=False,
    )
    is_active = models.BooleanField(
        _('actif'),
        default=True,
    )
    date_creation = models.DateTimeField(_('date de création'), auto_now_add=True)
    date_modification = models.DateTimeField(_('date de modification'), auto_now=True)

    objects = UtilisateurManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['prenom', 'nom']

    class Meta:
        db_table = 'utilisateurs'
        verbose_name = _('utilisateur')
        verbose_name_plural = _('utilisateurs')

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"

class Notification(models.Model):
    destinataire = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name=_('destinataire')
    )
    message = models.TextField(_('message'))
    est_lu = models.BooleanField(_('est lu'), default=False)
    date_creation = models.DateTimeField(_('date de création'), auto_now_add=True)

    class Meta:
        db_table = 'utilisateurs_notifications'
        verbose_name = _('notification')
        verbose_name_plural = _('notifications')
        ordering = ['-date_creation']

    def __str__(self):
        return f"Notif for {self.destinataire.email}: {self.message[:20]}"
