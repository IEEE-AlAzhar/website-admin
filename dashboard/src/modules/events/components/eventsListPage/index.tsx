import React, { Component } from "react";

import AdminLayout from "shared/admin-layout";
import AdminTable from "shared/admin-table";
import Loading from "shared/loading";
import EventForm from "../eventForm";

import EventService from "modules/events/services/event.service";
import { Event } from "configurations/interfaces/event.interface";

import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import UserService from "modules/users/services/user.service";

interface Prop {
  history: {
    push: (path: string) => void;
  };
}

interface State {
  events: Event[];
  eventToBeEdited?: Event | null;
  successAlert: string;
  errorAlert: string;
  isLoading: boolean;
  isCreateModalOpened: boolean;
  isSubmitting: boolean;
  idOfItemToBeDeleted: string;
}

export default class EventsListPage extends Component<Prop, State> {
  tableConfig = {
    tableHeaders: [
      "title",
      "status"
    ],
    className: "table-striped",
    actions: ["edit", "delete"],
  };

  state = {
    events: [] as Event[],
    successAlert: "",
    errorAlert: "",
    eventToBeEdited: {} as Event,
    isLoading: false,
    isCreateModalOpened: false,
    isSubmitting: false,
    idOfItemToBeDeleted: "",
  };

  public _eventService: EventService;
  public _userService: UserService;
  constructor(props: Prop) {
    super(props);
    this._eventService = new EventService();
    this._userService = new UserService();
  }

  async componentDidMount() {
    if (!this._userService.isUserLoggedIn())
      return this.props.history.push("/login");

    this.setState({ isLoading: true });
    try {
      let events = await this._eventService.list();

      this.setState({ events, isLoading: false });
    } catch {
      this.setState({ errorAlert: "Error retrieving items", isLoading: false });
    }
  }

  createEvent = (event: Event) => {
    let { events } = this.state;

    this.setState({
      isSubmitting: true,
    });

    return this._eventService
      .create(event)
      .then((response) => {
        events.unshift(response as never);

        this.setState({
          events,
          successAlert: "Event added successfully",
          errorAlert: "",
          isCreateModalOpened: false,
          isSubmitting: false,
        });
      })
      .catch((err) => {
        this.setState({
          errorAlert: err.response.data.msg,
          successAlert: "",
          isSubmitting: false,
        });
      });
  };

  editEvent = (
    event: Event,
    submit: boolean,
    id = this.state.eventToBeEdited._id
  ) => {
    if (submit) {
      this.setState({
        isSubmitting: true,
      });
      return this._eventService
        .update(id, event)
        .then((response) => {
          this.updateStateWithNewEvent(response);
          this.setState({
            isSubmitting: false,
            successAlert: "Event updated successfully",
            errorAlert: "",
            eventToBeEdited: {} as Event,
          });
        })
        .catch((err) => {
          this.setState({
            errorAlert: err.response.data.msg,
          });
        });
    } else {
      this.setState({
        isSubmitting: false,
        eventToBeEdited: event,
      });
    }
  };

  updateStateWithNewEvent = (event: Event) => {
    let { events } = this.state;
    let objectToUpdateIndex: number = events.findIndex(
      (item: Event) => item._id === event._id
    );

    events.splice(objectToUpdateIndex, 1, Event as never);

    this.setState({ events });
  };

  removeEvent = (id: string, submit?: boolean) => {
    let { events } = this.state;

    if (submit) {
      this._eventService.delete(id).then(() => {
        this.setState({
          events: events.filter((item: Event) => item._id !== id),
        });
      });
    } else {
      this.setState({
        idOfItemToBeDeleted: id,
      });
    }
  };

  render() {
    let {
      events,
      successAlert,
      errorAlert,
      eventToBeEdited,
      idOfItemToBeDeleted,
      isLoading,
      isCreateModalOpened,
      isSubmitting,
    } = this.state;

    return (
      <AdminLayout>
        <header className="d-flex justify-content-between container mt-5">
          <h2> Events </h2>
          <button
            className="btn btn-success"
            onClick={() => this.setState({ isCreateModalOpened: true })}
          >
            <FontAwesomeIcon icon={faPlus} /> Create New Event
          </button>
        </header>
        {isLoading ? (
          <div className="text-center mt-5">
            <Loading />
          </div>
        ) : events.length > 0 ? (
          <div className="container mt-5">
            <AdminTable
              config={this.tableConfig}
              triggerEditEvent={this.editEvent}
              deleteRow={this.removeEvent}
              tableBody={events as any}
            />
          </div>
        ) : (
          <div className="text-center my-5">
            <p>No Events yet</p>
          </div>
        )}

        {Object.keys(eventToBeEdited).length > 1 && (
          <EventForm
            isModalOpened={Object.keys(eventToBeEdited).length > 1}
            itemToBeEdited={eventToBeEdited}
            onSubmit={this.editEvent}
            isSubmitting={isSubmitting}
            closeModal={() => this.setState({ eventToBeEdited: {} as Event })}
          />
        )}

        <EventForm
          isModalOpened={isCreateModalOpened}
          isSubmitting={isSubmitting}
          onSubmit={this.createEvent}
          closeModal={() => this.setState({ isCreateModalOpened: false })}
        />

        <SweetAlert
          show={!!successAlert}
          success
          title={successAlert || " "}
          timeout={2000}
          onConfirm={() => this.setState({ successAlert: null })}
        />

        <SweetAlert
          show={!!errorAlert}
          warning
          title="An error occurred"
          timeout={2000}
          onConfirm={() => this.setState({ errorAlert: null })}
        >
          {errorAlert}
        </SweetAlert>

        <SweetAlert
          warning
          showCancel
          confirmBtnText="Yes, delete it!"
          confirmBtnBsStyle="danger"
          title="Are you sure?"
          onConfirm={() => {
            this.removeEvent(idOfItemToBeDeleted, true);
            this.setState({ idOfItemToBeDeleted: "" });
          }}
          onCancel={() => this.setState({ idOfItemToBeDeleted: "" })}
          focusCancelBtn
          show={!!idOfItemToBeDeleted}
        >
          You will not be able to recover this item !
        </SweetAlert>
      </AdminLayout>
    );
  }
}
