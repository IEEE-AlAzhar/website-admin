import React, { Component } from "react";

import AdminLayout from "shared/admin-layout";
import AdminTable from "shared/admin-table";
import Loading from "shared/loading";
import BestMemberForm from "../form";

import UserService from "modules/users/services/user.service";
import BestMembersService from "modules/best-members/services/best-member.service";
import { BestMember } from "configurations/interfaces/best-member.interface";

import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface Prop {
  history: {
    push: (path: string) => void;
  };
}

interface State {
  bestMembers: BestMember[];
  bestMemberToBeEdited?: BestMember | null;
  successAlert: string;
  errorAlert: string;
  isLoading: boolean;
  isCreateModalOpened: boolean;
  isSubmitting: boolean;
  idOfItemToBeDeleted: string;
}

export default class BestMembersListPage extends Component<Prop, State> {
  tableConfig = {
    tableHeaders: ["name", "committee"],
    className: "table-striped",
    actions: ["edit", "delete"],
  };

  state = {
    bestMembers: [] as BestMember[],
    successAlert: "",
    errorAlert: "",
    bestMemberToBeEdited: {} as BestMember,
    isLoading: false,
    isCreateModalOpened: false,
    isSubmitting: false,
    idOfItemToBeDeleted: "",
  };

  public _bestMembersService: BestMembersService;
  public _userService: UserService;

  constructor(props: Prop) {
    super(props);
    this._bestMembersService = new BestMembersService();
    this._userService = new UserService();
  }

  async componentDidMount() {
    if (!this._userService.isUserLoggedIn())
      return this.props.history.push("/login");
    this.setState({ isLoading: true });
    try {
      let bestMembers = await this._bestMembersService.list();

      this.setState({ bestMembers, isLoading: false });
    } catch {
      this.setState({ errorAlert: "Error retrieving items", isLoading: false });
    }
  }

  createBestMember = (bestMember: BestMember) => {
    let { bestMembers } = this.state;

    this.setState({
      isSubmitting: true,
    });

    return this._bestMembersService
      .create(bestMember)
      .then((response) => {
        bestMembers.unshift(response as never);

        this.setState({
          bestMembers,
          successAlert: "Member added successfully",
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

  editBestMember = (
    bestMember: BestMember,
    submit: boolean,
    id = this.state.bestMemberToBeEdited._id
  ) => {
    if (submit) {
      this.setState({
        isSubmitting: true,
      });
      return this._bestMembersService
        .update(id, bestMember)
        .then((response) => {
          this.updateStateWithNewBestMember(response);
          this.setState({
            isSubmitting: false,
            successAlert: "Member updated successfully",
            errorAlert: "",
            bestMemberToBeEdited: {} as BestMember,
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
        bestMemberToBeEdited: bestMember,
      });
    }
  };

  updateStateWithNewBestMember = (bestMember: BestMember) => {
    let { bestMembers } = this.state;
    let objectToUpdateIndex: number = bestMembers.findIndex(
      (item: BestMember) => item._id === bestMember._id
    );

    bestMembers.splice(objectToUpdateIndex, 1, bestMember as never);

    this.setState({ bestMembers });
  };

  removeBestMember = (id: string, submit?: boolean) => {
    let { bestMembers } = this.state;

    if (submit) {
      this._bestMembersService.delete(id).then(() => {
        this.setState({
          bestMembers: bestMembers.filter(
            (item: BestMember) => item._id !== id
          ),
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
      bestMembers,
      successAlert,
      errorAlert,
      bestMemberToBeEdited,
      idOfItemToBeDeleted,
      isLoading,
      isCreateModalOpened,
      isSubmitting,
    } = this.state;

    return (
      <AdminLayout>
        <header className="d-flex justify-content-between container mt-5">
          <h2> Best Members </h2>
          <button
            className="btn btn-success"
            onClick={() => this.setState({ isCreateModalOpened: true })}
          >
            <FontAwesomeIcon icon={faPlus} /> Create New Member
          </button>
        </header>
        {isLoading ? (
          <div className="text-center mt-5">
            <Loading />
          </div>
        ) : bestMembers.length > 0 ? (
          <div className="container mt-5">
            <AdminTable
              config={this.tableConfig}
              triggerEditEvent={this.editBestMember}
              deleteRow={this.removeBestMember}
              tableBody={bestMembers as any}
            />
          </div>
        ) : (
          <div className="text-center my-5">
            <p>No Members yet</p>
          </div>
        )}

        {Object.keys(bestMemberToBeEdited).length > 1 && (
          <BestMemberForm
            isModalOpened={Object.keys(bestMemberToBeEdited).length > 1}
            itemToBeEdited={bestMemberToBeEdited}
            onSubmit={this.editBestMember}
            isSubmitting={isSubmitting}
            closeModal={() =>
              this.setState({ bestMemberToBeEdited: {} as BestMember })
            }
          />
        )}

        <BestMemberForm
          isModalOpened={isCreateModalOpened}
          isSubmitting={isSubmitting}
          onSubmit={this.createBestMember}
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
            this.removeBestMember(idOfItemToBeDeleted, true);
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
