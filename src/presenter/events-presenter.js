import SortView from '../view/sort-view.js';
// import EventCreatorView from '../view/event-creator-view.js';
import EventEditorView from '../view/event-editor-view.js';
import PointInListView from '../view/point-in-list.js';
import EventsUlistView from '../view/events-ulist-view.js';
import { render } from '../render.js';

export default class EventsPresenter {

  #eventsUlistView = new EventsUlistView();

  init = (eventsContainer, pointsModel) => {
    this.eventsContainer = eventsContainer;
    this.pointsModel = pointsModel;
    this.eventPoints = [...pointsModel.getPoints()];
    this.eventDestinations = [...pointsModel.getDestinations()];
    this.eventOffers = [...pointsModel.getOffers()];
    render (new SortView(), this.eventsContainer);
    render(this.#eventsUlistView, this.eventsContainer);
    const currentOffersByType = this.pointsModel.getOffersByType(this.eventPoints[0]);
    // render(new EventCreatorView(), this.#eventsUlistView.getElement());

    for (let i = 0; i < this.eventPoints.length; i++) {
      const editPoint = new EventEditorView(this.eventPoints[i],
        this.eventDestinations,
        currentOffersByType);
      const eventPoint = new PointInListView(this.eventPoints[i],
        this.eventDestinations[i],
        this.eventOffers[i]);
      this.#renderPoint(eventPoint, editPoint);
    }
  };

  #renderPoint = (eventPoint, editPoint) => {

    const replacePointToEdit = (point, edit) => {
      this.#eventsUlistView.element.replaceChild(edit.element, point.element);
    };

    const replaceEditToPoint = (point, edit) => {
      this.#eventsUlistView.element.replaceChild(point.element, edit.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToPoint(eventPoint, editPoint);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    eventPoint.rollupButton.addEventListener('click', () => {
      replacePointToEdit(eventPoint, editPoint);
      document.addEventListener('keydown', onEscKeyDown);
    });
    editPoint.rollupButton.addEventListener('click', () => {
      replaceEditToPoint(eventPoint, editPoint);
      document.removeEventListener('keydown', onEscKeyDown);
    });
    editPoint.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditToPoint(eventPoint, editPoint);
      document.removeEventListener('keydown', onEscKeyDown);
    });
    render(eventPoint, this.#eventsUlistView.element);
  };
}
