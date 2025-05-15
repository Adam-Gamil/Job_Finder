from .models import User
from django import forms
from django.contrib.auth.forms import UserCreationForm

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2', 'is_admin', 'company_name')
    def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields['username'].widget.attrs.update({'placeholder': 'Username'})
            self.fields['email'].widget.attrs.update({'placeholder': 'Email'})
            self.fields['password1'].widget.attrs.update({'placeholder': 'Password'})
            self.fields['password2'].widget.attrs.update({'placeholder': 'Confirm Password'})
            self.fields['is_admin'].widget.attrs.update({'placeholder': 'Is Admin'})
            self.fields['company_name'].widget.attrs.update({'placeholder': 'Company Name'})
            self.fields['is_admin'].initial = False