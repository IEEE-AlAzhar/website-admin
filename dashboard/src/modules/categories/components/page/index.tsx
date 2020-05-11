import React, { Component } from "react";

import AdminLayout from "shared/admin-layout";
import AdminTable from "shared/admin-table";
import Loading from "shared/loading";
import BestMemberForm from "../form";

import UserService from "modules/users/services/user.service";
import { Category } from "configurations/interfaces/category.interface";

import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CategoriesService from "modules/categories/services/categories.service";

interface Prop {
  history: {
    push: (path: string) => void;
  };
}

interface State {
  categories: Category[];
  categoryToBeEdited?: Category | null;
  successAlert: string;
  errorAlert: string;
  isLoading: boolean;
  isCreateModalOpened: boolean;
  isSubmitting: boolean;
  idOfItemToBeDeleted: string;
}

export default class CategoriesListPage extends Component<Prop, State> {
  tableConfig = {
    tableHeaders: ["name"],
    className: "table-striped",
    actions: ["edit", "delete"],
  };

  state = {
    categories: [] as Category[],
    successAlert: "",
    errorAlert: "",
    categoryToBeEdited: {} as Category,
    isLoading: false,
    isCreateModalOpened: false,
    isSubmitting: false,
    idOfItemToBeDeleted: "",
  };

  public _categoriesService: CategoriesService;
  public _userService: UserService;

  constructor(props: Prop) {
    super(props);
    this._categoriesService = new CategoriesService();
    this._userService = new UserService();
  }

  async componentDidMount() {
    if (!this._userService.isUserLoggedIn())
      return this.props.history.push("/login");
    this.setState({ isLoading: true });
    try {
      let categories = await this._categoriesService.list();

      this.setState({ categories, isLoading: false });
    } catch {
      this.setState({ errorAlert: "Error retrieving items", isLoading: false });
    }
  }

  createCategory = (category: Category) => {
    let { categories } = this.state;

    this.setState({
      isSubmitting: true,
    });

    return this._categoriesService
      .create(category)
      .then((response) => {
        categories.unshift(response as never);

        this.setState({
          categories,
          successAlert: "Category added successfully",
          errorAlert: "",
          isCreateModalOpened: false,
          isSubmitting: false,
        });
      })
      .catch((err) => {
        this.setState({
          errorAlert: "An error occurred",
          successAlert: "",
          isSubmitting: false,
        });
      });
  };

  editCategory = (
    category: Category,
    submit: boolean,
    id = this.state.categoryToBeEdited._id
  ) => {
    if (submit) {
      this.setState({
        isSubmitting: true,
      });
      return this._categoriesService
        .update(id, category)
        .then((response) => {
          this.updateStateWithNewCategory(response);
          this.setState({
            isSubmitting: false,
            successAlert: "Category updated successfully",
            errorAlert: "",
            categoryToBeEdited: {} as Category,
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
        categoryToBeEdited: category,
      });
    }
  };

  updateStateWithNewCategory = (category: Category) => {
    let { categories } = this.state;
    let objectToUpdateIndex: number = categories.findIndex(
      (item: Category) => item._id === category._id
    );

    categories.splice(objectToUpdateIndex, 1, category as never);

    this.setState({ categories });
  };

  removeCategory = (id: string, submit?: boolean) => {
    let { categories } = this.state;

    if (submit) {
      this._categoriesService
        .delete(id)
        .then(() => {
          this.setState({
            categories: categories.filter((item: Category) => item._id !== id),
          });
        })
        .catch((err) => {
          this.setState({ errorAlert: err.response.data.msg });
        });
    } else {
      this.setState({
        idOfItemToBeDeleted: id,
      });
    }
  };

  render() {
    let {
      categories,
      successAlert,
      errorAlert,
      categoryToBeEdited,
      idOfItemToBeDeleted,
      isLoading,
      isCreateModalOpened,
      isSubmitting,
    } = this.state;

    return (
      <AdminLayout>
        <header className="d-flex justify-content-between container mt-5">
          <h2> Categories </h2>
          <button
            className="btn btn-success"
            onClick={() => this.setState({ isCreateModalOpened: true })}
          >
            <FontAwesomeIcon icon={faPlus} /> Create New Category
          </button>
        </header>
        {isLoading ? (
          <div className="text-center mt-5">
            <Loading />
          </div>
        ) : categories.length > 0 ? (
          <div className="container mt-5">
            <AdminTable
              config={this.tableConfig}
              triggerEditEvent={this.editCategory}
              deleteRow={this.removeCategory}
              tableBody={categories as any}
            />
          </div>
        ) : (
          <div className="text-center my-5">
            <p>No Categories yet</p>
          </div>
        )}

        {Object.keys(categoryToBeEdited).length > 1 && (
          <BestMemberForm
            isModalOpened={Object.keys(categoryToBeEdited).length > 1}
            itemToBeEdited={categoryToBeEdited}
            onSubmit={this.editCategory}
            isSubmitting={isSubmitting}
            closeModal={() =>
              this.setState({ categoryToBeEdited: {} as Category })
            }
          />
        )}

        <BestMemberForm
          isModalOpened={isCreateModalOpened}
          isSubmitting={isSubmitting}
          onSubmit={this.createCategory}
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
            this.removeCategory(idOfItemToBeDeleted, true);
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
