export class UserForm {
  constructor(public parent: Element) {}

  eventsMap(): { [key: string]: () => void } {
    return {
      'click:button': this.onButtonClick,
      'mouseenter:h1': this.onHeaderHover,
    };
  }

  onHeaderHover(): void {
    console.log('Header Hover');
  }

  onButtonClick(): void {
    console.log('Button Click!');
  }
  template(): string {
    return `
            <div>
                <h1>User Form</h1>
                <input />
                <button>Click Me</button>
            </div>
        `;
  }

  bindEvents(fragment: DocumentFragment): void {
    const eventsMapping = this.eventsMap();

    for (let eventKey in eventsMapping) {
      const [eventName, ele] = eventKey.split(':');

      fragment.querySelectorAll(ele).forEach(element => {
        element.addEventListener(eventName, eventsMapping[eventKey]);
      });
    }
  }

  render(): void {
    const templateElement = document.createElement('template');
    templateElement.innerHTML = this.template();

    this.bindEvents(templateElement.content);

    this.parent?.append(templateElement.content);
  }
}
