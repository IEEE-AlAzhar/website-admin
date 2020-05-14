import React, { Component } from "react";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import Multiselect from "react-widgets/lib/Multiselect";
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import SweetAlert from "react-bootstrap-sweetalert";

import { Article } from "configurations/interfaces/article.interface";
import Loading from "shared/loading";
import FormInput from "shared/Input";
import ImageInput from "shared/image-input";
import CategoriesService from "modules/categories/services/categories.service";
import { isEmpty } from "shared/services/validation.service";

interface Prop {
  isModalOpened: boolean;
  onSubmit: (item: any, submit: boolean, id?: string) => Promise<void>;
  closeModal: () => void;
  itemToBeEdited?: any;
  isSubmitting?: boolean;
}

interface State {
  article: Article;
  isLoading: boolean;
  isImageUploading: boolean;
  categories: any[];
  errorAlert: string;
}

export default class ArticleForm extends Component<Prop, State> {
  state = {
    article: {
      title: "",
      body: "",
      lang: "",
      authorName: "",
      authorProfileLink: "",
      cover: "",
      metaDescription: "",
      categories: [] as string[],
    },
    categories: [] as any[],
    errorAlert: "",
    isLoading: false,
    isImageUploading: false,
  };

  _categoriesService: CategoriesService;

  constructor(props: Prop) {
    super(props);
    this._categoriesService = new CategoriesService();
  }

  componentDidMount() {
    let { itemToBeEdited } = this.props;

    if (itemToBeEdited) {
      itemToBeEdited.date = this.formatDate();
      this.setState({ article: itemToBeEdited });
    }

    this._categoriesService.list().then((response) => {
      this.setState({
        categories: response,
      });
    });
  }

  setImageUpload = (status: boolean, imageUrl?: string) => {
    this.setState({ isImageUploading: status });
    if (imageUrl)
      this.setState({
        article: { ...this.state.article, cover: imageUrl } as any,
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
      article: {
        ...this.state.article,
        [name]: value,
      } as any,
    });
  };

  handleCreate = (name: string) => {
    this._categoriesService
      .create({ name })
      .then((response) => {
        this.setState({
          article: {
            ...this.state.article,
            categories: [...this.state.article.categories, response],
          },
          categories: [...this.state.categories, response],
        });
      })
      .catch((err) => {
        this.setState({ errorAlert: err.response.data.msg });
      });
  };

  handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    let { article } = this.state;

    if (
      isEmpty(article.title) ||
      isEmpty(article.metaDescription) ||
      isEmpty(article.body) ||
      isEmpty(article.cover) ||
      isEmpty(article.authorName) ||
      isEmpty(article.authorProfileLink)
    ) {
      this.setState({
        errorAlert: "Please make sure to fill all the required fields !",
      });
    } else {
      this.props.onSubmit(article, true).then(() => {
        this.resetObj(article);
        this.setState({ article: article });
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
      article,
      isLoading,
      isImageUploading,
      categories,
      errorAlert
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
            <h3 className="mb-3"> Article </h3>
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="form-group col-md-4">
                  <FormInput
                    type="text"
                    required={true}
                    placeholder="blog title"
                    label="Title"
                    id="title"
                    name="title"
                    errorPosition="bottom"
                    value={article.title}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="category">Categories</label>
                  <Multiselect
                    id="category"
                    data={categories}
                    textField="name"
                    valueField="id"
                    value={article.categories}
                    allowCreate="onFilter"
                    onCreate={(name) => this.handleCreate(name)}
                    onChange={(value: any) =>
                      this.setState({
                        article: {
                          ...article,
                          categories: value,
                        },
                      })
                    }
                  />
                </div>
                <div className="form-group col-md-4">
                  <FormInput
                    type="select"
                    options={["Arabic", "English"]}
                    required={true}
                    placeholder="language of the article"
                    label="Language"
                    id="language"
                    name="lang"
                    errorPosition="bottom"
                    className="form-control"
                    value={article.lang}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group col-12">
                  <FormInput
                    type="textarea"
                    required={true}
                    label="Meta Description"
                    placeholder="A short description for SEO"
                    id="metaDescription"
                    name="metaDescription"
                    rows="3"
                    errorPosition="bottom"
                    value={article.metaDescription}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group col-12">
                  <label>
                    {" "}
                    Body of the article <span className="error">*</span>{" "}
                  </label>
                  {/* <JoditEditor
                    value={article.body}
                    config={config}
                    onBlur={(newContent) => {
                      this.setState({
                        article: {
                          ...article,
                          body: newContent,
                        },
                      });
                    }}
                  /> */}
                  <SunEditor
                    name="body"
                    setContents={article.body}
                    placeholder="Add the article body ..."
                    onChange={(content: string) =>
                      this.setState({
                        article: {
                          ...this.state.article,
                          body: content,
                        } as any,
                      })
                    }
                    setOptions={{ buttonList: buttonList.complex }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-6">
                  <FormInput
                    type="text"
                    required={true}
                    placeholder="Name of the author"
                    label="Author Name"
                    id="authorName"
                    name="authorName"
                    errorPosition="bottom"
                    value={article.authorName}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group col-md-6">
                  <FormInput
                    type="text"
                    required={true}
                    placeholder="Link of the facebook profile of the author"
                    label="Author Profile Link"
                    id="authorProfileLink"
                    name="authorProfileLink"
                    errorPosition="bottom"
                    value={article.authorProfileLink}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <ImageInput
                imgUrl={article.cover}
                required={true}
                label="Blog Cover"
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
