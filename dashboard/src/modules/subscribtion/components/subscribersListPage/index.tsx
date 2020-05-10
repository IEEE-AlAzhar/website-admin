import React, { Component } from "react";

import AdminLayout from "shared/admin-layout";
import AdminTable from "shared/admin-table";
import Loading from "shared/loading";
import EmailForm from "../form";

import UserService from "modules/users/services/user.service";
import SubscriberService from "modules/subscribtion/services/subscriber.service";
import { Subscriber } from "configurations/interfaces/subscriber.interface";
import { Email } from "configurations/interfaces/email.interface";

import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface Prop {
  history: {
    push: (path: string) => void;
  };
}

interface State {
  subscribers: Subscriber[];
  successAlert: string;
  errorAlert: string;
  isLoading: boolean;
  isCreateModalOpened: boolean;
  isSubmitting: boolean;
  idOfItemToBeDeleted: string;
}

export default class SubscribersListPage extends Component<Prop, State> {
  tableConfig = {
    tableHeaders: ["email"],
    className: "table-striped",
    actions: ["delete"],
  };

  state = {
    subscribers: [] as Subscriber[],
    successAlert: "",
    errorAlert: "",
    isLoading: false,
    isCreateModalOpened: false,
    isSubmitting: false,
    idOfItemToBeDeleted: "",
  };

  public _subscriberService: SubscriberService;
  public _userService: UserService;

  constructor(props: Prop) {
    super(props);
    this._subscriberService = new SubscriberService();
    this._userService = new UserService();
  }

  async componentDidMount() {
    if (!this._userService.isUserLoggedIn())
      return this.props.history.push("/login");
    this.setState({ isLoading: true });
    try {
      let subscribers = await this._subscriberService.list();

      this.setState({ subscribers, isLoading: false });
    } catch {
      this.setState({ errorAlert: "Error retrieving items", isLoading: false });
    }
  }

  sendEmailToSubscribers = (email: Email) => {
    return this._subscriberService
      .sendEmail(email)
      .then((response) => {
        this.setState({ successAlert: response.msg });
      })
      .catch((err) => this.setState({ errorAlert: err.response.data.msg }));
  };

  removeSubscriber = (id: string, submit?: boolean) => {
    let { subscribers } = this.state;

    if (submit) {
      this._subscriberService
        .delete(id)
        .then(() => {
          this.setState({
            subscribers: subscribers.filter(
              (item: Subscriber) => item._id !== id
            ),
            successAlert: "Subscriber removed successfully",
          });
        })
        .catch((err) => {
          this.setState({
            errorAlert: err.response.data.msg,
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
      subscribers,
      successAlert,
      errorAlert,
      idOfItemToBeDeleted,
      isLoading,
      isCreateModalOpened,
      isSubmitting,
    } = this.state;

    return (
      <AdminLayout>
        <header className="d-flex justify-content-between container mt-5">
          <h2> Subscribers </h2>
          <button
            className="btn btn-success"
            onClick={() => this.setState({ isCreateModalOpened: true })}
          >
            <FontAwesomeIcon icon={faPlus} /> Create New Email
          </button>
        </header>
        {isLoading ? (
          <div className="text-center mt-5">
            <Loading />
          </div>
        ) : subscribers.length > 0 ? (
          <div className="container mt-5">
            <AdminTable
              config={this.tableConfig}
              deleteRow={this.removeSubscriber}
              tableBody={subscribers as any}
            />
          </div>
        ) : (
          <div className="text-center my-5">
            <p>No subscribers yet</p>
          </div>
        )}

        <EmailForm
          isModalOpened={isCreateModalOpened}
          isSubmitting={isSubmitting}
          onSubmit={this.sendEmailToSubscribers}
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
            this.removeSubscriber(idOfItemToBeDeleted, true);
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
