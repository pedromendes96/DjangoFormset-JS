from django.shortcuts import render
from django.forms import formset_factory
from django.views.generic import View
from .forms import DemoForm

# Create your views here.


class FormSetCreateDemoView(View):
    def get(self, request, *args, **kwargs):
        DemoFormSet = formset_factory(DemoForm)
        formset = DemoFormSet(prefix="demo")
        return render(request, "forms/demo01.html", locals())


class FormSetCreateOrderDemoView(View):
    def get(self, request, *args, **kwargs):
        DemoFormSet = formset_factory(DemoForm, can_order=True)
        formset = DemoFormSet(prefix="demo")
        return render(request, "forms/demo01.html", locals())


class FormSetCreateDeleteDemoView(View):
    def get(self, request, *args, **kwargs):
        DemoFormSet = formset_factory(DemoForm, can_delete=True)
        formset = DemoFormSet(prefix="demo")
        return render(request, "forms/demo01.html", locals())


class FormSetCreateOrderDeleteDemoView(View):
    def get(self, request, *args, **kwargs):
        DemoFormSet = formset_factory(
            DemoForm, can_delete=True, can_order=True)
        formset = DemoFormSet(prefix="demo")
        return render(request, "forms/demo01.html", locals())
