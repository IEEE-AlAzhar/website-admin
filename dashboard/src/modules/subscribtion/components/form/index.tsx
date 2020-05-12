import React, { Component } from "react";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import SweetAlert from "react-bootstrap-sweetalert";

import Loading from "shared/loading";
import FormInput from "shared/Input";
import { Email } from "configurations/interfaces/email.interface";
import { isEmpty } from "shared/services/validation.service";

interface Prop {
  isModalOpened: boolean;
  onSubmit: (item: Email) => Promise<void>;
  closeModal: () => void;
  itemToBeEdited?: any;
  isSubmitting?: boolean;
}

interface State {
  email: Email;
  isLoading: boolean;
  errorAlert: string,
}

export default class EmailForm extends Component<Prop, State> {
  state = {
    email: {
      subject: "",
      body: "",
    },
    isLoading: false,
    errorAlert: "",
  };

  handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
    let { name, value } = e.currentTarget;

    this.setState({
      email: {
        ...this.state.email,
        [name]: value,
      } as any,
    });
  };

  handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    let { email } = this.state;

    if (isEmpty(email.subject) || isEmpty(email.body)) {
      this.setState({
        errorAlert: "Please make sure to fill all the required fields !",
      });
    } else {
      this.props.onSubmit(email).then(() => {
        this.resetObj(email);
        this.setState({ email: email });
      });
    }
  };

  resetObj(obj: any) {
    for (let prop in obj) {
      obj[prop] = "";
    }
  }

  render() {
    let { isModalOpened, closeModal, isSubmitting } = this.props;
    let { email, isLoading, errorAlert } = this.state;

    return (
      <Modal
        open={isModalOpened}
        onClose={() => closeModal()}
        center
        styles={{
          modal: {
            animation: `${
              isModalOpened ? "customEnterAnimation" : "customLeaveAnimation"
            } 500ms`,
          },
        }}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <h3 className="mb-3"> Email </h3>
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="form-group col-md-12">
                  <FormInput
                    type="text"
                    required={true}
                    placeholder="Email Subject"
                    label="subject"
                    id="subject"
                    name="subject"
                    errorPosition="bottom"
                    value={email.subject}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group col-12">
                  <FormInput
                    type="textarea"
                    required={true}
                    label="body"
                    id="body"
                    name="body"
                    rows="5"
                    errorPosition="bottom"
                    value={email.body}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending ..." : "Send"}
              </button>
            </form>
          </>
        )}
        <SweetAlert
          show={!!errorAlert}
          warning
          title="An error occurred"
          timeout={2000}
          onConfirm={() => this.setState({ errorAlert: null })}
        >
          {errorAlert}
        </SweetAlert>
      </Modal>
    );
  }
}
