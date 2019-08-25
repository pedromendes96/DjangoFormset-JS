from django import forms


class DemoForm(forms.Form):
    title = forms.CharField()
    body = forms.CharField(widget=forms.Textarea())
    number = forms.IntegerField()
    choices = forms.ChoiceField(choices=(
        (1, 1),
        (2, 2),
        (3, 3)
    ))
