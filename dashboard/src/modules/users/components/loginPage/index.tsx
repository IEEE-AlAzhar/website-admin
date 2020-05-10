import React, { Component } from "react";

import UserService from "modules/users/services/user.service";
import FormInput from "shared/Input";

import SweetAlert from "react-bootstrap-sweetalert";

import "./style.css";

interface State {
  user: {
    username: string;
    password: string;
  };
  isLoading: boolean;
  success: string;
  error: string;
}

interface Prop {
  history: {
    push: (path: string) => void;
  };
}

export default class LoginPage extends Component<Prop, State> {
  state = {
    user: {
      username: "",
      password: "",
    },
    isLoading: false,
    success: "",
    error: "",
  };

  public _userService: UserService;
  constructor(props: Prop) {
    super(props);
    this._userService = new UserService();
  }

  handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
    let { name, value } = e.currentTarget;

    let { user } = this.state;

    this.setState({
      user: {
        ...user,
        [name]: value,
      } as any,
    });
  };

  handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    let { user } = this.state;

    this.setState({
      isLoading: true,
    });

    let response;
    try {
      response = await this._userService.login(user);
      let { type } = response.data.user;

      if (type === "Member") {
        this.setState({
          isLoading: false,
          success: null,
          error: "You shouldn't be here !",
        });
      } else if (type === "Admin") {
        this.setState({
          isLoading: false,
          success: "Logged in successfully",
          error: "",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else if (type === "Marketer") {
        this.setState({
          isLoading: false,
          success: "Logged in successfully",
          error: "",
        });
        setTimeout(() => {
          window.location.href = "/blog";
        }, 2000);
      }
    } catch (err) {
      this.setState({
        isLoading: false,
        success: null,
        error: err.response.data.msg,
      });
    }
  };

  render() {
    let { isLoading, success, error, user } = this.state;
    return (
      <section className="login-page">
        <div className="login-form-box">
          <h1 className="text-center h3 mb-5"> Login to the dashboard </h1>
          <form className="login-form" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <FormInput
                type="text"
                required={true}
                placeholder="Username"
                label="Username"
                id="username"
                name="username"
                errorPosition="bottom"
                value={user.username}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <FormInput
                type="password"
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
            <button type="submit" className="btn btn-primary btn-block">
              {isLoading ? "Logging you in ..." : "LOGIN"}
            </button>

            {success ? (
              <SweetAlert
                show={!!success}
                success
                title={success || " "}
                timeout={2000}
                onConfirm={() => this.setState({ success: null })}
              />
            ) : error ? (
              <SweetAlert
                show={!!error}
                warning
                title="An error occurred"
                timeout={2000}
                onConfirm={() => this.setState({ error: null })}
              >
                {error}
              </SweetAlert>
            ) : (
              ""
            )}
          </form>
        </div>
      </section>
    );
  }
}
