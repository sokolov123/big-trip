import { render, replace, remove } from '../framework/render';
import EventEditorView from '../view/event-editor-view';
import PointInListView from '../view/point-in-list';

const PointMode = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT'
};

export default class PointPresenter {

  #point = null;
  #editPoint = null;
  #eventPoint = null;
  #container = null;
  #mode = PointMode.DEFAULT;
  _callback = {};

  constructor(container, beforeEdit, onDelete) {
    this.#container = container;
    this._callback.beforeEdit = beforeEdit;
    this._callback.onDelete = onDelete;
  }

  get point() {
    return this.#point;
  }

  init = (point) => {

    this.#point = point;
    const prevEventPoint = this.#eventPoint;
    const prevEditPoint = this.#editPoint;
    this.#editPoint = new EventEditorView(point);
    this.#eventPoint = new PointInListView(point);

    this.#eventPoint.setEditClickHandler(() => {
      this.#replacePointToEdit(this.#eventPoint, this.#editPoint);
    });

    this.#editPoint.setRollupHandler(() => {
      this.#replaceEditToPoint(this.#eventPoint, this.#editPoint);
    });

    this.#editPoint.setFormSubmitHandler(() => {
      this.#replaceEditToPoint(this.#eventPoint, this.#editPoint);
    });

    this.#editPoint.setDeleteHandler(() => {
      this._callback.onDelete(this);
      this.destroy();
    });

    if (prevEventPoint === null || prevEditPoint === null) {
      render(this.#eventPoint, this.#container.element);
      return;
    }

    if (this.#mode === PointMode.DEFAULT) {
      render(this.#eventPoint, this.#container.element);
    }

    if (this.#mode === PointMode.EDIT) {
      render(this.#editPoint, this.#container.element);
    }

    remove(prevEventPoint);
    remove(prevEditPoint);
  };

  destroy = () => {
    remove(this.#editPoint);
    remove(this.#eventPoint);
  };

  resetView = () => {
    if (this.#mode !== PointMode.DEFAULT) {
      this.#replaceEditToPoint(this.#eventPoint, this.#editPoint);
    }
  };

  #replacePointToEdit = (point, edit) => {
    this._callback.beforeEdit();
    replace(edit, point);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#mode = PointMode.EDIT;
  };

  #replaceEditToPoint = (point, edit) => {
    replace(point, edit);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = PointMode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditToPoint(this.#eventPoint, this.#editPoint);
    }
  };
}
