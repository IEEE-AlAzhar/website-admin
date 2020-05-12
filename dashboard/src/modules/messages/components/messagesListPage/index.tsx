import React, { Component } from "react";

import AdminLayout from "shared/admin-layout";
import AdminTable from "shared/admin-table";
import Loading from "shared/loading";

import UserService from "modules/users/services/user.service";
import MessageService from "modules/messages/services/message.service";
import { Message } from "configurations/interfaces/message.interface";

import SweetAlert from "react-bootstrap-sweetalert";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

interface Prop {
  history: {
    push: (path: string) => void;
  };
}

interface State {
  messages: Message[];
  successAlert: string;
  errorAlert: string;
  isLoading: boolean;
  idOfItemToBeDeleted: string;
  itemToBeViewed: Message;
}

export default class MessagesListPage extends Component<Prop, State> {
  tableConfig = {
    tableHeaders: ["name", "email", "phone", "subject"],
    className: "table-striped",
    actions: ["view", "delete"],
  };

  state = {
    messages: [] as Message[],
    successAlert: "",
    errorAlert: "",
    isLoading: false,
    idOfItemToBeDeleted: "",
    itemToBeViewed: {} as Message,
  };

  public _messageService: MessageService;
  public _userService: UserService;

  constructor(props: Prop) {
    super(props);
    this._messageService = new MessageService();
    this._userService = new UserService();
  }

  async componentDidMount() {
    if (!this._userService.isUserLoggedIn())
      return this.props.history.push("/login");
    this.setState({ isLoading: true });
    try {
      let messages = await this._messageService.list();

      this.setState({ messages, isLoading: false });
    } catch {
      this.setState({ errorAlert: "Error retrieving items", isLoading: false });
    }
  }

  viewMessage = (message: Message) => {
    this.setState({ itemToBeViewed: message });
  };

  closeViewModal = () => {
    this.setState({ itemToBeViewed: {} as Message });
  };

  removeMessage = (id: string, submit?: boolean) => {
    let { messages } = this.state;

    if (submit) {
      this._messageService
        .delete(id)
        .then(() => {
          this.setState({
            messages: messages.filter((item: Message) => item._id !== id),
            successAlert: "Message removed successfully",
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
      messages,
      successAlert,
      errorAlert,
      idOfItemToBeDeleted,
      itemToBeViewed,
      isLoading,
    } = this.state;

    return (
      <AdminLayout>
        <header className="d-flex justify-content-between container mt-5">
          <h2> Messages </h2>
        </header>
        {isLoading ? (
          <div className="text-center mt-5">
            <Loading />
          </div>
        ) : messages.length > 0 ? (
          <div className="container mt-5">
            <AdminTable
              config={this.tableConfig}
              triggerViewEvent={this.viewMessage}
              deleteRow={this.removeMessage}
              tableBody={messages as any}
            />
          </div>
        ) : (
          <div className="text-center my-5">
            <p>No messages yet</p>
          </div>
        )}

        <Modal
          open={Object.keys(itemToBeViewed).length > 0}
          onClose={this.closeViewModal}
          center
        >
          <h3> {itemToBeViewed.subject} </h3>
          <hr />
          <p className="p-3"> {itemToBeViewed.message} </p>
        </Modal>

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
            this.removeMessage(idOfItemToBeDeleted, true);
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
