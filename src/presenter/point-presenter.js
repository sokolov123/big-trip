import { render } from '../framework/render';

export default class PointPresenter {

  #editPoint = null;
  #eventPoint = null;

  constructor(editPoint, eventPoint) {
    this.#editPoint = editPoint;
    this.#eventPoint = eventPoint;
  }

  get eventPoint() {
    return this.#eventPoint;
  }

  get editPoint() {
    return this.#editPoint;
  }

  renderPoint = (container) => {

    const replacePointToEdit = (point, edit) => {
      container.element.replaceChild(edit.element, point.element);
    };

    const replaceEditToPoint = (point, edit) => {
      container.element.replaceChild(point.element, edit.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToPoint(this.#eventPoint, this.#editPoint);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    this.#eventPoint.setEditClickHandler(() => {
      replacePointToEdit(this.#eventPoint, this.#editPoint);
      document.addEventListener('keydown', onEscKeyDown);
    });

    this.#editPoint.setRollupHandler(() => {
      replaceEditToPoint(this.#eventPoint, this.#editPoint);
      document.removeEventListener('keydown', onEscKeyDown);
    });

    this.#editPoint.setFormSubmitHandler(() => {
      replaceEditToPoint(this.#eventPoint, this.#editPoint);
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(this.#eventPoint, container.element);
  };
}
