from django.shortcuts import render
from django.forms import formset_factory
from django.views.generic import View
from .forms import DemoForm

# Create your views here.


def normalize_params(context):
    for key in context:
        if context[key].lower() == "true":
            context[key] = True
        elif context[key].lower() == "false":
            context[key] = False
        else:
            try:
                context[key] = int(context[key])
                continue
            except expression as identifier:
                pass

            try:
                context[key] = float(context[key])
                continue
            except expression as identifier:
                pass


class FormSetTemplateView(View):
    def get(self, request, *args, **kwargs):
        context = request.GET.dict()
        prefix = context.pop("prefix", "demo")
        auto_id = context.pop("auto_id", "id_%s")
        normalize_params(context)
        DemoFormSet = formset_factory(DemoForm, **context)
        formset = DemoFormSet(prefix=prefix, auto_id=auto_id)
        return render(request, "forms/demo01.html", locals())
