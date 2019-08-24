class Formset {
  private selector: string;
  private prefix: string;

  private addElement: Element;
  private addElementDefaultText: string;
  private addElementWrapperSelector: string;

  private canDelete: boolean;
  private deleteElement: Element;
  private deleteElementDefaultText: string;
  private deleteElementWrapperSelector: string;

  private canOrder: boolean;
  private orderElement: Element;
  private orderElementDefaultText: Object;
  private orderElementWrapperSelector: string;

  private formsWrapper: Element;
  private forms: NodeListOf<Element>;
  private formTemplate: Element;

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
    prefix: string = "",

    addElement: Element = null,
    addElementDefaultText: string = "Add",
    addElementWrapperSelector: string,

    canDelete: boolean = false,
    deleteElement: Element = null,
    deleteElementDefaultText: string = "Delete",
    deleteElementWrapperSelector: string,

    canOrder: boolean = false,
    orderElement: Element = null,
    orderElementDefaultText: Object = {
      before: "Before",
      after: "After"
    },
    orderElementWrapperSelector: string
  ) {
    this.selector = selector;
    this.prefix = prefix;

    this.addElement = addElement || this.getDefaultAddElement();
    this.addElementDefaultText = addElementDefaultText;
    this.addElementWrapperSelector = addElementWrapperSelector;

    this.canDelete = canDelete;
    this.deleteElement = deleteElement || this.getDefaultDeleteElement();
    this.deleteElementDefaultText = deleteElementDefaultText;

    this.canOrder = canOrder;
    this.orderElement = orderElement || this.getDefaultOrderElement();
    this.orderElementDefaultText = orderElementDefaultText;
    this.orderElement;

    this.forms = document.querySelectorAll(this.selector);
    if (this.forms.length) {
      let formReference = this.forms[0];
      this.formsWrapper = formReference.parentElement;
      this.formTemplate = this.cleanForm(formReference);
    } else {
      throw "Must have atleast one form to create a template!";
    }

    this.beforeAddEvent = new CustomEvent(this.beforeAddEventName) || null;
    this.afterAddEvent = new CustomEvent(this.afterAddEventName) || null;

    this.beforeDeleteEvent =
      new CustomEvent(this.beforeDeleteEventName) || null;
    this.afterDeleteEvent = new CustomEvent(this.afterDeleteEventName) || null;

    this.beforeOrderEvent = new CustomEvent(this.beforeOrderEventName) || null;
    this.afterOrderEvent = new CustomEvent(this.afterOrderEventName) || null;
  }

  cleanForm(form: Element): Element {
    var formTemplate = (form.cloneNode(true) as Element) as Element;
    var inputs = formTemplate.querySelectorAll(":input");
    for (let index = 0; index < inputs.length; index++) {
      const element = inputs[index];
      element.setAttribute("value", "");
    }
    return formTemplate;
  }

  getDefaultAddElement(): Element {
    var addButton = document.createElement("button");
    addButton.setAttribute("type", "button");
    addButton.textContent = this.addElementDefaultText;
    return addButton;
  }

  setupAddNode(): Node {
    var clonedElement = this.addElement.cloneNode(true) as Element;
    clonedElement.addEventListener("click", () => {
      clonedElement.dispatchEvent(this.beforeAddEvent);
      this.onAddElement(clonedElement);
      clonedElement.dispatchEvent(this.afterAddEvent);
    });
    return clonedElement;
  }

  onAddElement(node: Element): void {}

  getDefaultDeleteElement(): Element {
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.textContent = this.deleteElementDefaultText;
    return deleteButton;
  }

  setupDeleteElement(): Element {
    var clonedElement = this.deleteElement.cloneNode(true) as Element;
    clonedElement.addEventListener("click", () => {
      clonedElement.dispatchEvent(this.beforeDeleteEvent);
      this.onDeleteElement(clonedElement);
      clonedElement.dispatchEvent(this.afterDeleteEvent);
    });
    return clonedElement;
  }

  onDeleteElement(node: Element): void {}

  getDefaultOrderElement(): Element {
    var wrapper = document.createElement("div");

    var beforeButton = document.createElement("button");
    beforeButton.setAttribute("type", "button");
    beforeButton.textContent = this.orderElementDefaultText["before"];

    var afterButton = document.createElement("button");
    afterButton.setAttribute("type", "button");
    afterButton.textContent = this.orderElementDefaultText["after"];

    wrapper.append(beforeButton, afterButton);

    return wrapper;
  }

  setupOrderElement(): Element {
    var clonedElement = this.addElement.cloneNode(true) as Element;
    clonedElement.addEventListener("click", () => {
      clonedElement.dispatchEvent(this.beforeOrderEvent);
      this.onOrderElement(clonedElement);
      clonedElement.dispatchEvent(this.afterOrderEvent);
    });
    return clonedElement;
  }

  onOrderElement(node: Element): void {}

  setup(): void {}
}
