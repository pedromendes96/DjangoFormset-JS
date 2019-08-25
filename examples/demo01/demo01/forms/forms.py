from django import forms


class DemoForm(forms.Form):
    title = forms.CharField()
    body = forms.CharField(widget=forms.Textarea())
    number = forms.IntegerField()
