import React, { Component } from "react";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import JoditEditor from "jodit-react";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import SweetAlert from "react-bootstrap-sweetalert";

import { Event } from "configurations/interfaces/event.interface";

import Loading from "shared/loading";
import FormInput from "shared/Input";
import EventService from "modules/events/services/event.service";
import ImageInput from "shared/image-input";
import { isEmpty } from "shared/services/validation.service";

Moment.locale("en");
momentLocalizer();

interface Prop {
  isModalOpened: boolean;
  onSubmit: (item: any, submit: boolean, id?: string) => Promise<void>;
  closeModal: () => void;
  itemToBeEdited?: any;
  isSubmitting?: boolean;
}

interface State {
  event: Event;
  isLoading: boolean;
  isImageUploading: boolean;
  errorAlert: string;
}

export default class EventForm extends Component<Prop, State> {
  state = {
    event: {
      title: "",
      description: "",
      startDate: null as any,
      endDate: null as any,
      location: "",
      cover: "",
      images: [] as string[],
      status: "",
      formLink: "",
    },
    errorAlert: "",
    isLoading: false,
    isImageUploading: false,
  };

  _eventService: EventService;

  constructor(props: Prop) {
    super(props);
    this._eventService = new EventService();
  }

  componentDidMount() {
    let { itemToBeEdited } = this.props;

    if (itemToBeEdited) {
      itemToBeEdited.date = this.formatDate();
      this.setState({ event: itemToBeEdited });
    }
  }

  setImageUpload = (status: boolean, imageUrl?: string) => {
    this.setState({ isImageUploading: status });
    if (imageUrl)
      this.setState({
        event: { ...this.state.event, cover: imageUrl } as any,
      });
  };

  uploadGalleryImage = (status: boolean, imageUrl?: string) => {
    this.setState({ isImageUploading: status });
    if (imageUrl)
      this.setState({
        event: {
          ...this.state.event,
          images: [...this.state.event.images, imageUrl],
        } as any,
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
      event: {
        ...this.state.event,
        [name]: value,
      } as any,
    });
  };

  handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    let { event } = this.state;

    if (
      isEmpty(event.title) ||
      isEmpty(event.description) ||
      isEmpty(event.startDate) ||
      isEmpty(event.endDate) ||
      isEmpty(event.cover)
    ) {
      this.setState({
        errorAlert: "Please make sure to fill all the required fields !",
      });
    } else {
      this.props.onSubmit(event, true).then(() => {
        this.resetObj(event);
        this.setState({ event: event });
      });
    }
  };

  resetObj(obj: any) {
    for (let prop in obj) {
      obj[prop] = "";
    }
  }

  convertDateStringIntoDateObject(dateString: string) {
    return typeof dateString === "string"
      ? new Date(Date.parse(dateString))
      : dateString;
  }

  render() {
    const config = {
      readonly: false,
    };
    let {
      isModalOpened,
      itemToBeEdited,
      closeModal,
      isSubmitting,
    } = this.props;
    let { event, isLoading, isImageUploading, errorAlert } = this.state;

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
            <h3 className="mb-3"> Event </h3>
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="form-group col-md-6">
                  <FormInput
                    type="text"
                    required={true}
                    placeholder="Event title"
                    label="Title"
                    id="title"
                    name="title"
                    errorPosition="bottom"
                    value={event.title}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group col-md-6">
                  <FormInput
                    type="url"
                    className="form-control"
                    label="Form Link"
                    id="formLink"
                    name="formLink"
                    errorPosition="bottom"
                    value={event.formLink}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group col-12">
                  <FormInput
                    type="text"
                    className="form-control"
                    label="Location"
                    id="location"
                    name="location"
                    errorPosition="bottom"
                    value={event.location}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group col-12">
                  <label>
                    {" "}
                    Event Description <span className="error">*</span>{" "}
                  </label>
                  <JoditEditor
                    value={event.description}
                    config={config}
                    onBlur={(newContent) => {
                      this.setState({
                        event: {
                          ...event,
                          description: newContent,
                        },
                      });
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="startDate">
                    Start Date <span className="error">*</span>
                  </label>
                  <DateTimePicker
                    value={
                      this.convertDateStringIntoDateObject(
                        event.startDate
                      ) as Date
                    }
                    onChange={(value) => {
                      this.setState({
                        event: {
                          ...event,
                          startDate: value.toString(),
                        },
                      });
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="endDate">
                    End Date <span className="error">*</span>
                  </label>
                  <DateTimePicker
                    value={
                      this.convertDateStringIntoDateObject(
                        event.endDate
                      ) as Date
                    }
                    min={
                      this.convertDateStringIntoDateObject(
                        event.startDate
                      ) as Date
                    }
                    onChange={(value) => {
                      let status = value < new Date() ? "past" : "upcoming";

                      this.setState({
                        event: {
                          ...event,
                          endDate: value.toString(),
                          status,
                        },
                      });
                    }}
                  />
                </div>
              </div>

              <div className="row my-4">
                <div className="col-md-12">
                  <ImageInput
                    imgUrl={event.cover}
                    name="cover"
                    required={true}
                    id="cover"
                    label="Event Cover"
                    setImageUpload={this.setImageUpload}
                  />
                </div>
              </div>

              <div className="row">
                <h4>Gallery</h4>
                <div className="col-md-12">
                  {event.images.length > 0 ? (
                    <>
                      <section className="d-flex">
                        {event.images.map((image) => {
                          return (
                            <ImageInput
                              key={image}
                              imgUrl={image}
                              setImageUpload={this.uploadGalleryImage}
                            />
                          );
                        })}
                      </section>
                      <ImageInput
                        id="galleryImage"
                        imgUrl={""}
                        setImageUpload={this.uploadGalleryImage}
                      />
                    </>
                  ) : (
                    <ImageInput
                      id="galleryImage"
                      imgUrl={""}
                      setImageUpload={this.uploadGalleryImage}
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={!!errorAlert || isSubmitting || isImageUploading}
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
