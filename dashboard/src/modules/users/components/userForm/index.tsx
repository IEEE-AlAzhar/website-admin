import React, { Component } from "react";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import SweetAlert from "react-bootstrap-sweetalert";

import { User } from "configurations/interfaces/user.interface";
import { Committee } from "configurations/interfaces/committee.interface";
import CommitteeService from "modules/committees/services/committee.service";

import Loading from "shared/loading";
import FormInput from "shared/Input";
import { isEmpty } from "shared/services/validation.service";

interface Prop {
  isModalOpened: boolean;
  onSubmit: (item: any, submit: boolean, id?: string) => Promise<void>;
  closeModal: () => void;
  itemToBeEdited?: any;
  isSubmitting?: boolean;
}

interface State {
  user: User;
  isLoading: boolean;
  isImageUploading: boolean;
  committees: string[];
  errorAlert: string;
}

export default class UserForm extends Component<Prop, State> {
  state = {
    user: {
      username: "",
      password: "",
      type: "",
      committee: "",
    },
    committees: [] as string[],
    isLoading: false,
    isImageUploading: false,
    errorAlert: "",
  };

  _committeeService: CommitteeService;

  constructor(props: Prop) {
    super(props);
    this._committeeService = new CommitteeService();
  }

  componentDidMount() {
    let { itemToBeEdited } = this.props;

    if (itemToBeEdited) {
      itemToBeEdited.date = this.formatDate();
      this.setState({ user: itemToBeEdited });
    }

    this._committeeService.list().then((response) => {
      this.setState({
        committees: this.generateArrayOfCommitteesNames(response),
      });
    });
  }

  setImageUpload = (status: boolean, imageUrl?: string) => {
    this.setState({ isImageUploading: status });
    if (imageUrl)
      this.setState({
        user: { ...this.state.user, image: imageUrl } as any,
      });
  };

  formatDate = () => {
    let currentDateTime = new Date();
    let formattedDate =
      currentDateTime.getFullYear() +
      "-" +
      (currentDateTime.getMonth() + 1) +
      "-" +
      currentDateTime.getDate();

    return formattedDate;
  };

  handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
    let { name, value } = e.currentTarget;

    this.setState({
      user: {
        ...this.state.user,
        [name]: value,
      } as any,
    });
  };

  handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    let { user } = this.state;

    if (
      isEmpty(user.committee) ||
      isEmpty(user.password) ||
      isEmpty(user.type) ||
      isEmpty(user.username)
    ) {
      this.setState({
        errorAlert: "Please make sure to fill all the required fields !",
      });
    } else {
      this.props.onSubmit(this.state.user, true).then(() => {
        this.resetObj(user);
        this.setState({ user: user });
      });
    }
  };

  resetObj(obj: any) {
    for (let prop in obj) {
      obj[prop] = "";
    }
  }

  generateCode = (): void => {
    let randomNumber = Math.floor(100000000 + Math.random() * 900000000);

    this.setState({
      user: {
        ...this.state.user,
        code: String(randomNumber),
      } as any,
    });
  };

  generateArrayOfCommitteesNames = (committeesArray: Committee[]): string[] => {
    let committeesNames: string[] = [];
    committeesArray.map(({ name }) => committeesNames.push(name));

    return committeesNames;
  };

  render() {
    let {
      isModalOpened,
      itemToBeEdited,
      closeModal,
      isSubmitting,
    } = this.props;
    let {
      user,
      isLoading,
      isImageUploading,
      committees,
      errorAlert,
    } = this.state;

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
            <h3 className="mb-3"> Member </h3>
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="form-group col-md-6">
                  <FormInput
                    type="text"
                    required={true}
                    placeholder="Username"
                    label="Name"
                    id="username"
                    name="username"
                    errorPosition="bottom"
                    value={user.username}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group col-md-6">
                  <FormInput
                    type="select"
                    className="form-control"
                    options={["Admin", "Marketer"]}
                    required={true}
                    label="Type"
                    id="type"
                    name="type"
                    errorPosition="bottom"
                    value={user.type}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-6">
                  <FormInput
                    type="select"
                    className="form-control"
                    options={
                      committees && committees.length > 0 ? committees : []
                    }
                    required={true}
                    label="Committee"
                    id="committee"
                    name="committee"
                    errorPosition="bottom"
                    value={user.committee}
                    onChange={this.handleChange}
                  />
                </div>

                <div className="form-group col-md-6">
                  <FormInput
                    type="text"
                    className="form-control"
                    required={true}
                    label="Password"
                    id="password"
                    name="password"
                    errorPosition="bottom"
                    value={user.password}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || isImageUploading}
              >
                {isImageUploading
                  ? "Uploading..."
                  : isSubmitting
                  ? "Loading ..."
                  : itemToBeEdited
                  ? "Save"
                  : "Create"}
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
