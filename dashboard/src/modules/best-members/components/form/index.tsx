import React, { Component } from "react";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import SweetAlert from "react-bootstrap-sweetalert";

import { BestMember } from "configurations/interfaces/best-member.interface";
import { Committee } from "configurations/interfaces/committee.interface";
import CommitteeService from "modules/committees/services/committee.service";
import Loading from "shared/loading";
import FormInput from "shared/Input";
import ImageInput from "shared/image-input";
import { isEmpty } from "shared/services/validation.service";

interface Prop {
  isModalOpened: boolean;
  onSubmit: (item: any, submit: boolean, id?: string) => Promise<void>;
  closeModal: () => void;
  itemToBeEdited?: any;
  isSubmitting?: boolean;
}

interface State {
  bestMember: BestMember;
  isLoading: boolean;
  isImageUploading: boolean;
  committees: string[];
  errorAlert: string;
}

export default class BestMemberForm extends Component<Prop, State> {
  state = {
    bestMember: {
      name: "",
      image: "",
      committee: "",
    },
    committees: [] as string[],
    errorAlert: "",
    isLoading: false,
    isImageUploading: false,
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
      this.setState({ bestMember: itemToBeEdited });
    }

    this._committeeService.list().then((response) => {
      this.setState({
        committees: this.generateArrayOfCommitteesNames(response),
      });
    });
  }

  generateArrayOfCommitteesNames = (committeesArray: Committee[]): string[] => {
    let committeesNames: string[] = [];
    committeesArray.map(({ name }) => committeesNames.push(name));

    return committeesNames;
  };

  setImageUpload = (status: boolean, imageUrl?: string) => {
    this.setState({ isImageUploading: status });
    if (imageUrl)
      this.setState({
        bestMember: { ...this.state.bestMember, image: imageUrl } as any,
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
      bestMember: {
        ...this.state.bestMember,
        [name]: value,
      } as any,
    });
  };

  handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    let { bestMember } = this.state;

    if (
      isEmpty(bestMember.committee) ||
      isEmpty(bestMember.image) ||
      isEmpty(bestMember.name)
    ) {
      this.setState({
        errorAlert: "Please make sure to fill all the required fields !",
      });
    } else {
      this.props.onSubmit(bestMember, true).then(() => {
        this.resetObj(bestMember);
        this.setState({ bestMember: bestMember });
      });
    }
  };

  resetObj(obj: any) {
    for (let prop in obj) {
      obj[prop] = "";
    }
  }

  render() {
    let {
      isModalOpened,
      itemToBeEdited,
      closeModal,
      isSubmitting,
    } = this.props;
    let {
      bestMember,
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
            <h3 className="mb-3"> Best Members </h3>
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="form-group col-md-12">
                  <FormInput
                    type="text"
                    required={true}
                    placeholder="Name of the member"
                    label="Member name"
                    id="name"
                    name="name"
                    errorPosition="bottom"
                    value={bestMember.name}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group col-md-12">
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
                    value={bestMember.committee}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <ImageInput
                imgUrl={bestMember.image}
                name="image"
                required={true}
                setImageUpload={this.setImageUpload}
              />

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
