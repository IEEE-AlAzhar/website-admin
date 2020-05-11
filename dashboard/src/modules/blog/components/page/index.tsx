import React, { Component } from "react";

import AdminLayout from "shared/admin-layout";
import AdminTable from "shared/admin-table";
import Loading from "shared/loading";
import ArticleForm from "../form";

import UserService from "modules/users/services/user.service";
import BlogService from "modules/blog/services/blog.service";
import { Article } from "configurations/interfaces/article.interface";

import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface Prop {
  history: {
    push: (path: string) => void;
  };
}

interface State {
  articles: Article[];
  articleToBeEdited?: Article | null;
  successAlert: string;
  errorAlert: string;
  isLoading: boolean;
  isCreateModalOpened: boolean;
  isSubmitting: boolean;
  idOfItemToBeDeleted: string;
}

export default class ArticlesListPage extends Component<Prop, State> {
  tableConfig = {
    tableHeaders: ["title", "createdAt"],
    className: "table-striped",
    actions: ["edit", "delete"],
  };

  state = {
    articles: [] as Article[],
    successAlert: "",
    errorAlert: "",
    articleToBeEdited: {} as Article,
    isLoading: false,
    isCreateModalOpened: false,
    isSubmitting: false,
    idOfItemToBeDeleted: "",
  };

  public _blogService: BlogService;
  public _userService: UserService;

  constructor(props: Prop) {
    super(props);
    this._blogService = new BlogService();
    this._userService = new UserService();
  }

  async componentDidMount() {
    if (!this._userService.isUserLoggedIn())
      return this.props.history.push("/login");
    this.setState({ isLoading: true });
    try {
      let articles = await this._blogService.list();

      this.setState({ articles, isLoading: false });
    } catch {
      this.setState({ errorAlert: "Error retrieving items", isLoading: false });
    }
  }

  createArticle = (article: Article) => {
    let { articles } = this.state;

    this.setState({
      isSubmitting: true,
    });

    return this._blogService
      .create(article)
      .then((response) => {
        articles.unshift(response as never);

        this.setState({
          articles,
          successAlert: "Article added successfully",
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

  editArticle = (
    article: Article,
    submit: boolean,
    id = this.state.articleToBeEdited._id
  ) => {
    if (submit) {
      this.setState({
        isSubmitting: true,
      });
      return this._blogService
        .update(id, article)
        .then((response) => {
          this.updateStateWithNewArticle(response);
          this.setState({
            isSubmitting: false,
            successAlert: "Article updated successfully",
            errorAlert: "",
            articleToBeEdited: {} as Article,
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
        articleToBeEdited: article,
      });
    }
  };

  updateStateWithNewArticle = (article: Article) => {
    let { articles } = this.state;
    let objectToUpdateIndex: number = articles.findIndex(
      (item: Article) => item._id === article._id
    );

    articles.splice(objectToUpdateIndex, 1, article as never);

    this.setState({ articles });
  };

  removeArticle = (id: string, submit?: boolean) => {
    let { articles } = this.state;

    if (submit) {
      this._blogService.delete(id).then(() => {
        this.setState({
          articles: articles.filter(
            (item: Article) => item._id !== id
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
      articles,
      successAlert,
      errorAlert,
      articleToBeEdited,
      idOfItemToBeDeleted,
      isLoading,
      isCreateModalOpened,
      isSubmitting,
    } = this.state;

    return (
      <AdminLayout>
        <header className="d-flex justify-content-between container mt-5">
          <h2> Articles </h2>
          <button
            className="btn btn-success"
            onClick={() => this.setState({ isCreateModalOpened: true })}
          >
            <FontAwesomeIcon icon={faPlus} /> Create New Article
          </button>
        </header>
        {isLoading ? (
          <div className="text-center mt-5">
            <Loading />
          </div>
        ) : articles.length > 0 ? (
          <div className="container mt-5">
            <AdminTable
              config={this.tableConfig}
              triggerEditEvent={this.editArticle}
              deleteRow={this.removeArticle}
              tableBody={articles as any}
            />
          </div>
        ) : (
          <div className="text-center my-5">
            <p>No Articles yet</p>
          </div>
        )}

        {Object.keys(articleToBeEdited).length > 1 && (
          <ArticleForm
            isModalOpened={Object.keys(articleToBeEdited).length > 1}
            itemToBeEdited={articleToBeEdited}
            onSubmit={this.editArticle}
            isSubmitting={isSubmitting}
            closeModal={() =>
              this.setState({ articleToBeEdited: {} as Article })
            }
          />
        )}

        <ArticleForm
          isModalOpened={isCreateModalOpened}
          isSubmitting={isSubmitting}
          onSubmit={this.createArticle}
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
            this.removeArticle(idOfItemToBeDeleted, true);
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
