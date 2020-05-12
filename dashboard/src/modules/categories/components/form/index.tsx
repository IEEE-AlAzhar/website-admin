import React, { Component } from "react";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import SweetAlert from "react-bootstrap-sweetalert";

import { Category } from "configurations/interfaces/category.interface";
import CategoriesService from "modules/categories/services/categories.service";

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
  category: Category;
  isLoading: boolean;
  errorAlert: string;
}

export default class BestMemberForm extends Component<Prop, State> {
  state = {
    category: {
      name: "",
    },
    errorAlert: "",
    isLoading: false,
  };

  _categoryService: CategoriesService;

  constructor(props: Prop) {
    super(props);
    this._categoryService = new CategoriesService();
  }

  componentDidMount() {
    let { itemToBeEdited } = this.props;

    if (itemToBeEdited) {
      itemToBeEdited.date = this.formatDate();
      this.setState({ category: itemToBeEdited });
    }
  }

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
      category: {
        ...this.state.category,
        [name]: value,
      } as any,
    });
  };

  handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    let { category } = this.state;

    if (isEmpty(category.name)) {
      this.setState({
        errorAlert: "Please make sure to fill the name of the category !",
      });
    }

    this.props.onSubmit(category, true).then(() => {
      this.resetObj(category);
      this.setState({ category: category });
    });
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
    let { category, isLoading, errorAlert } = this.state;

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
            <h3 className="mb-3"> Categories </h3>
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="form-group col-md-12">
                  <FormInput
                    type="text"
                    required={true}
                    placeholder="Name of the category"
                    label="Category name"
                    id="name"
                    name="name"
                    errorPosition="bottom"
                    value={category.name}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting
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
