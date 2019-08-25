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

  private beforeAddEventName = "beforeadd";
  private beforeAddEvent: CustomEvent;
  private afterAddEventName = "afteradd";
  private afterAddEvent: CustomEvent;

  private beforeDeleteEventName = "beforedelete";
  private beforeDeleteEvent: CustomEvent;
  private afterDeleteEventName = "afterdelete";
  private afterDeleteEvent: CustomEvent;

  private beforeOrderEventName = "beforeorder";
  private beforeOrderEvent: CustomEvent;
  private afterOrderEventName = "afterorder";
  private afterOrderEvent: CustomEvent;

  constructor(
    selector: string,
    {
      prefix = "form",
      addElement = null,
      addElementDefaultText = "Add",
      addElementWrapperSelector = ".formset-wrapper-add",

      canDelete = false,
      deleteElement = null,
      deleteElementDefaultText = "Delete",
      deleteElementWrapperSelector = ".formset-wrapper-delete",

      canOrder = false,
      orderElement = null,
      orderElementBeforeSelector = ".formset-order-before",
      orderElementBeforeDefaultText = "Before",
      orderElementAfterSelector = ".formset-order-after",
      orderElementAfterDefaultText = "After",
      orderElementWrapperSelector = ".formset-wrapper-order"
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

    this.totalFormsElement = document.getElementById(
      `id_${this.prefix}-TOTAL_FORMS`
    );
    this.minFormsElement = document.getElementById(
      `id_${this.prefix}-MIN_NUM_FORMS`
    );
    this.maxFormsElement = document.getElementById(
      `id_${this.prefix}-MAX_NUM_FORMS`
    );

    var forms = this.getForms();
    if (forms.length) {
      var formReference = forms[0];
      this.formsWrapper = formReference.parentElement;
      this.formTemplate = this.cleanForm(formReference);
    } else {
      throw "Must have atleast one form to create a template!";
    }

    this.beforeAddEvent = new CustomEvent(this.beforeAddEventName);
    this.afterAddEvent = new CustomEvent(this.afterAddEventName);

    if (this.canDelete) {
      this.beforeDeleteEvent = new CustomEvent(this.beforeDeleteEventName);
      this.afterDeleteEvent = new CustomEvent(this.afterDeleteEventName);
    }

    if (this.canOrder) {
      this.beforeOrderEvent = new CustomEvent(this.beforeOrderEventName);
      this.afterOrderEvent = new CustomEvent(this.afterOrderEventName);
    }
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

  cleanForm(form: HTMLElement): HTMLElement {
    var formTemplate = form.cloneNode(true) as HTMLElement;
    var inputs = formTemplate.querySelectorAll("input");
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
      clonedElement.dispatchEvent(this.beforeAddEvent);
      this.onAddingElement(clonedElement);
      clonedElement.dispatchEvent(this.afterAddEvent);
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
      clonedElement.dispatchEvent(this.beforeDeleteEvent);
      this.onDeletingElement(clonedElement);
      clonedElement.dispatchEvent(this.afterDeleteEvent);
    });
    return clonedElement;
  }

  onDeletingElement(element: HTMLElement): void {
    var form = element.closest(this.selector) as HTMLElement;
    this.setVisibility(form, false);
    var index = this.getIndex(this.getForms(), form);
    var deletingElementCheckBox = this.getDeletingElement(index);
    deletingElementCheckBox.checked = true;
    this.update();
  }

  getDeletingElement(index) {
    return document.getElementById(
      `id_${this.prefix}-${index}-DELETE`
    ) as HTMLInputElement;
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

  getSetupOrderElement(): HTMLElement {
    var clonedElement = this.orderElement.cloneNode(true) as HTMLElement;
    var beforeElement = clonedElement.querySelector(
      this.orderElementBeforeSelector
    );
    beforeElement.addEventListener("click", () => {
      clonedElement.dispatchEvent(this.beforeOrderEvent);
      this.onMovingBefore(clonedElement);
      clonedElement.dispatchEvent(this.afterOrderEvent);
    });

    var afterElement = clonedElement.querySelector(
      this.orderElementAfterSelector
    );
    afterElement.addEventListener("click", () => {
      clonedElement.dispatchEvent(this.beforeOrderEvent);
      this.onMovingAfter(clonedElement);
      clonedElement.dispatchEvent(this.afterOrderEvent);
    });
    return clonedElement;
  }

  insertAfter(newElement: HTMLElement, referenceElement: HTMLElement) {
    referenceElement.parentNode.insertBefore(
      newElement,
      referenceElement.nextSibling
    );
  }

  onMovingAfter(element: HTMLElement) {
    var form = element.closest(this.selector);
    var clonedForm = form.cloneNode(true) as HTMLElement;
    var forms = this.getForms();
    var referenceElement = forms[this.getIndex(forms, form) + 1];
    form.remove();
    this.insertAfter(clonedForm, referenceElement);
  }

  onMovingBefore(element: HTMLElement) {
    var form = element.closest(this.selector);
    var clonedForm = form.cloneNode(true) as HTMLElement;
    var forms = this.getForms();
    var referenceElement = forms[this.getIndex(forms, form) - 1];
    form.remove();
    this.insertAfter(clonedForm, referenceElement);
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
    }
  }

  update(): void {
    var forms = this.getForms();
    for (let index = 0; index < forms.length; index++) {
      const element = forms[index];
      this.updateElement(element, index + 1);
    }
  }

  updateElement(formElement: HTMLElement, index: number): void {
    this.recursiveAdaptChidrenToIndex(formElement, index - 1);

    this.updateAddElement(formElement, index);
    if (this.canDelete) {
      this.updateDeleteElement(formElement, index);
    }
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
    var idPattern = new RegExp(`id_${this.prefix}-\\d+-.+`);
    if (idPattern.exec(id)) {
      var splitId = id.split("-");
      return `id_${splitId[0].replace("id_", "")}-${index}-${splitId[2]}`;
    } else {
      return id;
    }
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

    if (this.canDelete) {
      var deleteElement = this.getSetupDeleteElement();
      this.setupElementInFormBySelector(
        formElement,
        deleteElement,
        this.deleteElementWrapperSelector
      );
      this.updateDeleteElement(formElement, index);
    }

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
    var isVisible = index == this.getNumberOfTotalForms();
    this.setVisibility(addWrapper, isVisible);
  }

  updateDeleteElement(formElement: HTMLElement, index: number): void {
    var deleteWrapper = formElement.querySelector(
      this.deleteElementWrapperSelector
    ) as HTMLElement;

    var numberOfMinForms = this.getNumberOfMinForms();
    var numberOfTotalForms = this.getNumberOfTotalForms();

    var isVisible = numberOfTotalForms > numberOfMinForms;
    this.setVisibility(deleteWrapper, isVisible);
  }

  updateOrderElement(formElement: HTMLElement, index: number): void {
    var orderWrapper = formElement.querySelector(
      this.orderElementWrapperSelector
    ) as HTMLElement;

    var beforeOrderElement = orderWrapper.querySelector(
      this.orderElementBeforeSelector
    ) as HTMLElement;
    var isBeforeVisible = index != 1;
    this.setVisibility(beforeOrderElement, isBeforeVisible);

    var numberOfTotalForms = this.getNumberOfTotalForms();

    var afterOrderElement = orderWrapper.querySelector(
      this.orderElementAfterSelector
    ) as HTMLElement;
    var isAfterVisible = index != numberOfTotalForms;
    this.setVisibility(afterOrderElement, isAfterVisible);
  }
}
