from django import forms

class AddProductForm(forms.Form):
    quantity = forms.IntegerField()
    is_updated = forms.BooleanField(required=False, initial=False, widget=forms.HiddenInput)