var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
        this.handlers = [];
    }
    EventDispatcher.prototype.fire = function (event) {
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var h = _a[_i];
            h(event);
        }
    };
    EventDispatcher.prototype.register = function (handler) {
        this.handlers.push(handler);
    };
    return EventDispatcher;
}());
var DjangoFormset = /** @class */ (function () {
    function DjangoFormset(selector, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.prefix, prefix = _c === void 0 ? "form" : _c, _d = _b.addElement, addElement = _d === void 0 ? undefined : _d, _e = _b.addElementDefaultText, addElementDefaultText = _e === void 0 ? "Add" : _e, _f = _b.addElementWrapperSelector, addElementWrapperSelector = _f === void 0 ? ".formset-wrapper-add" : _f, _g = _b.canDelete, canDelete = _g === void 0 ? false : _g, _h = _b.deleteElement, deleteElement = _h === void 0 ? undefined : _h, _j = _b.deleteElementDefaultText, deleteElementDefaultText = _j === void 0 ? "Delete" : _j, _k = _b.deleteElementWrapperSelector, deleteElementWrapperSelector = _k === void 0 ? ".formset-wrapper-delete" : _k, _l = _b.canOrder, canOrder = _l === void 0 ? false : _l, _m = _b.orderElement, orderElement = _m === void 0 ? undefined : _m, _o = _b.orderElementBeforeSelector, orderElementBeforeSelector = _o === void 0 ? ".formset-order-before" : _o, _p = _b.orderElementBeforeDefaultText, orderElementBeforeDefaultText = _p === void 0 ? "Before" : _p, _q = _b.orderElementAfterSelector, orderElementAfterSelector = _q === void 0 ? ".formset-order-after" : _q, _r = _b.orderElementAfterDefaultText, orderElementAfterDefaultText = _r === void 0 ? "After" : _r, _s = _b.orderElementWrapperSelector, orderElementWrapperSelector = _s === void 0 ? ".formset-wrapper-order" : _s, _t = _b.autoId, autoId = _t === void 0 ? "id_%s" : _t;
        this.beforeAddDispatcher = new EventDispatcher();
        this.afterAddDispatcher = new EventDispatcher();
        this.beforeDeleteDispatcher = new EventDispatcher();
        this.afterDeleteDispatcher = new EventDispatcher();
        this.beforeOrderDispatcher = new EventDispatcher();
        this.afterOrderDispatcher = new EventDispatcher();
        this.selector = selector;
        this.prefix = prefix;
        this.addElementDefaultText = addElementDefaultText;
        this.addElementWrapperSelector = addElementWrapperSelector;
        this.canDelete = canDelete;
        this.deleteElementDefaultText = deleteElementDefaultText;
        this.deleteElementWrapperSelector = deleteElementWrapperSelector;
        this.canOrder = canOrder;
        this.orderElementBeforeSelector = orderElementBeforeSelector;
        this.orderElementBeforeDefaultText = orderElementBeforeDefaultText;
        this.orderElementAfterSelector = orderElementAfterSelector;
        this.orderElementAfterDefaultText = orderElementAfterDefaultText;
        this.orderElementWrapperSelector = orderElementWrapperSelector;
        this.addElement = addElement || this.getDefaultAddElement();
        this.deleteElement = deleteElement || this.getDefaultDeleteElement();
        this.orderElement = orderElement || this.getDefaultOrderElement();
        this.autoId = autoId;
        this.totalFormsElement = document.getElementById(this.getIdSignature(this.prefix + "-TOTAL_FORMS"));
        this.minFormsElement = document.getElementById(this.getIdSignature(this.prefix + "-MIN_NUM_FORMS"));
        this.maxFormsElement = document.getElementById(this.getIdSignature(this.prefix + "-MAX_NUM_FORMS"));
        var forms = this.getForms();
        if (forms.length) {
            var formReference = forms[0];
            this.formTemplate = this.cleanForm(formReference);
        }
        else {
            throw "Must have atleast one form to create a template!";
        }
    }
    DjangoFormset.prototype.onBeforeAdd = function (handler) {
        this.beforeAddDispatcher.register(handler);
    };
    DjangoFormset.prototype.fireBeforeAdd = function (event) {
        this.beforeAddDispatcher.fire(event);
    };
    DjangoFormset.prototype.onAfterAdd = function (handler) {
        this.afterAddDispatcher.register(handler);
    };
    DjangoFormset.prototype.fireAfterAdd = function (event) {
        this.afterAddDispatcher.fire(event);
    };
    DjangoFormset.prototype.onBeforeDelete = function (handler) {
        this.beforeDeleteDispatcher.register(handler);
    };
    DjangoFormset.prototype.fireBeforeDelete = function (event) {
        this.beforeDeleteDispatcher.fire(event);
    };
    DjangoFormset.prototype.onAfterDelete = function (handler) {
        this.afterDeleteDispatcher.register(handler);
    };
    DjangoFormset.prototype.fireAfterDelete = function (event) {
        this.afterDeleteDispatcher.fire(event);
    };
    DjangoFormset.prototype.onBeforeOrder = function (handler) {
        this.beforeOrderDispatcher.register(handler);
    };
    DjangoFormset.prototype.fireBeforeOrder = function (event) {
        this.beforeOrderDispatcher.fire(event);
    };
    DjangoFormset.prototype.onAfterOrder = function (handler) {
        this.afterOrderDispatcher.register(handler);
    };
    DjangoFormset.prototype.fireAfterOrder = function (event) {
        this.afterOrderDispatcher.fire(event);
    };
    DjangoFormset.prototype.getIdSignature = function (str) {
        return this.autoId.replace("%s", str);
    };
    DjangoFormset.prototype.getIntValueMethodFormat = function (element) {
        try {
            return parseInt(element.getAttribute("value"));
        }
        catch (error) {
            return 0;
        }
    };
    DjangoFormset.prototype.setIntValueMethodFormat = function (element, value) {
        element.setAttribute("value", value.toString());
    };
    DjangoFormset.prototype.getNumberOfTotalForms = function () {
        return this.getIntValueMethodFormat(this.totalFormsElement);
    };
    DjangoFormset.prototype.getNumberOfVisibleForms = function () {
        var forms = this.getForms();
        var numberOfVisibleForms = 0;
        for (var index = 0; index < forms.length; index++) {
            var element = forms[index];
            if (element.offsetWidth > 0 && element.offsetHeight > 0) {
                numberOfVisibleForms += 1;
            }
        }
        return numberOfVisibleForms;
    };
    DjangoFormset.prototype.getNumberOfMinForms = function () {
        return this.getIntValueMethodFormat(this.minFormsElement);
    };
    DjangoFormset.prototype.getNumberOfMaxForms = function () {
        return this.getIntValueMethodFormat(this.maxFormsElement);
    };
    DjangoFormset.prototype.setupElementInFormBySelector = function (form, element, selector) {
        var elementWrapper = form.querySelector(selector);
        elementWrapper.append(element);
    };
    DjangoFormset.prototype.decrementTotalForms = function () {
        var totalNumberOfForms = this.getNumberOfTotalForms();
        this.totalFormsElement.setAttribute("value", (totalNumberOfForms - 1).toString());
    };
    DjangoFormset.prototype.incrementTotalForms = function () {
        var totalNumberOfForms = this.getNumberOfTotalForms();
        this.totalFormsElement.setAttribute("value", (totalNumberOfForms + 1).toString());
    };
    DjangoFormset.prototype.getForms = function () {
        return document.querySelectorAll(this.selector);
    };
    DjangoFormset.prototype.getVisibleForms = function () {
        var forms = this.getForms();
        var visibleForms = [];
        for (var index = 0; index < forms.length; index++) {
            var element = forms[index];
            if (element.offsetWidth > 0 && element.offsetHeight > 0) {
                visibleForms.push(element);
            }
        }
        return visibleForms;
    };
    DjangoFormset.prototype.cleanForm = function (form) {
        var formTemplate = form.cloneNode(true);
        var inputs = formTemplate.querySelectorAll("input, textarea, select");
        for (var index = 0; index < inputs.length; index++) {
            var element = inputs[index];
            element.setAttribute("value", "");
        }
        return formTemplate;
    };
    DjangoFormset.prototype.getDefaultAddElement = function () {
        var addButton = document.createElement("button");
        addButton.setAttribute("type", "button");
        addButton.textContent = this.addElementDefaultText;
        return addButton;
    };
    DjangoFormset.prototype.getSetupAddElement = function () {
        var _this = this;
        var clonedElement = this.addElement.cloneNode(true);
        clonedElement.addEventListener("click", function () {
            _this.fireBeforeAdd({
                newElement: clonedElement
            });
            _this.onAddingElement(clonedElement);
            _this.fireAfterAdd({
                newElement: clonedElement
            });
        });
        return clonedElement;
    };
    DjangoFormset.prototype.onAddingElement = function (element) {
        var newElement = this.formTemplate.cloneNode(true);
        this.setupElement(newElement, this.getNumberOfTotalForms() + 1);
        this.incrementTotalForms();
        this.update();
    };
    DjangoFormset.prototype.insertNewElement = function (newElement) {
        var forms = this.getForms();
        this.insertAfter(newElement, forms[forms.length - 1]);
    };
    DjangoFormset.prototype.getDefaultDeleteElement = function () {
        var deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.textContent = this.deleteElementDefaultText;
        return deleteButton;
    };
    DjangoFormset.prototype.getSetupDeleteElement = function () {
        var _this = this;
        var clonedElement = this.deleteElement.cloneNode(true);
        clonedElement.addEventListener("click", function () {
            _this.fireBeforeDelete({
                deletedElement: clonedElement
            });
            _this.onDeletingElement(clonedElement);
            _this.fireAfterDelete({
                deletedElement: clonedElement
            });
        });
        return clonedElement;
    };
    DjangoFormset.prototype.onDeletingElement = function (element) {
        var form = element.closest(this.selector);
        if (this.canDelete) {
            this.setVisibility(form, false);
            var index = this.getIndex(this.getForms(), form);
            var deletingElementCheckBox = this.getDeletingElement(index);
            deletingElementCheckBox.checked = true;
        }
        else {
            form.remove();
        }
        this.update();
    };
    DjangoFormset.prototype.getDeleteId = function (index) {
        return this.getIdSignature(this.prefix + "-" + index + "-DELETE");
    };
    DjangoFormset.prototype.getDeletingElement = function (index) {
        return document.getElementById(this.getDeleteId(index));
    };
    DjangoFormset.prototype.getDefaultOrderElement = function () {
        var wrapper = document.createElement("div");
        var beforeButton = document.createElement("button");
        beforeButton.setAttribute("type", "button");
        beforeButton.classList.add(this.orderElementBeforeSelector.replace(".", ""));
        beforeButton.textContent = this.orderElementBeforeDefaultText;
        wrapper.append(beforeButton);
        var afterButton = document.createElement("button");
        afterButton.setAttribute("type", "button");
        afterButton.classList.add(this.orderElementAfterSelector.replace(".", ""));
        afterButton.textContent = this.orderElementAfterDefaultText;
        wrapper.append(afterButton);
        return wrapper;
    };
    DjangoFormset.prototype.getSetupOrderElement = function (orderElement) {
        var _this = this;
        if (orderElement === void 0) { orderElement = undefined; }
        var clonedElement = orderElement || this.orderElement.cloneNode(true);
        var beforeElement = clonedElement.querySelector(this.orderElementBeforeSelector);
        beforeElement.addEventListener("click", function () {
            _this.fireBeforeOrder({
                orderedElement: clonedElement
            });
            _this.onMovingBefore(clonedElement);
            _this.fireAfterOrder({
                orderedElement: clonedElement
            });
        });
        var afterElement = clonedElement.querySelector(this.orderElementAfterSelector);
        afterElement.addEventListener("click", function () {
            _this.fireBeforeOrder({
                orderedElement: clonedElement
            });
            _this.onMovingAfter(clonedElement);
            _this.fireAfterOrder({
                orderedElement: clonedElement
            });
        });
        return clonedElement;
    };
    DjangoFormset.prototype.insertAfter = function (newElement, referenceElement) {
        referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
    };
    DjangoFormset.prototype.insertBefore = function (newElement, referenceElement) {
        referenceElement.parentNode.insertBefore(newElement, referenceElement);
    };
    DjangoFormset.prototype.onMovingAfter = function (element) {
        var form = element.closest(this.selector);
        var clonedForm = form.cloneNode(true);
        var visibleForms = this.getVisibleForms();
        var referenceElement = visibleForms[this.getIndex(visibleForms, form) + 1];
        form.remove();
        this.insertAfter(this.getSetupOrderElement(clonedForm), referenceElement);
        this.update();
    };
    DjangoFormset.prototype.onMovingBefore = function (element) {
        var form = element.closest(this.selector);
        var clonedForm = form.cloneNode(true);
        var visibleForms = this.getVisibleForms();
        var referenceElement = visibleForms[this.getIndex(visibleForms, form) - 1];
        form.remove();
        this.insertBefore(this.getSetupOrderElement(clonedForm), referenceElement);
        this.update();
    };
    DjangoFormset.prototype.getIndex = function (elementList, elementReference) {
        for (var index = 0; index < elementList.length; index++) {
            var element = elementList[index];
            if (element == elementReference) {
                return index;
            }
        }
        return -1;
    };
    DjangoFormset.prototype.setup = function () {
        var forms = this.getForms();
        for (var index = 0; index < forms.length; index++) {
            var element = forms[index];
            this.setupElement(element, index + 1);
            if (this.canDelete) {
                this.hideDeleteElement(index);
            }
            if (this.canOrder) {
                this.hideOrderElement(index);
                this.setOrderValueByIndex(index.toString(), index);
            }
        }
    };
    DjangoFormset.prototype.update = function () {
        var forms = this.getForms();
        for (var index = 0; index < forms.length; index++) {
            var element = forms[index];
            this.updateElement(element, index + 1);
        }
        if (this.canDelete) {
            this.updateVisibleFormsDelete();
        }
        if (this.canOrder) {
            this.updateVisibleFormsOrder();
        }
    };
    DjangoFormset.prototype.updateElement = function (formElement, index) {
        this.recursiveAdaptChidrenToIndex(formElement, index - 1);
        this.updateAddElement(formElement, index);
        this.updateDeleteElement(formElement, index);
        if (this.canOrder) {
            this.updateOrderElement(formElement, index);
        }
    };
    DjangoFormset.prototype.recursiveAdaptChidrenToIndex = function (element, index) {
        var children = element.children;
        for (var i = 0; i < children.length; i++) {
            var element_1 = children[i];
            this.changeElementAttributesToIndex(element_1, index);
            this.recursiveAdaptChidrenToIndex(element_1, index);
        }
    };
    DjangoFormset.prototype.changeElementAttributesToIndex = function (element, index) {
        var name = element.getAttribute("name");
        if (name) {
            element.setAttribute("name", this.getReplacedNamePattern(name, index));
        }
        var forAttribute = element.getAttribute("for");
        if (forAttribute) {
            element.setAttribute("for", this.getReplacedIdPattern(forAttribute, index));
        }
        var id = element.getAttribute("id");
        if (id) {
            element.setAttribute("id", this.getReplacedIdPattern(id, index));
        }
    };
    DjangoFormset.prototype.getReplacedNamePattern = function (name, index) {
        var namePattern = new RegExp(this.prefix + "-\\d+-.+");
        if (namePattern.exec(name)) {
            var splitName = name.split("-");
            return splitName[0] + "-" + index + "-" + splitName[2];
        }
        else {
            return name;
        }
    };
    DjangoFormset.prototype.getReplacedIdPattern = function (id, index) {
        var idPattern = new RegExp(this.getIdSignature(this.prefix + "-\\d+-.+"));
        if (idPattern.exec(id)) {
            var splitId = id.split("-");
            return this.getIdSignature(splitId[0].replace(this.autoId.replace("%s", ""), "") + "-" + index + "-" + splitId[2]);
        }
        else {
            return id;
        }
    };
    DjangoFormset.prototype.getFormId = function (formElement) {
        return this.recursiveFindFirstId(formElement);
    };
    DjangoFormset.prototype.recursiveFindFirstId = function (element) {
        var children = element.children;
        for (var i = 0; i < children.length; i++) {
            var element_2 = children[i];
            var id = element_2.getAttribute("id");
            var idPattern = new RegExp(this.getIdSignature(this.prefix + "-\\d+-.+"));
            if (idPattern.exec(id)) {
                return id.split("-")[1];
            }
            else {
                var result = this.recursiveFindFirstId(element_2);
                if (result) {
                    return result;
                }
            }
        }
        return undefined;
    };
    DjangoFormset.prototype.setupElement = function (formElement, index) {
        this.recursiveAdaptChidrenToIndex(formElement, index - 1);
        var addElement = this.getSetupAddElement();
        this.setupElementInFormBySelector(formElement, addElement, this.addElementWrapperSelector);
        this.updateAddElement(formElement, index);
        var deleteElement = this.getSetupDeleteElement();
        this.setupElementInFormBySelector(formElement, deleteElement, this.deleteElementWrapperSelector);
        this.updateDeleteElement(formElement, index);
        if (this.canOrder) {
            var orderElement = this.getSetupOrderElement();
            this.setupElementInFormBySelector(formElement, orderElement, this.orderElementWrapperSelector);
            this.updateOrderElement(formElement, index);
        }
    };
    DjangoFormset.prototype.hideOrderElement = function (index) {
        var input = document.querySelector("#" + this.getOrderId(index));
        if (input) {
            this.setVisibility(input, false);
        }
        var label = document.querySelector("label[for='" + this.getOrderId(index) + "']");
        if (label) {
            this.setVisibility(label, false);
        }
    };
    DjangoFormset.prototype.getOrderId = function (index) {
        return this.getIdSignature(this.prefix + "-" + index + "-ORDER");
    };
    DjangoFormset.prototype.hideDeleteElement = function (index) {
        var input = document.querySelector("#" + this.getDeleteId(index));
        if (input) {
            this.setVisibility(input, false);
        }
        var label = document.querySelector("label[for='" + this.getDeleteId(index) + "']");
        if (label) {
            this.setVisibility(label, false);
        }
    };
    DjangoFormset.prototype.setVisibility = function (htmlElement, isVisible) {
        if (isVisible) {
            htmlElement.style.display = "block";
        }
        else {
            htmlElement.style.display = "none";
        }
    };
    DjangoFormset.prototype.updateAddElement = function (formElement, index) {
        var addWrapper = formElement.querySelector(this.addElementWrapperSelector);
        var canAdd = this.getNumberOfMaxForms() > this.getNumberOfVisibleForms();
        var visibleForms = this.getVisibleForms();
        var isVisible = canAdd && visibleForms[visibleForms.length - 1] == formElement;
        this.setVisibility(addWrapper, isVisible);
    };
    DjangoFormset.prototype.updateVisibleFormsDelete = function () {
        var visibleForms = this.getVisibleForms();
        for (var index = 0; index < visibleForms.length; index++) {
            var form = visibleForms[index];
            var id = this.getFormId(form);
            this.hideDeleteElement(index);
        }
    };
    DjangoFormset.prototype.updateVisibleFormsOrder = function () {
        var visibleForms = this.getVisibleForms();
        for (var index = 0; index < visibleForms.length; index++) {
            var form = visibleForms[index];
            var id = this.getFormId(form);
            this.setOrderValueByIndex(id, index);
            this.hideOrderElement(index);
        }
    };
    DjangoFormset.prototype.setOrderValueByIndex = function (id, index) {
        var order = document.getElementById(this.getIdSignature(this.prefix + "-" + id + "-ORDER"));
        order.setAttribute("value", index.toString());
    };
    DjangoFormset.prototype.updateDeleteElement = function (formElement, index) {
        var deleteWrapper = formElement.querySelector(this.deleteElementWrapperSelector);
        var numberOfMinForms = this.getNumberOfMinForms();
        var numberOfTotalVisibleForms = this.getNumberOfVisibleForms();
        var isVisible = numberOfTotalVisibleForms > numberOfMinForms;
        this.setVisibility(deleteWrapper, isVisible);
    };
    DjangoFormset.prototype.updateOrderElement = function (formElement, index) {
        var orderWrapper = formElement.querySelector(this.orderElementWrapperSelector);
        var visibleForms = this.getVisibleForms();
        var beforeOrderElement = orderWrapper.querySelector(this.orderElementBeforeSelector);
        var isBeforeVisible = visibleForms[0] != formElement;
        this.setVisibility(beforeOrderElement, isBeforeVisible);
        var afterOrderElement = orderWrapper.querySelector(this.orderElementAfterSelector);
        var isAfterVisible = visibleForms[visibleForms.length - 1] != formElement;
        this.setVisibility(afterOrderElement, isAfterVisible);
    };
    return DjangoFormset;
}());
