type Handler<E> = (event: E) => void;

class EventDispatcher<E> {
  private handlers: Handler<E>[] = [];
  fire(event: E) {
    for (let h of this.handlers) h(event);
  }
  register(handler: Handler<E>) {
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

  private formsWrapper: HTMLElement;
  private formTemplate: HTMLElement;

  private beforeAddDispatcher = new EventDispatcher<BeforeAddEvent>();

  private afterAddDispatcher = new EventDispatcher<AfterAddEvent>();

  private beforeDeleteDispatcher = new EventDispatcher<BeforeDeleteEvent>();

  private afterDeleteDispatcher = new EventDispatcher<AfterDeleteEvent>();

  private beforeOrderDispatcher = new EventDispatcher<BeforeOrderEvent>();

  private afterOrderDispatcher = new EventDispatcher<AfterOrderEvent>();

  private autoId: string;

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
      this.formsWrapper = formReference.parentElement;
      this.formTemplate = this.cleanForm(formReference);
    } else {
      throw "Must have atleast one form to create a template!";
    }
  }

  public onBeforeAdd(handler: Handler<BeforeAddEvent>) {
    this.beforeAddDispatcher.register(handler);
  }

  private fireBeforeAdd(event: BeforeAddEvent) {
    this.beforeAddDispatcher.fire(event);
  }

  public onAfterAdd(handler: Handler<AfterAddEvent>) {
    this.afterAddDispatcher.register(handler);
  }

  private fireAfterAdd(event: AfterAddEvent) {
    this.afterAddDispatcher.fire(event);
  }

  public onBeforeDelete(handler: Handler<BeforeDeleteEvent>) {
    this.beforeDeleteDispatcher.register(handler);
  }

  private fireBeforeDelete(event: BeforeDeleteEvent) {
    this.beforeDeleteDispatcher.fire(event);
  }

  public onAfterDelete(handler: Handler<AfterDeleteEvent>) {
    this.afterDeleteDispatcher.register(handler);
  }

  private fireAfterDelete(event: AfterDeleteEvent) {
    this.afterDeleteDispatcher.fire(event);
  }

  public onBeforeOrder(handler: Handler<BeforeOrderEvent>) {
    this.beforeOrderDispatcher.register(handler);
  }

  private fireBeforeOrder(event: BeforeOrderEvent) {
    this.beforeOrderDispatcher.fire(event);
  }

  public onAfterOrder(handler: Handler<AfterOrderEvent>) {
    this.afterOrderDispatcher.register(handler);
  }

  private fireAfterOrder(event: AfterOrderEvent) {
    this.afterOrderDispatcher.fire(event);
  }

  getIdSignature(str: string) {
    return this.autoId.replace("%s", str);
  }

  getIntValueMethodFormat(element: HTMLElement): number {
    return parseInt(element.getAttribute("value"));
  }

  setIntValueMethodFormat(element: HTMLElement, value: number): void {
    element.setAttribute("value", value.toString());
  }

  getNumberOfTotalForms(): number {
    return this.getIntValueMethodFormat(this.totalFormsElement);
  }

  getNumberOfVisibleForms(): number {
    var forms = this.getForms();
    var numberOfVisibleForms = 0;
    for (let index = 0; index < forms.length; index++) {
      const element = forms[index];
      if (element.offsetWidth > 0 && element.offsetHeight > 0) {
        numberOfVisibleForms += 1;
      }
    }
    return numberOfVisibleForms;
  }

  getNumberOfMinForms(): number {
    return this.getIntValueMethodFormat(this.minFormsElement);
  }

  getNumberOfMaxForms(): number {
    return this.getIntValueMethodFormat(this.maxFormsElement);
  }

  setupElementInFormBySelector(
    form: HTMLElement,
    element: HTMLElement,
    selector: string
  ): void {
    var elementWrapper = form.querySelector(selector);
    elementWrapper.append(element);
  }

  decrementTotalForms(): void {
    var value = parseInt(this.totalFormsElement.getAttribute("value"));
    this.totalFormsElement.setAttribute("value", (value - 1).toString());
  }

  incrementTotalForms(): void {
    var value = parseInt(this.totalFormsElement.getAttribute("value"));
    this.totalFormsElement.setAttribute("value", (value + 1).toString());
  }

  getForms(): NodeListOf<HTMLElement> {
    return document.querySelectorAll(this.selector);
  }

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

  cleanForm(form: HTMLElement): HTMLElement {
    var formTemplate = form.cloneNode(true) as HTMLElement;
    var inputs = formTemplate.querySelectorAll("input, textarea, select");
    for (let index = 0; index < inputs.length; index++) {
      const element = inputs[index];
      element.setAttribute("value", "");
    }
    return formTemplate;
  }

  getDefaultAddElement(): HTMLElement {
    var addButton = document.createElement("button");
    addButton.setAttribute("type", "button");
    addButton.textContent = this.addElementDefaultText;
    return addButton;
  }

  getSetupAddElement(): HTMLElement {
    var clonedElement = this.addElement.cloneNode(true) as HTMLElement;
    clonedElement.addEventListener("click", () => {
      this.fireBeforeAdd({
        newElement: clonedElement
      });
      this.onAddingElement(clonedElement);
      this.fireAfterAdd({
        newElement: clonedElement
      });
    });
    return clonedElement;
  }

  onAddingElement(element: HTMLElement): void {
    var newElement = this.formTemplate.cloneNode(true) as HTMLElement;
    this.setupElement(newElement, this.getNumberOfTotalForms() + 1);
    this.formsWrapper.append(newElement);
    this.incrementTotalForms();
    this.update();
  }

  getDefaultDeleteElement(): HTMLElement {
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.textContent = this.deleteElementDefaultText;
    return deleteButton;
  }

  getSetupDeleteElement(): HTMLElement {
    var clonedElement = this.deleteElement.cloneNode(true) as HTMLElement;
    clonedElement.addEventListener("click", () => {
      this.fireBeforeDelete({
        deletedElement: clonedElement
      });
      this.onDeletingElement(clonedElement);
      this.fireAfterDelete({
        deletedElement: clonedElement
      });
    });
    return clonedElement;
  }

  onDeletingElement(element: HTMLElement): void {
    var form = element.closest(this.selector) as HTMLElement;
    if (this.canDelete) {
      this.setVisibility(form, false);
      var index = this.getIndex(this.getForms(), form);
      var deletingElementCheckBox = this.getDeletingElement(index);
      deletingElementCheckBox.checked = true;
    } else {
      form.remove();
    }
    this.update();
  }

  getDeleteId(index) {
    return this.getIdSignature(`${this.prefix}-${index}-DELETE`);
  }

  getDeletingElement(index) {
    return document.getElementById(this.getDeleteId(index)) as HTMLInputElement;
  }

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

  getSetupOrderElement(orderElement: HTMLElement = undefined): HTMLElement {
    var clonedElement =
      orderElement || (this.orderElement.cloneNode(true) as HTMLElement);
    var beforeElement = clonedElement.querySelector(
      this.orderElementBeforeSelector
    );
    beforeElement.addEventListener("click", () => {
      this.fireBeforeOrder({
        orderedElement: clonedElement
      });
      this.onMovingBefore(clonedElement);
      this.fireAfterOrder({
        orderedElement: clonedElement
      });
    });

    var afterElement = clonedElement.querySelector(
      this.orderElementAfterSelector
    );
    afterElement.addEventListener("click", () => {
      this.fireBeforeOrder({
        orderedElement: clonedElement
      });
      this.onMovingAfter(clonedElement);
      this.fireAfterOrder({
        orderedElement: clonedElement
      });
    });
    return clonedElement;
  }

  insertAfter(newElement: HTMLElement, referenceElement: HTMLElement) {
    referenceElement.parentNode.insertBefore(
      newElement,
      referenceElement.nextSibling
    );
  }

  insertBefore(newElement: HTMLElement, referenceElement: HTMLElement) {
    referenceElement.parentNode.insertBefore(newElement, referenceElement);
  }

  onMovingAfter(element: HTMLElement) {
    var form = element.closest(this.selector);
    var clonedForm = form.cloneNode(true) as HTMLElement;
    var visibleForms = this.getVisibleForms();
    var referenceElement = visibleForms[this.getIndex(visibleForms, form) + 1];
    form.remove();
    this.insertAfter(this.getSetupOrderElement(clonedForm), referenceElement);
    this.update();
  }

  onMovingBefore(element: HTMLElement) {
    var form = element.closest(this.selector);
    var clonedForm = form.cloneNode(true) as HTMLElement;
    var visibleForms = this.getVisibleForms();
    var referenceElement = visibleForms[this.getIndex(visibleForms, form) - 1];
    form.remove();
    this.insertBefore(this.getSetupOrderElement(clonedForm), referenceElement);
    this.update();
  }

  getIndex(elementList, elementReference) {
    for (let index = 0; index < elementList.length; index++) {
      const element = elementList[index];
      if (element == elementReference) {
        return index;
      }
    }
    return -1;
  }

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

  updateElement(formElement: HTMLElement, index: number): void {
    this.recursiveAdaptChidrenToIndex(formElement, index - 1);

    this.updateAddElement(formElement, index);
    this.updateDeleteElement(formElement, index);

    if (this.canOrder) {
      this.updateOrderElement(formElement, index);
    }
  }

  recursiveAdaptChidrenToIndex(element: HTMLElement, index: number): void {
    var children = element.children;
    for (let i = 0; i < children.length; i++) {
      const element = children[i] as HTMLElement;
      this.changeElementAttributesToIndex(element, index);
      this.recursiveAdaptChidrenToIndex(element, index);
    }
  }

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

  getReplacedNamePattern(name: string, index: number): string {
    var namePattern = new RegExp(`${this.prefix}-\\d+-.+`);
    if (namePattern.exec(name)) {
      var splitName = name.split("-");
      return `${splitName[0]}-${index}-${splitName[2]}`;
    } else {
      return name;
    }
  }

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
  getOrderId(index: any) {
    return this.getIdSignature(`${this.prefix}-${index}-ORDER`);
  }

  hideDeleteElement(index) {
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

  setVisibility(htmlElement: HTMLElement, isVisible: boolean): void {
    if (isVisible) {
      htmlElement.style.display = "block";
    } else {
      htmlElement.style.display = "none";
    }
  }

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

  updateVisibleFormsDelete() {
    var visibleForms = this.getVisibleForms();
    for (let index = 0; index < visibleForms.length; index++) {
      var form = visibleForms[index];
      var id = this.getFormId(form);
      this.hideDeleteElement(index);
    }
  }

  updateVisibleFormsOrder() {
    var visibleForms = this.getVisibleForms();
    for (let index = 0; index < visibleForms.length; index++) {
      var form = visibleForms[index];
      var id = this.getFormId(form);
      this.setOrderValueByIndex(id, index);
      this.hideOrderElement(index);
    }
  }

  setOrderValueByIndex(id: string, index: number) {
    var order = document.getElementById(
      this.getIdSignature(`${this.prefix}-${id}-ORDER`)
    );
    order.setAttribute("value", index.toString());
  }

  updateDeleteElement(formElement: HTMLElement, index: number): void {
    var deleteWrapper = formElement.querySelector(
      this.deleteElementWrapperSelector
    ) as HTMLElement;

    var numberOfMinForms = this.getNumberOfMinForms();
    var numberOfTotalVisibleForms = this.getNumberOfVisibleForms();

    var isVisible = numberOfTotalVisibleForms > numberOfMinForms;
    this.setVisibility(deleteWrapper, isVisible);
  }

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
