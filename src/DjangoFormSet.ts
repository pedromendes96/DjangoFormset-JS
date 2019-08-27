/**
 * @author Pedro Mendes
 * @version 1.0.0
 */

type Handler<E> = (event: E) => void;

/** Class that will handle the registration and the fire of the events */
class EventDispatcher<E> {
  /** Handlers registered in the Dispatcher */
  private handlers: Handler<E>[] = [];

  /**
   * Fires the event in all the handlers that have been registered.
   * @param event - The data that handlers can evaluate
   */
  fire(event: E): void {
    for (let h of this.handlers) h(event);
  }

  /**
   * Register a handler for a respecitve dispatch of a specific event.
   * @param handler
   */
  register(handler: Handler<E>): void {
    this.handlers.push(handler);
  }
}

interface BeforeAddEvent {
  newElement: HTMLElement;
}
interface AfterAddEvent {
  newElement: HTMLElement;
}

interface BeforeDeleteEvent {
  deletedElement: HTMLElement;
}
interface AfterDeleteEvent {
  deletedElement: HTMLElement;
}

interface BeforeOrderEvent {
  orderedElement: HTMLElement;
}
interface AfterOrderEvent {
  orderedElement: HTMLElement;
}

/**
 * Class representing the formset
 */
class DjangoFormset {
  private selector: string;
  private prefix: string;

  private totalFormsElement: HTMLElement;
  private maxFormsElement: HTMLElement;
  private minFormsElement: HTMLElement;

  private addElement: HTMLElement;
  private addElementDefaultText: string;
  private addElementWrapperSelector: string;

  private canDelete: boolean;
  private deleteElement: HTMLElement;
  private deleteElementDefaultText: string;
  private deleteElementWrapperSelector: string;

  private canOrder: boolean;
  private orderElement: HTMLElement;
  private orderElementBeforeSelector: string;
  private orderElementBeforeDefaultText: string;
  private orderElementAfterSelector: string;
  private orderElementAfterDefaultText: string;
  private orderElementWrapperSelector: string;

  private formTemplate: HTMLElement;

  private beforeAddDispatcher = new EventDispatcher<BeforeAddEvent>();

  private afterAddDispatcher = new EventDispatcher<AfterAddEvent>();

  private beforeDeleteDispatcher = new EventDispatcher<BeforeDeleteEvent>();

  private afterDeleteDispatcher = new EventDispatcher<AfterDeleteEvent>();

  private beforeOrderDispatcher = new EventDispatcher<BeforeOrderEvent>();

  private afterOrderDispatcher = new EventDispatcher<AfterOrderEvent>();

  private autoId: string;

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
  constructor(
    selector: string,
    {
      prefix = "form",
      addElement = undefined,
      addElementDefaultText = "Add",
      addElementWrapperSelector = ".formset-wrapper-add",

      canDelete = false,
      deleteElement = undefined,
      deleteElementDefaultText = "Delete",
      deleteElementWrapperSelector = ".formset-wrapper-delete",

      canOrder = false,
      orderElement = undefined,
      orderElementBeforeSelector = ".formset-order-before",
      orderElementBeforeDefaultText = "Before",
      orderElementAfterSelector = ".formset-order-after",
      orderElementAfterDefaultText = "After",
      orderElementWrapperSelector = ".formset-wrapper-order",

      autoId = "id_%s"
    } = {}
  ) {
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

    this.totalFormsElement = document.getElementById(
      this.getIdSignature(`${this.prefix}-TOTAL_FORMS`)
    );
    this.minFormsElement = document.getElementById(
      this.getIdSignature(`${this.prefix}-MIN_NUM_FORMS`)
    );
    this.maxFormsElement = document.getElementById(
      this.getIdSignature(`${this.prefix}-MAX_NUM_FORMS`)
    );

    var forms = this.getForms();
    if (forms.length) {
      var formReference = forms[0];
      this.formTemplate = this.resetForm(formReference);
    } else {
      throw "Must have atleast one form to create a template!";
    }
  }

  /**
   * Regist a handle to trigger in beforeAddEvent
   * @param handler Handle that will be executed in beforeAddEvent
   */
  public onBeforeAdd(handler: Handler<BeforeAddEvent>): void {
    this.beforeAddDispatcher.register(handler);
  }

  /**
   * Trigger the beforeAddEvent
   * @param event Event that will be fired
   */
  private fireBeforeAdd(event: BeforeAddEvent): void {
    this.beforeAddDispatcher.fire(event);
  }

  /**
   * Regist a handle to trigger in afterAddEvent
   * @param handler Handle that will be executed in afterAddEvent
   */
  public onAfterAdd(handler: Handler<AfterAddEvent>): void {
    this.afterAddDispatcher.register(handler);
  }

  /**
   * Trigger the afterAddEvent
   * @param event Event that will be fired
   */
  private fireAfterAdd(event: AfterAddEvent): void {
    this.afterAddDispatcher.fire(event);
  }

  /**
   * Regist a handle to trigger in beforeDeleteEvent
   * @param handler Handle that will be executed in beforeDeleteEvent
   */
  public onBeforeDelete(handler: Handler<BeforeDeleteEvent>): void {
    this.beforeDeleteDispatcher.register(handler);
  }

  /**
   * Trigger the beforeDeleteEvent
   * @param event Event that will be fired
   */
  private fireBeforeDelete(event: BeforeDeleteEvent): void {
    this.beforeDeleteDispatcher.fire(event);
  }

  /**
   * Regist a handle to trigger in afterDeleteEvent
   * @param handler Handle that will be executed in afterDeleteEvent
   */
  public onAfterDelete(handler: Handler<AfterDeleteEvent>): void {
    this.afterDeleteDispatcher.register(handler);
  }

  /**
   * Trigger the afterDeleteEvent
   * @param event Event that will be fired
   */
  private fireAfterDelete(event: AfterDeleteEvent): void {
    this.afterDeleteDispatcher.fire(event);
  }

  /**
   * Regist a handle to trigger in beforeOrderEvent
   * @param handler Handle that will be executed in beforeOrderEvent
   */
  public onBeforeOrder(handler: Handler<BeforeOrderEvent>): void {
    this.beforeOrderDispatcher.register(handler);
  }

  /**
   * Trigger the beforeOrderEvent
   * @param event Event that will be fired
   */
  private fireBeforeOrder(event: BeforeOrderEvent): void {
    this.beforeOrderDispatcher.fire(event);
  }

  /**
   * Regist a handle to trigger in afterOrderEvent
   * @param handler Handle that will be executed in afterOrderEvent
   */
  public onAfterOrder(handler: Handler<AfterOrderEvent>): void {
    this.afterOrderDispatcher.register(handler);
  }

  /**
   * Trigger the afterOrderEvent
   * @param event Event that will be fired
   */
  private fireAfterOrder(event: AfterOrderEvent): void {
    this.afterOrderDispatcher.fire(event);
  }

  /**
   * Gets the correct id of the given autoId
   * @param id Formated id for a specific element
   * @returns Return the correct id for the desired element
   */
  getIdSignature(id: string): string {
    return this.autoId.replace("%s", id);
  }

  /**
   *  Return the integer value of the element attribute "value"
   * @param element
   */
  getIntValueMethodFormat(element: HTMLElement): number {
    try {
      return parseInt(element.getAttribute("value"));
    } catch (error) {
      return 0;
    }
  }

  /**
   * Sets the value of the attribute "value" of one specific HTMLElement
   * @param element
   * @param value
   */
  setIntValueMethodFormat(element: HTMLElement, value: number): void {
    element.setAttribute("value", value.toString());
  }

  /**
   * Returns the number of total forms (hidden forms included)
   */
  getNumberOfTotalForms(): number {
    return this.getIntValueMethodFormat(this.totalFormsElement);
  }

  /**
   * Returns the number of visible total forms (hidden forms excluded)
   */
  getNumberOfVisibleForms(): number {
    return this.getVisibleForms().length;
  }

  /**
   * Returns the value of the minimum forms inserted in the formset
   */
  getNumberOfMinForms(): number {
    return this.getIntValueMethodFormat(this.minFormsElement);
  }

  /**
   * Returns the value of the maximum forms inserted in the formset
   */
  getNumberOfMaxForms(): number {
    return this.getIntValueMethodFormat(this.maxFormsElement);
  }

  /**
   * For given css selector in one form append an element
   * @param form
   * @param element
   * @param selector
   */
  setupElementInFormBySelector(
    form: HTMLElement,
    element: HTMLElement,
    selector: string
  ): void {
    var elementWrapper = form.querySelector(selector);
    elementWrapper.append(element);
  }

  /**
   * Decrements the number of total forms in the hidden input
   */
  decrementTotalForms(): void {
    var totalNumberOfForms = this.getNumberOfTotalForms();
    this.totalFormsElement.setAttribute(
      "value",
      (totalNumberOfForms - 1).toString()
    );
  }

  /**
   * Increases the number of total forms in the hidden input
   */
  incrementTotalForms(): void {
    var totalNumberOfForms = this.getNumberOfTotalForms();
    this.totalFormsElement.setAttribute(
      "value",
      (totalNumberOfForms + 1).toString()
    );
  }

  /**
   * Return all forms of the formset.
   */
  getForms(): NodeListOf<HTMLElement> {
    return document.querySelectorAll(this.selector);
  }

  /**
   * Return a list of the current visible forms
   */
  getVisibleForms(): Array<HTMLElement> {
    var forms = this.getForms();
    var visibleForms = [];
    for (let index = 0; index < forms.length; index++) {
      const element = forms[index];
      if (element.offsetWidth > 0 && element.offsetHeight > 0) {
        visibleForms.push(element);
      }
    }
    return visibleForms;
  }

  /**
   * Cleans all the form :inputs elements
   * @param form
   */
  resetForm(form: HTMLElement): HTMLElement {
    var formTemplate = form.cloneNode(true) as HTMLElement;
    var inputs = formTemplate.querySelectorAll("input, textarea, select");
    for (let index = 0; index < inputs.length; index++) {
      const element = inputs[index];
      element.setAttribute("value", "");
    }
    return formTemplate;
  }

  /**
   * Returns a default add element.
   */
  getDefaultAddElement(): HTMLElement {
    var addButton = document.createElement("button");
    addButton.setAttribute("type", "button");
    addButton.textContent = this.addElementDefaultText;
    return addButton;
  }

  /**
   * Clone the selected addElement and sets all the existent events for the Add action
   */
  getSetupAddElement(): HTMLElement {
    var clonedElement = this.addElement.cloneNode(true) as HTMLElement;
    clonedElement.addEventListener("click", () => {
      var form = this.getParentForm(clonedElement);
      this.fireBeforeAdd({
        newElement: form
      });
      this.onAddingElement();
      this.fireAfterAdd({
        newElement: form
      });
    });
    return clonedElement;
  }

  getParentForm(element) {
    return element.closest(this.selector) as HTMLElement;
  }

  /**
   *  Clones a form , set the respective events and update the current index in the forms
   */
  onAddingElement(): void {
    var newElement = this.formTemplate.cloneNode(true) as HTMLElement;
    this.setupElement(newElement, this.getNumberOfTotalForms() + 1);
    this.insertNewElement(newElement);
    this.incrementTotalForms();
    this.update();
  }

  /**
   * Add a new form in the formset
   * @param newForm
   */
  insertNewElement(newForm): void {
    var forms = this.getForms();
    this.insertAfter(newForm, forms[forms.length - 1]);
  }

  /**
   * Returns a default delete element.
   */
  getDefaultDeleteElement(): HTMLElement {
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.textContent = this.deleteElementDefaultText;
    return deleteButton;
  }

  /**
   * Clone the selected delete element and sets all the existent events for the Delete action
   */
  getSetupDeleteElement(): HTMLElement {
    var clonedElement = this.deleteElement.cloneNode(true) as HTMLElement;
    clonedElement.addEventListener("click", () => {
      var form = this.getParentForm(clonedElement);
      this.fireBeforeDelete({
        deletedElement: form
      });
      this.onDeletingElement(form);
      this.fireAfterDelete({
        deletedElement: form
      });
    });
    return clonedElement;
  }

  /**
   * If the formset had permittion to delete, it hides the form for delete in server-side, otherwise removes from the DOM
   * @param formElement
   */
  onDeletingElement(formElement: HTMLElement): void {
    if (this.canDelete) {
      this.setVisibility(formElement, false);
      var index = this.getIndex(this.getForms(), formElement);
      var deletingElementCheckBox = this.getDeletingElement(index);
      deletingElementCheckBox.checked = true;
    } else {
      formElement.remove();
    }
    this.update();
  }

  /**
   * Returns the correct ID of the DELETE element
   * @param index
   */
  getDeleteId(index): string {
    return this.getIdSignature(`${this.prefix}-${index}-DELETE`);
  }

  /**
   * Returns the delete element
   * @param index
   */
  getDeletingElement(index): HTMLInputElement {
    return document.getElementById(this.getDeleteId(index)) as HTMLInputElement;
  }

  /**
   * Returns a default order element.
   */
  getDefaultOrderElement(): HTMLElement {
    var wrapper = document.createElement("div");

    var beforeButton = document.createElement("button");
    beforeButton.setAttribute("type", "button");
    beforeButton.classList.add(
      this.orderElementBeforeSelector.replace(".", "")
    );
    beforeButton.textContent = this.orderElementBeforeDefaultText;
    wrapper.append(beforeButton);

    var afterButton = document.createElement("button");
    afterButton.setAttribute("type", "button");
    afterButton.classList.add(this.orderElementAfterSelector.replace(".", ""));
    afterButton.textContent = this.orderElementAfterDefaultText;
    wrapper.append(afterButton);

    return wrapper;
  }

  /**
   * Clone the selected orderElement and sets all the existent events for the order action
   */
  getSetupOrderElement(orderElement: HTMLElement = undefined): HTMLElement {
    var clonedElement =
      orderElement || (this.orderElement.cloneNode(true) as HTMLElement);
    var beforeElement = clonedElement.querySelector(
      this.orderElementBeforeSelector
    );
    beforeElement.addEventListener("click", () => {
      var form = this.getParentForm(clonedElement);
      this.fireBeforeOrder({
        orderedElement: form
      });
      this.onMovingBefore(form);
      this.fireAfterOrder({
        orderedElement: form
      });
    });

    var afterElement = clonedElement.querySelector(
      this.orderElementAfterSelector
    );
    afterElement.addEventListener("click", () => {
      var form = this.getParentForm(clonedElement);
      this.fireBeforeOrder({
        orderedElement: form
      });
      this.onMovingAfter(form);
      this.fireAfterOrder({
        orderedElement: form
      });
    });
    return clonedElement;
  }

  /**
   * Insert a newElement after the referenceElement
   * @param newElement
   * @param referenceElement
   */
  insertAfter(newElement: HTMLElement, referenceElement: HTMLElement): void {
    referenceElement.parentNode.insertBefore(
      newElement,
      referenceElement.nextSibling
    );
  }

  /**
   * Insert a newElement before the referenceElement
   * @param newElement
   * @param referenceElement
   */
  insertBefore(newElement: HTMLElement, referenceElement: HTMLElement): void {
    referenceElement.parentNode.insertBefore(newElement, referenceElement);
  }

  /**
   * Clones the moving form, remove it and set the cloned in the right position
   * @param formElement
   */
  onMovingAfter(formElement: HTMLElement): void {
    var clonedForm = formElement.cloneNode(true) as HTMLElement;
    var visibleForms = this.getVisibleForms();
    var referenceElement =
      visibleForms[this.getIndex(visibleForms, formElement) + 1];
    formElement.remove();
    this.insertAfter(this.getSetupOrderElement(clonedForm), referenceElement);
    this.update();
  }

  /**
   * Clones the moving form, remove it and set the cloned in the right position
   * @param formElement
   */
  onMovingBefore(formElement: HTMLElement): void {
    var clonedForm = formElement.cloneNode(true) as HTMLElement;
    var visibleForms = this.getVisibleForms();
    var referenceElement =
      visibleForms[this.getIndex(visibleForms, formElement) - 1];
    formElement.remove();
    this.insertBefore(this.getSetupOrderElement(clonedForm), referenceElement);
    this.update();
  }

  /**
   * Returns the index of a element in a list, in can the element doesn't exist returns -1
   * @param elementList
   * @param elementReference
   */
  getIndex(elementList, elementReference): number {
    for (let index = 0; index < elementList.length; index++) {
      const element = elementList[index];
      if (element == elementReference) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Creates every help elements, and hides extra fields
   */
  setup(): void {
    var forms = this.getForms();
    for (let index = 0; index < forms.length; index++) {
      const element = forms[index];
      this.setupElement(element, index + 1);

      if (this.canDelete) {
        this.hideDeleteElement(index);
      }

      if (this.canOrder) {
        this.hideOrderElement(index);
        this.setOrderValueByIndex(index.toString(), index);
      }
    }
  }

  /**
   * Updates the visibility of the elements around the form and update the index of the fields
   */
  update(): void {
    var forms = this.getForms();
    for (let index = 0; index < forms.length; index++) {
      const element = forms[index];
      this.updateElement(element, index + 1);
    }

    if (this.canDelete) {
      this.updateVisibleFormsDelete();
    }

    if (this.canOrder) {
      this.updateVisibleFormsOrder();
    }
  }

  /**
   * For a given element updates the index and sets elements visibility
   * @param formElement
   * @param index
   */
  updateElement(formElement: HTMLElement, index: number): void {
    this.recursiveAdaptChidrenToIndex(formElement, index - 1);

    this.updateAddElement(formElement, index);
    this.updateDeleteElement(formElement, index);

    if (this.canOrder) {
      this.updateOrderElement(formElement, index);
    }
  }

  /**
   * Search for all children and change the name, for, id attributes if exist in the element and respect the respective regex.
   * @param element
   * @param index
   */
  recursiveAdaptChidrenToIndex(element: HTMLElement, index: number): void {
    var children = element.children;
    for (let i = 0; i < children.length; i++) {
      const element = children[i] as HTMLElement;
      this.changeElementAttributesToIndex(element, index);
      this.recursiveAdaptChidrenToIndex(element, index);
    }
  }

  /**
   * For an elemnt changes the attributes if respect a specific regex
   * @param element
   * @param index
   */
  changeElementAttributesToIndex(element: HTMLElement, index: number): void {
    var name = element.getAttribute("name");
    if (name) {
      element.setAttribute("name", this.getReplacedNamePattern(name, index));
    }

    var forAttribute = element.getAttribute("for");
    if (forAttribute) {
      element.setAttribute(
        "for",
        this.getReplacedIdPattern(forAttribute, index)
      );
    }

    var id = element.getAttribute("id");
    if (id) {
      element.setAttribute("id", this.getReplacedIdPattern(id, index));
    }
  }

  /**
   * Changes the attribute name if respects the regex
   * @param name
   * @param index
   */
  getReplacedNamePattern(name: string, index: number): string {
    var namePattern = new RegExp(`${this.prefix}-\\d+-.+`);
    if (namePattern.exec(name)) {
      var splitName = name.split("-");
      return `${splitName[0]}-${index}-${splitName[2]}`;
    } else {
      return name;
    }
  }

  /**
   * Changes the attribute id if respects the regex
   * @param id
   * @param index
   */
  getReplacedIdPattern(id, index): string {
    var idPattern = new RegExp(this.getIdSignature(`${this.prefix}-\\d+-.+`));
    if (idPattern.exec(id)) {
      var splitId = id.split("-");
      return this.getIdSignature(
        `${splitId[0].replace(this.autoId.replace("%s", ""), "")}-${index}-${
          splitId[2]
        }`
      );
    } else {
      return id;
    }
  }

  /**
   * Return the form index
   * @param formElement
   */
  getFormId(formElement: HTMLElement): string {
    return this.recursiveFindFirstId(formElement);
  }

  recursiveFindFirstId(element: HTMLElement): string {
    var children = element.children;
    for (let i = 0; i < children.length; i++) {
      const element = children[i] as HTMLElement;
      var id = element.getAttribute("id");
      var idPattern = new RegExp(this.getIdSignature(`${this.prefix}-\\d+-.+`));
      if (idPattern.exec(id)) {
        return id.split("-")[1];
      } else {
        var result = this.recursiveFindFirstId(element);
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  }

  /**
   * for a given form, gets the addElement, deleteElement, orderElement(if canOrder=True) and setup them in correct place in the DOM
   * @param formElement
   * @param index
   */
  setupElement(formElement: HTMLElement, index: number): void {
    this.recursiveAdaptChidrenToIndex(formElement, index - 1);

    var addElement = this.getSetupAddElement();
    this.setupElementInFormBySelector(
      formElement,
      addElement,
      this.addElementWrapperSelector
    );
    this.updateAddElement(formElement, index);

    var deleteElement = this.getSetupDeleteElement();
    this.setupElementInFormBySelector(
      formElement,
      deleteElement,
      this.deleteElementWrapperSelector
    );
    this.updateDeleteElement(formElement, index);

    if (this.canOrder) {
      var orderElement = this.getSetupOrderElement();
      this.setupElementInFormBySelector(
        formElement,
        orderElement,
        this.orderElementWrapperSelector
      );
      this.updateOrderElement(formElement, index);
    }
  }

  /**
   * Hides all the order inputs set by django
   * @param index
   */
  hideOrderElement(index) {
    var input = document.querySelector(
      `#${this.getOrderId(index)}`
    ) as HTMLElement;
    if (input) {
      this.setVisibility(input, false);
    }

    var label = document.querySelector(
      `label[for='${this.getOrderId(index)}']`
    ) as HTMLElement;
    if (label) {
      this.setVisibility(label, false);
    }
  }

  /**
   * Returns the signature of the ORDER field
   * @param index
   */
  getOrderId(index: number): string {
    return this.getIdSignature(`${this.prefix}-${index}-ORDER`);
  }

  /**
   * Hides all the delete inputs set by django
   * @param index
   */
  hideDeleteElement(index): void {
    var input = document.querySelector(
      `#${this.getDeleteId(index)}`
    ) as HTMLElement;
    if (input) {
      this.setVisibility(input, false);
    }

    var label = document.querySelector(
      `label[for='${this.getDeleteId(index)}']`
    ) as HTMLElement;
    if (label) {
      this.setVisibility(label, false);
    }
  }

  /**
   * Set the visibility of htmlElement
   * @param htmlElement
   * @param isVisible
   */
  setVisibility(htmlElement: HTMLElement, isVisible: boolean): void {
    if (isVisible) {
      htmlElement.style.display = "block";
    } else {
      htmlElement.style.display = "none";
    }
  }

  /**
   * Update the visibility of the add elements in one specific form
   * @param formElement
   * @param index
   */
  updateAddElement(formElement: HTMLElement, index: number): void {
    var addWrapper = formElement.querySelector(
      this.addElementWrapperSelector
    ) as HTMLElement;
    var canAdd = this.getNumberOfMaxForms() > this.getNumberOfVisibleForms();
    var visibleForms = this.getVisibleForms();
    var isVisible =
      canAdd && visibleForms[visibleForms.length - 1] == formElement;
    this.setVisibility(addWrapper, isVisible);
  }

  /**
   * Update the visibility of the delete elements in all forms
   */
  updateVisibleFormsDelete(): void {
    var visibleForms = this.getVisibleForms();
    for (let index = 0; index < visibleForms.length; index++) {
      var form = visibleForms[index];
      this.hideDeleteElement(index);
    }
  }

  /**
   * Update all visibility of the dependent elements of all visibile forms
   */
  updateVisibleFormsOrder(): void {
    var visibleForms = this.getVisibleForms();
    for (let index = 0; index < visibleForms.length; index++) {
      var form = visibleForms[index];
      var id = this.getFormId(form);
      this.setOrderValueByIndex(id, index);
      this.hideOrderElement(index);
    }
  }

  /**
   * Sets the correct order for the given form index
   * @param id
   * @param index
   */
  setOrderValueByIndex(id: string, index: number): void {
    var order = document.getElementById(
      this.getIdSignature(`${this.prefix}-${id}-ORDER`)
    );
    order.setAttribute("value", index.toString());
  }

  /**
   * c
   * @param formElement
   * @param index
   */
  updateDeleteElement(formElement: HTMLElement, index: number): void {
    var deleteWrapper = formElement.querySelector(
      this.deleteElementWrapperSelector
    ) as HTMLElement;

    var numberOfMinForms = this.getNumberOfMinForms();
    var numberOfTotalVisibleForms = this.getNumberOfVisibleForms();

    var isVisible = numberOfTotalVisibleForms > numberOfMinForms;
    this.setVisibility(deleteWrapper, isVisible);
  }

  /**
   * Update the visibility of the order elements in one specific form
   * @param formElement
   * @param index
   */
  updateOrderElement(formElement: HTMLElement, index: number): void {
    var orderWrapper = formElement.querySelector(
      this.orderElementWrapperSelector
    ) as HTMLElement;

    var visibleForms = this.getVisibleForms();

    var beforeOrderElement = orderWrapper.querySelector(
      this.orderElementBeforeSelector
    ) as HTMLElement;
    var isBeforeVisible = visibleForms[0] != formElement;
    this.setVisibility(beforeOrderElement, isBeforeVisible);

    var afterOrderElement = orderWrapper.querySelector(
      this.orderElementAfterSelector
    ) as HTMLElement;
    var isAfterVisible = visibleForms[visibleForms.length - 1] != formElement;
    this.setVisibility(afterOrderElement, isAfterVisible);
  }
}
