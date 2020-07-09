/**
 * @author Pedro Mendes
 * @version 1.0.0
 */
/** Class that will handle the registration and the fire of the events */
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
        /** Handlers registered in the Dispatcher */
        this.handlers = [];
    }
    /**
     * Fires the event in all the handlers that have been registered.
     * @param event - The data that handlers can evaluate
     */
    EventDispatcher.prototype.fire = function (event) {
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var h = _a[_i];
            h(event);
        }
    };
    /**
     * Register a handler for a respecitve dispatch of a specific event.
     * @param handler
     */
    EventDispatcher.prototype.register = function (handler) {
        this.handlers.push(handler);
    };
    return EventDispatcher;
}());
/**
 * Class representing the formset
 */
var DjangoFormset = /** @class */ (function () {
    /**
     * Create a instance of the DjangoFormset
     * @param {string} selector
     * @param {string} [prefix="form"]
     * @param {HTMLElement} [addElement=undefined]
     * @param {string} [addElementDefaultText="Add"]
     * @param {string} [addElementWrapperSelector=".formset-wrapper-add"]
     * @param {boolean} [canDelete=false]
     * @param {HTMLElement} [deleteElement=undefined]
     * @param {string} [deleteElementDefaultText="Delete"]
     * @param {string} [deleteElementWrapperSelector=".formset-wrapper-delete"]
     * @param {boolean} [canOrder=false]
     * @param {HTMLElement} [orderElement=undefined]
     * @param {string} [orderElementBeforeSelector=".formset-order-before"]
     * @param {string} [orderElementBeforeDefaultText="Before"]
     * @param {string} [orderElementAfterSelector=".formset-order-after"]
     * @param {string} [orderElementAfterDefaultText="After"]
     * @param {string} [orderElementWrapperSelector=".formset-wrapper-order"]
     * @param {string} [autoId="id_%s"]
     */
    function DjangoFormset(selector, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.prefix, prefix = _c === void 0 ? "form" : _c, _d = _b.addElement, addElement = _d === void 0 ? undefined : _d, _e = _b.addElementDefaultText, addElementDefaultText = _e === void 0 ? "Add" : _e, _f = _b.addElementWrapperSelector, addElementWrapperSelector = _f === void 0 ? ".formset-wrapper-add" : _f, _g = _b.addElementActionFunction, addElementActionFunction = _g === void 0 ? undefined : _g, _h = _b.addVisibilityFunction, addVisibilityFunction = _h === void 0 ? undefined : _h, _j = _b.canDelete, canDelete = _j === void 0 ? false : _j, _k = _b.deleteElement, deleteElement = _k === void 0 ? undefined : _k, _l = _b.deleteElementDefaultText, deleteElementDefaultText = _l === void 0 ? "Delete" : _l, _m = _b.deleteElementWrapperSelector, deleteElementWrapperSelector = _m === void 0 ? ".formset-wrapper-delete" : _m, _o = _b.deleteVisibilityFunction, deleteVisibilityFunction = _o === void 0 ? null : _o, _p = _b.excludeRecursiveClasses, excludeRecursiveClasses = _p === void 0 ? [] : _p, _q = _b.canOrder, canOrder = _q === void 0 ? false : _q, _r = _b.orderElement, orderElement = _r === void 0 ? undefined : _r, _s = _b.showOrderElement, showOrderElement = _s === void 0 ? true : _s, _t = _b.orderElementBeforeSelector, orderElementBeforeSelector = _t === void 0 ? ".formset-order-before" : _t, _u = _b.orderElementBeforeDefaultText, orderElementBeforeDefaultText = _u === void 0 ? "Before" : _u, _v = _b.orderElementAfterSelector, orderElementAfterSelector = _v === void 0 ? ".formset-order-after" : _v, _w = _b.orderElementAfterDefaultText, orderElementAfterDefaultText = _w === void 0 ? "After" : _w, _x = _b.orderElementWrapperSelector, orderElementWrapperSelector = _x === void 0 ? ".formset-wrapper-order" : _x, _y = _b.autoId, autoId = _y === void 0 ? "id_%s" : _y;
        this.beforeAddDispatcher = new EventDispatcher();
        this.afterAddDispatcher = new EventDispatcher();
        this.beforeDeleteDispatcher = new EventDispatcher();
        this.afterDeleteDispatcher = new EventDispatcher();
        this.beforeMoveBackDispatcher = new EventDispatcher();
        this.afterMoveBackDispatcher = new EventDispatcher();
        this.beforeMoveFowardDispatcher = new EventDispatcher();
        this.afterMoveFowardDispatcher = new EventDispatcher();
        this.resetInitialFormDispatcher = new EventDispatcher();
        this.selector = selector;
        this.prefix = prefix;
        this.addElementDefaultText = addElementDefaultText;
        this.addElementWrapperSelector = addElementWrapperSelector;
        this.addElementActionFunction = addElementActionFunction;
        this.addVisibilityFunction = addVisibilityFunction;
        this.canDelete = canDelete;
        this.deleteElementDefaultText = deleteElementDefaultText;
        this.deleteElementWrapperSelector = deleteElementWrapperSelector;
        this.deleteVisibilityFunction = deleteVisibilityFunction;
        this.excludeRecursiveClasses = excludeRecursiveClasses;
        this.canOrder = canOrder;
        this.showOrderElement = showOrderElement;
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
    }
    /**
     * Regist a handle to trigger in beforeAddEvent
     * @param handler Handle that will be executed in beforeAddEvent
     */
    DjangoFormset.prototype.onBeforeAdd = function (handler) {
        this.beforeAddDispatcher.register(handler);
    };
    /**
     * Trigger the beforeAddEvent
     * @param event Event that will be fired
     */
    DjangoFormset.prototype.fireBeforeAdd = function (event) {
        this.beforeAddDispatcher.fire(event);
    };
    /**
     * Regist a handle to trigger in afterAddEvent
     * @param handler Handle that will be executed in afterAddEvent
     */
    DjangoFormset.prototype.onAfterAdd = function (handler) {
        this.afterAddDispatcher.register(handler);
    };
    /**
     * Trigger the afterAddEvent
     * @param event Event that will be fired
     */
    DjangoFormset.prototype.fireAfterAdd = function (event) {
        this.afterAddDispatcher.fire(event);
    };
    /**
     * Regist a handle to trigger in beforeDeleteEvent
     * @param handler Handle that will be executed in beforeDeleteEvent
     */
    DjangoFormset.prototype.onBeforeDelete = function (handler) {
        this.beforeDeleteDispatcher.register(handler);
    };
    /**
     * Trigger the beforeDeleteEvent
     * @param event Event that will be fired
     */
    DjangoFormset.prototype.fireBeforeDelete = function (event) {
        this.beforeDeleteDispatcher.fire(event);
    };
    /**
     * Regist a handle to trigger in afterDeleteEvent
     * @param handler Handle that will be executed in afterDeleteEvent
     */
    DjangoFormset.prototype.onAfterDelete = function (handler) {
        this.afterDeleteDispatcher.register(handler);
    };
    /**
     * Trigger the afterDeleteEvent
     * @param event Event that will be fired
     */
    DjangoFormset.prototype.fireAfterDelete = function (event) {
        this.afterDeleteDispatcher.fire(event);
    };
    /**
     * Trigger the ResetInitialFormEvent
     * @param event Event that will be fired
     */
    DjangoFormset.prototype.fireResetInitialForm = function (event) {
        this.resetInitialFormDispatcher.fire(event);
    };
    DjangoFormset.prototype.onBeforeMoveBack = function (handler) {
        this.beforeMoveBackDispatcher.register(handler);
    };
    DjangoFormset.prototype.fireBeforeMoveBack = function (event) {
        this.beforeMoveBackDispatcher.fire(event);
    };
    DjangoFormset.prototype.onAfterMoveBack = function (handler) {
        this.afterMoveBackDispatcher.register(handler);
    };
    DjangoFormset.prototype.fireAfterMoveBack = function (event) {
        this.afterMoveBackDispatcher.fire(event);
    };
    DjangoFormset.prototype.onBeforeMoveFoward = function (handler) {
        this.beforeMoveFowardDispatcher.register(handler);
    };
    DjangoFormset.prototype.fireBeforeMoveFoward = function (event) {
        this.beforeMoveFowardDispatcher.fire(event);
    };
    DjangoFormset.prototype.onAfterMoveFoward = function (handler) {
        this.afterMoveFowardDispatcher.register(handler);
    };
    DjangoFormset.prototype.fireAfterMoveFoward = function (event) {
        this.afterMoveFowardDispatcher.fire(event);
    };
    DjangoFormset.prototype.onResetInitialForm = function (handler) {
        this.resetInitialFormDispatcher.register(handler);
    };
    DjangoFormset.prototype.resetInitialForm = function (event) {
        this.resetInitialFormDispatcher.fire(event);
    };
    /**
     * Gets the correct id of the given autoId
     * @param id Formated id for a specific element
     * @returns Return the correct id for the desired element
     */
    DjangoFormset.prototype.getIdSignature = function (id) {
        console.log("Calling getIdSignature...");
        var idSignature = this.autoId.replace("%s", id);
        console.log("idSignature: ", idSignature);
        return idSignature;
    };
    /**
     *  Return the integer value of the element attribute "value"
     * @param element
     */
    DjangoFormset.prototype.getIntValueMethodFormat = function (element) {
        try {
            return parseInt(element.getAttribute("value"));
        }
        catch (error) {
            return 0;
        }
    };
    /**
     * Sets the value of the attribute "value" of one specific HTMLElement
     * @param element
     * @param value
     */
    DjangoFormset.prototype.setIntValueMethodFormat = function (element, value) {
        element.setAttribute("value", value.toString());
    };
    /**
     * Returns the number of total forms (hidden forms included)
     */
    DjangoFormset.prototype.getNumberOfTotalForms = function () {
        return this.getIntValueMethodFormat(this.totalFormsElement);
    };
    /**
     * Returns the number of visible total forms (hidden forms excluded)
     */
    DjangoFormset.prototype.getNumberOfVisibleForms = function () {
        return this.getVisibleForms().length;
    };
    /**
     * Returns the value of the minimum forms inserted in the formset
     */
    DjangoFormset.prototype.getNumberOfMinForms = function () {
        return this.getIntValueMethodFormat(this.minFormsElement);
    };
    /**
     * Returns the value of the maximum forms inserted in the formset
     */
    DjangoFormset.prototype.getNumberOfMaxForms = function () {
        return this.getIntValueMethodFormat(this.maxFormsElement);
    };
    /**
     * For given css selector in one form append an element
     * @param form
     * @param element
     * @param selector
     */
    DjangoFormset.prototype.setupElementInFormBySelector = function (form, element, selector) {
        var elementWrapper = form.querySelector(selector);
        elementWrapper.append(element);
    };
    /**
     * Allow to give a id to a existent modelForm
     * @param index
     * @param value
     */
    DjangoFormset.prototype.addIdToForm = function (index, value) {
        var hiddenPrimaryKey = document.getElementById("id_videos-" + index + "-id");
        if (hiddenPrimaryKey) {
            hiddenPrimaryKey.setAttribute("value", value);
        }
    };
    /**
     * Decrements the number of total forms in the hidden input
     */
    DjangoFormset.prototype.decrementTotalForms = function () {
        var totalNumberOfForms = this.getNumberOfTotalForms();
        this.totalFormsElement.setAttribute("value", (totalNumberOfForms - 1).toString());
    };
    /**
     * Increases the number of total forms in the hidden input
     */
    DjangoFormset.prototype.incrementTotalForms = function () {
        var totalNumberOfForms = this.getNumberOfTotalForms();
        this.totalFormsElement.setAttribute("value", (totalNumberOfForms + 1).toString());
    };
    /**
     * Return all forms of the formset.
     */
    DjangoFormset.prototype.getForms = function () {
        return document.querySelectorAll(this.selector);
    };
    /**
     * Return a list of the current visible forms
     */
    DjangoFormset.prototype.getVisibleForms = function () {
        var forms = this.getForms();
        var visibleForms = [];
        for (var index = 0; index < forms.length; index++) {
            var element = forms[index];
            if (element.style.display != "none") {
                visibleForms.push(element);
            }
        }
        return visibleForms;
    };
    /**
     * Cleans all the form :inputs elements
     * @param form
     */
    DjangoFormset.prototype.resetForm = function (form) {
        var formTemplate = form.cloneNode(true);
        var inputs = formTemplate.querySelectorAll("input, textarea, select");
        for (var index = 0; index < inputs.length; index++) {
            var element = inputs[index];
            element.setAttribute("value", "");
        }
        return formTemplate;
    };
    /**
     * Returns a default add element.
     */
    DjangoFormset.prototype.getDefaultAddElement = function () {
        var addButton = document.createElement("button");
        addButton.setAttribute("type", "button");
        addButton.textContent = this.addElementDefaultText;
        return addButton;
    };
    /**
     * Clone the selected addElement and sets all the existent events for the Add action
     */
    DjangoFormset.prototype.getSetupAddElement = function () {
        var _this = this;
        var clonedElement = this.addElement.cloneNode(true);
        clonedElement.addEventListener("click", function () {
            var form = _this.getParentForm(clonedElement);
            _this.fireBeforeAdd({
                newElement: form
            });
            if (_this.addElementActionFunction) {
                _this.addElementActionFunction(_this.getIndex(_this.getVisibleForms(), form));
            }
            else {
                _this.onAddingElement();
            }
            _this.fireAfterAdd({
                newElement: form
            });
        });
        return clonedElement;
    };
    DjangoFormset.prototype.getParentForm = function (element) {
        return element.closest(this.selector);
    };
    /**
     *  Clones a form , set the respective events and update the current index in the forms
     */
    DjangoFormset.prototype.onAddingElement = function () {
        var newElement = this.formTemplate.cloneNode(true);
        this.setupElement(newElement, this.getNumberOfTotalForms() + 1);
        this.insertNewElement(newElement);
        this.incrementTotalForms();
        this.update();
    };
    /**
     * Add a new form in the formset
     * @param newForm
     */
    DjangoFormset.prototype.insertNewElement = function (newForm) {
        var forms = this.getForms();
        this.insertAfter(newForm, forms[forms.length - 1]);
    };
    /**
     * Returns a default delete element.
     */
    DjangoFormset.prototype.getDefaultDeleteElement = function () {
        var deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.textContent = this.deleteElementDefaultText;
        return deleteButton;
    };
    /**
     * Clone the selected delete element and sets all the existent events for the Delete action
     */
    DjangoFormset.prototype.getSetupDeleteElement = function () {
        var _this = this;
        var clonedElement = this.deleteElement.cloneNode(true);
        clonedElement.addEventListener("click", function () {
            var form = _this.getParentForm(clonedElement);
            _this.fireBeforeDelete({
                deletedElement: form
            });
            _this.onDeletingElement(form);
            _this.fireAfterDelete({
                deletedElement: form
            });
        });
        return clonedElement;
    };
    /**
     * If the formset had permittion to delete, it hides the form for delete in server-side, otherwise removes from the DOM
     * @param formElement
     */
    DjangoFormset.prototype.onDeletingElement = function (formElement) {
        if (this.canDelete) {
            this.setVisibility(formElement, false);
            var index = this.getIndex(this.getForms(), formElement);
            var deletingElementCheckBox = this.getDeletingElement(index);
            deletingElementCheckBox.checked = true;
        }
        else {
            formElement.remove();
        }
        this.update();
    };
    /**
     * Returns the correct ID of the DELETE element
     * @param index
     */
    DjangoFormset.prototype.getDeleteId = function (index) {
        return this.getIdSignature(this.prefix + "-" + index + "-DELETE");
    };
    /**
     * Returns the delete element
     * @param index
     */
    DjangoFormset.prototype.getDeletingElement = function (index) {
        return document.getElementById(this.getDeleteId(index));
    };
    /**
     * Returns a default order element.
     */
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
    /**
     * Clone the selected orderElement and sets all the existent events for the order action
     */
    DjangoFormset.prototype.getSetupOrderElement = function (orderElement) {
        var _this = this;
        if (orderElement === void 0) { orderElement = undefined; }
        var clonedElement = orderElement || this.orderElement.cloneNode(true);
        var beforeElement = clonedElement.querySelector(this.orderElementBeforeSelector);
        beforeElement.addEventListener("click", function () {
            var form = _this.getParentForm(clonedElement);
            _this.fireBeforeMoveBack({
                orderedElement: form
            });
            _this.onMovingBefore(form);
            _this.fireAfterMoveBack({
                orderedElement: form
            });
        });
        var afterElement = clonedElement.querySelector(this.orderElementAfterSelector);
        afterElement.addEventListener("click", function () {
            var form = _this.getParentForm(clonedElement);
            _this.fireBeforeMoveFoward({
                orderedElement: form
            });
            _this.onMovingAfter(form);
            _this.fireAfterMoveFoward({
                orderedElement: form
            });
        });
        return clonedElement;
    };
    /**
     * Insert a newElement after the referenceElement
     * @param newElement
     * @param referenceElement
     */
    DjangoFormset.prototype.insertAfter = function (newElement, referenceElement) {
        referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
    };
    /**
     * Insert a newElement before the referenceElement
     * @param newElement
     * @param referenceElement
     */
    DjangoFormset.prototype.insertBefore = function (newElement, referenceElement) {
        referenceElement.parentNode.insertBefore(newElement, referenceElement);
    };
    DjangoFormset.prototype.moveForm = function (formElement, index) {
        var clonedForm = formElement.cloneNode(true);
        var visibleForms = this.getVisibleForms();
        var referenceElement = visibleForms[index];
        formElement.remove();
        if (index < visibleForms.length - 1) {
            this.insertBefore(clonedForm, referenceElement);
        }
        else {
            this.insertAfter(clonedForm, referenceElement);
        }
        this.update();
    };
    /**
     * Clones the moving form, remove it and set the cloned in the right position
     * @param formElement
     */
    DjangoFormset.prototype.onMovingAfter = function (formElement) {
        var clonedForm = formElement.cloneNode(true);
        var visibleForms = this.getVisibleForms();
        var referenceElement = visibleForms[this.getIndex(visibleForms, formElement) + 1];
        formElement.remove();
        this.insertAfter(this.getSetupOrderElement(clonedForm), referenceElement);
        this.update();
    };
    /**
     * Clones the moving form, remove it and set the cloned in the right position
     * @param formElement
     */
    DjangoFormset.prototype.onMovingBefore = function (formElement) {
        var clonedForm = formElement.cloneNode(true);
        var visibleForms = this.getVisibleForms();
        var referenceElement = visibleForms[this.getIndex(visibleForms, formElement) - 1];
        formElement.remove();
        this.insertBefore(this.getSetupOrderElement(clonedForm), referenceElement);
        this.update();
    };
    /**
     * Returns the index of a element in a list, in can the element doesn't exist returns -1
     * @param elementList
     * @param elementReference
     */
    DjangoFormset.prototype.getIndex = function (elementList, elementReference) {
        for (var index = 0; index < elementList.length; index++) {
            var element = elementList[index];
            if (element == elementReference) {
                return index;
            }
        }
        return -1;
    };
    /**
     * Creates every help elements, and hides extra fields
     */
    DjangoFormset.prototype.setup = function () {
        var forms = this.getForms();
        if (forms.length) {
            var formReference = forms[0];
            this.formTemplate = this.resetForm(formReference);
            this.fireResetInitialForm({
                form: this.formTemplate
            });
        }
        else {
            throw "Must have atleast one form to create a template!";
        }
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
    /**
     * Updates the visibility of the elements around the form and update the index of the fields
     */
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
    /**
     * For a given element updates the index and sets elements visibility
     * @param formElement
     * @param index
     */
    DjangoFormset.prototype.updateElement = function (formElement, index) {
        this.recursiveAdaptChidrenToIndex(formElement, index - 1);
        this.updateAddElement(formElement, index);
        this.updateDeleteElement(formElement, index);
        if (this.canOrder) {
            this.updateOrderElement(formElement, index);
        }
    };
    /**
     * Search for all children and change the name, for, id attributes if exist in the element and respect the respective regex.
     * @param element
     * @param index
     */
    DjangoFormset.prototype.recursiveAdaptChidrenToIndex = function (element, index) {
        var children = element.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var canProcede = true;
            for (var index_1 = 0; index_1 < this.excludeRecursiveClasses.length; index_1++) {
                console.log("child.classList: ", child.classList);
                if (child.classList.contains(this.excludeRecursiveClasses[index_1])) {
                    console.log("Can't procede because this child contains the class: ", this.excludeRecursiveClasses[index_1]);
                    canProcede = false;
                    break;
                }
            }
            if (canProcede) {
                console.log("Checking recursive elements in the child", child);
                this.changeElementAttributesToIndex(child, index);
                this.recursiveAdaptChidrenToIndex(child, index);
            }
        }
    };
    /**
     * For an elemnt changes the attributes if respect a specific regex
     * @param element
     * @param index
     */
    DjangoFormset.prototype.changeElementAttributesToIndex = function (element, index) {
        var name = element.getAttribute("name");
        if (name) {
            var replaced_name = this.getReplacedNamePattern(name, index);
            console.log("Changing the current name -> " + name + " to the new name with the index -> " + replaced_name);
            element.setAttribute("name", replaced_name);
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
    /**
     * Changes the attribute name if respects the regex
     * @param name
     * @param index
     */
    DjangoFormset.prototype.getReplacedNamePattern = function (name, index) {
        var namePattern = new RegExp(this.prefix + "-\\d+-.+");
        if (namePattern.exec(name)) {
            var nameWithoutPrefix = name.replace(this.prefix, "");
            if (nameWithoutPrefix[0] == "-") {
                nameWithoutPrefix = nameWithoutPrefix.substr(1);
            }
            var splitName = nameWithoutPrefix.split("-").filter(Boolean);
            var restOfNamePart = splitName.slice(1);
            return this.prefix + "-" + index + "-" + restOfNamePart.join("-");
        }
        else {
            return name;
        }
    };
    /**
     * Changes the attribute id if respects the regex
     * @param id
     * @param index
     */
    DjangoFormset.prototype.getReplacedIdPattern = function (id, index) {
        var idPattern = new RegExp(this.getIdSignature(this.prefix + "-\\d+-.+"));
        if (idPattern.exec(id)) {
            var autoIdWithoutStringPlaceholder = this.autoId.replace("%s", "");
            var idPrefix = autoIdWithoutStringPlaceholder + this.prefix;
            var idWithoutPrefix = id.replace(idPrefix, "");
            var splitId = idWithoutPrefix.split("-").filter(Boolean);
            var restOfIdPart = splitId.slice(1);
            return idPrefix + "-" + index + "-" + restOfIdPart.join("-");
        }
        else {
            return id;
        }
    };
    /**
     * Return the form index
     * @param formElement
     */
    DjangoFormset.prototype.getFormId = function (formElement) {
        return this.recursiveFindFirstId(formElement);
    };
    DjangoFormset.prototype.recursiveFindFirstId = function (element) {
        var children = element.children;
        for (var i = 0; i < children.length; i++) {
            var element_1 = children[i];
            var id = element_1.getAttribute("id");
            var idPattern = new RegExp(this.getIdSignature(this.prefix + "-\\d+-.+"));
            if (idPattern.exec(id)) {
                return id.split("-")[1];
            }
            else {
                var result = this.recursiveFindFirstId(element_1);
                if (result) {
                    return result;
                }
            }
        }
        return undefined;
    };
    /**
     * for a given form, gets the addElement, deleteElement, orderElement(if canOrder=True) and setup them in correct place in the DOM
     * @param formElement
     * @param index
     */
    DjangoFormset.prototype.setupElement = function (formElement, index) {
        this.recursiveAdaptChidrenToIndex(formElement, index - 1);
        var addElement = this.getSetupAddElement();
        this.setupElementInFormBySelector(formElement, addElement, this.addElementWrapperSelector);
        this.updateAddElement(formElement, index);
        var deleteElement = this.getSetupDeleteElement();
        this.setupElementInFormBySelector(formElement, deleteElement, this.deleteElementWrapperSelector);
        this.updateDeleteElement(formElement, index);
        if (this.canOrder) {
            if (this.showOrderElement) {
                var orderElement = this.getSetupOrderElement();
                this.setupElementInFormBySelector(formElement, orderElement, this.orderElementWrapperSelector);
            }
            this.updateOrderElement(formElement, index);
        }
    };
    /**
     * Hides all the order inputs set by django
     * @param index
     */
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
    /**
     * Returns the signature of the ORDER field
     * @param index
     */
    DjangoFormset.prototype.getOrderId = function (index) {
        return this.getIdSignature(this.prefix + "-" + index + "-ORDER");
    };
    /**
     * Hides all the delete inputs set by django
     * @param index
     */
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
    /**
     * Set the visibility of htmlElement
     * @param htmlElement
     * @param isVisible
     */
    DjangoFormset.prototype.setVisibility = function (htmlElement, isVisible) {
        if (isVisible) {
            htmlElement.style.display = "block";
        }
        else {
            htmlElement.style.display = "none";
        }
    };
    /**
     * Update the visibility of the add elements in one specific form
     * @param formElement
     * @param index
     */
    DjangoFormset.prototype.updateAddElement = function (formElement, index) {
        var addWrapper = formElement.querySelector(this.addElementWrapperSelector);
        var canAdd = this.getNumberOfMaxForms() > this.getNumberOfVisibleForms();
        var visibleForms = this.getVisibleForms();
        var isVisible;
        if (this.addVisibilityFunction) {
            isVisible = this.addVisibilityFunction(formElement, index);
        }
        else {
            isVisible =
                canAdd && visibleForms[visibleForms.length - 1] == formElement;
        }
        this.setVisibility(addWrapper, isVisible);
    };
    /**
     * Update the visibility of the delete elements in all forms
     */
    DjangoFormset.prototype.updateVisibleFormsDelete = function () {
        var visibleForms = this.getVisibleForms();
        for (var index = 0; index < visibleForms.length; index++) {
            this.hideDeleteElement(index);
        }
    };
    /**
     * Update all visibility of the dependent elements of all visibile forms
     */
    DjangoFormset.prototype.updateVisibleFormsOrder = function () {
        var visibleForms = this.getVisibleForms();
        for (var index = 0; index < visibleForms.length; index++) {
            var form = visibleForms[index];
            var id = this.getFormId(form);
            this.setOrderValueByIndex(id, index);
            this.hideOrderElement(index);
        }
    };
    /**
     * Sets the correct order for the given form index
     * @param id
     * @param index
     */
    DjangoFormset.prototype.setOrderValueByIndex = function (id, index) {
        var order = document.getElementById(this.getIdSignature(this.prefix + "-" + id + "-ORDER"));
        order.setAttribute("value", index.toString());
    };
    /**
     * c
     * @param formElement
     * @param index
     */
    DjangoFormset.prototype.updateDeleteElement = function (formElement, index) {
        var deleteWrapper = formElement.querySelector(this.deleteElementWrapperSelector);
        var numberOfMinForms = this.getNumberOfMinForms();
        var numberOfTotalVisibleForms = this.getNumberOfVisibleForms();
        var isVisible;
        if (this.deleteVisibilityFunction) {
            isVisible = this.deleteVisibilityFunction(formElement, index);
        }
        else {
            isVisible = numberOfTotalVisibleForms > numberOfMinForms;
        }
        this.setVisibility(deleteWrapper, isVisible);
    };
    /**
     * Update the visibility of the order elements in one specific form
     * @param formElement
     * @param index
     */
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
