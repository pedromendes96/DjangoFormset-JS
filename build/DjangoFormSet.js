var Formset = /** @class */ (function () {
    function Formset(selector, prefix, addElement, addElementDefaultText, addElementSelector, canDelete, deleteElement, deleteElementDefaultText, deleteElementSelector, canOrder, orderElement, orderElementDefaultText, orderElementSelector) {
        if (prefix === void 0) { prefix = ""; }
        if (addElement === void 0) { addElement = null; }
        if (addElementDefaultText === void 0) { addElementDefaultText = "Add"; }
        if (canDelete === void 0) { canDelete = false; }
        if (deleteElement === void 0) { deleteElement = null; }
        if (deleteElementDefaultText === void 0) { deleteElementDefaultText = "Delete"; }
        if (canOrder === void 0) { canOrder = false; }
        if (orderElement === void 0) { orderElement = null; }
        if (orderElementDefaultText === void 0) { orderElementDefaultText = {
            before: "Before",
            after: "After"
        }; }
        this.beforeAddEventName = "beforeadd";
        this.afterAddEventName = "afteradd";
        this.beforeDeleteEventName = "beforedelete";
        this.afterDeleteEventName = "afterdelete";
        this.beforeOrderEventName = "beforeorder";
        this.afterOrderEventName = "afterorder";
        this.selector = selector;
        this.prefix = prefix;
        this.addElement = addElement || this.getDefaultAddElement();
        this.addElementDefaultText = addElementDefaultText;
        this.canDelete = canDelete;
        this.deleteElement = deleteElement || this.getDefaultDeleteElement();
        this.deleteElementDefaultText = deleteElementDefaultText;
        this.canOrder = canOrder;
        this.orderElement = orderElement || this.getDefaultOrderElement();
        this.orderElementDefaultText = orderElementDefaultText;
        this.forms = document.querySelectorAll(this.selector);
        if (this.forms.length) {
            var formReference = this.forms[0];
            this.formsWrapper = formReference.parentElement;
            this.formTemplate = this.cleanForm(formReference);
        }
        this.beforeAddEvent = new CustomEvent(this.beforeAddEventName) || null;
        this.afterAddEvent = new CustomEvent(this.afterAddEventName) || null;
        this.beforeDeleteEvent =
            new CustomEvent(this.beforeDeleteEventName) || null;
        this.afterDeleteEvent = new CustomEvent(this.afterDeleteEventName) || null;
        this.beforeOrderEvent = new CustomEvent(this.beforeOrderEventName) || null;
        this.afterOrderEvent = new CustomEvent(this.afterOrderEventName) || null;
    }
    Formset.prototype.cleanForm = function (form) {
        var formTemplate = form.cloneNode(true);
        var inputs = formTemplate.querySelectorAll(":input");
        for (var index = 0; index < inputs.length; index++) {
            var element = inputs[index];
            element.setAttribute("value", "");
        }
        return formTemplate;
    };
    Formset.prototype.getDefaultAddElement = function () {
        var addButton = document.createElement("button");
        addButton.setAttribute("type", "button");
        addButton.textContent = this.addElementDefaultText;
        return addButton;
    };
    Formset.prototype.setupAddNode = function () {
        var _this = this;
        var clonedElement = this.addElement.cloneNode(true);
        clonedElement.addEventListener("click", function () {
            clonedElement.dispatchEvent(_this.beforeAddEvent);
            _this.onAddElement(clonedElement);
            clonedElement.dispatchEvent(_this.afterAddEvent);
        });
        return clonedElement;
    };
    Formset.prototype.onAddElement = function (node) { };
    Formset.prototype.getDefaultDeleteElement = function () {
        var deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.textContent = this.deleteElementDefaultText;
        return deleteButton;
    };
    Formset.prototype.setupDeleteElement = function () {
        var _this = this;
        var clonedElement = this.deleteElement.cloneNode(true);
        clonedElement.addEventListener("click", function () {
            clonedElement.dispatchEvent(_this.beforeDeleteEvent);
            _this.onDeleteElement(clonedElement);
            clonedElement.dispatchEvent(_this.afterDeleteEvent);
        });
        return clonedElement;
    };
    Formset.prototype.onDeleteElement = function (node) { };
    Formset.prototype.getDefaultOrderElement = function () {
        var wrapper = document.createElement("div");
        var beforeButton = document.createElement("button");
        beforeButton.setAttribute("type", "button");
        beforeButton.textContent = this.orderElementDefaultText["before"];
        var afterButton = document.createElement("button");
        afterButton.setAttribute("type", "button");
        afterButton.textContent = this.orderElementDefaultText["after"];
        wrapper.append(beforeButton, afterButton);
        return wrapper;
    };
    Formset.prototype.setupOrderElement = function () {
        var _this = this;
        var clonedElement = this.addElement.cloneNode(true);
        clonedElement.addEventListener("click", function () {
            clonedElement.dispatchEvent(_this.beforeOrderEvent);
            _this.onOrderElement(clonedElement);
            clonedElement.dispatchEvent(_this.afterOrderEvent);
        });
        return clonedElement;
    };
    Formset.prototype.onOrderElement = function (node) { };
    Formset.prototype.setup = function () { };
    return Formset;
}());
