import { useState } from "react";
import { Button, DatePicker, Form, Input, Select, Alert } from "antd";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Signup = () => {
  const [form] = Form.useForm();
  // set initial State of required form data
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  // set state for form validation
  const [validated] = useState(false);
  const [errors, setErrors] = useState([]);
  // set state for alert
  const [showAlert, setShowAlert] = useState(false);
  const [addUser, { error }] = useMutation(ADD_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setUserFormData({
      ...userFormData,
      pronouns: value,
    });
  };

  const handleFormSubmit = async () => {
    if (calculateAgeLimit(userFormData.birthday) === false) {
      return setShowAlert(true); // prevents underage from joining
    }
    // no pronouns = null
    if (userFormData.pronouns === 'Prefer-not-to-say') {
      userFormData.pronouns = null;
    }
    userFormData.username = userFormData.username.toLowerCase();
    // adds user to DB
    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });
      if (!data) {
        throw new Error("something went wrong!");
      }
      // logs in new user
      Auth.login(data.addUser.token);
      window.location.assign('/');
    } catch (err) {
      console.error(err);
      // setShowAlert(true);
      form.resetFields();
    }
    // resets form to empty
    setUserFormData({
      email: "",
      password: "",
      confirm: "",
      username: "",
      profilePic: "",
      postalCode: "",
      bio: "",
      pronouns: "",
      birthday: "",
    });
  };

  const calculateAgeLimit = (birthday) => {
    const personBirthday = new Date(birthday);
    const ofAge = new Date(new Date().setFullYear(new Date().getFullYear() - 21));
    if (personBirthday < ofAge) {
      return true; // person is of age
    } else {
      return false; // person is not of age
    }
  }

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={handleFormSubmit}
      initialValues={{
        prefix: "86",
      }}
      style={{
        maxWidth: 600,
      }}
      scrollToFirstError
    >
      {showAlert && <Alert type="error" message="You may not use this site while under age 21." banner />}
      <Form.Item
        name="username"
        label="Username"
        tooltip="What do you want others to call you?"
        rules={[
          {
            required: true,
            message: "Please input your username!",
            whitespace: true,
          },
        ]}
      >
        <Input
          placeholder="Username"
          name="username"
          onChange={handleInputChange}
          value={userFormData.username}
        />
      </Form.Item>

      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
            message: "The input is not valid e-mail!",
          },
          {
            required: true,
            message: "Please input your e-mail!",
          },
        ]}
      >
        <Input
          className="site-form-item-icon"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
          value={userFormData.email}
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input.Password
          className="site-form-item-icon"
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleInputChange}
          value={userFormData.password}
        />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password
          className="site-form-item-icon"
          type="password"
          placeholder="Confirm Password"
          name="confirm"
          onChange={handleInputChange}
          value={userFormData.confirm}
        />
      </Form.Item>
      <Form.Item
        // name='birthday-date-picker'
        label='Birthday'
        // initialValue={''}
        // onChange={(date, dateString) =>
        //   setUserFormData({ ...userFormData, birthday: dateString })
        // }
        // rules={[
        //   {
        //     required: true,
        //     message: "Please select your birthday! This site is restricted to 21+.",
        //     type: 'object',
        //   }]}
      >
        <DatePicker
          name='birthday-date-picker'
          // label='Birthday'
          initialValue={''}
          onChange={(date, dateString) =>{
            setUserFormData({ ...userFormData, birthday: date })
          }}
          rules={[
            {
              required: true,
              message: "Please select your birthday! This site is restricted to 21+.",
              type: 'object',
            }]}
        />
      </Form.Item>
      <Form.Item
        name="profilePic"
        label="Profile Picture"
        tooltip="Links only please!"
        rules={[
          {
            required: false,
            message: "Please provide a link for an image of you!",
            whitespace: true,
          },
        ]}
      >
        <Input
          placeholder="Set your picture from a URL (.jpeg, .png)"
          name="profilePic"
          onChange={handleInputChange}
          value={userFormData.profilePic}
        />
      </Form.Item>
      <Form.Item
        name="postalCode"
        label="Postal Code"
        rules={[
          {
            required: true,
            message: "Please put the postal code for where you live.",
            whitespace: true,
          },
        ]}
      >
        <Input
          placeholder="Postal Code"
          name="postalCode"
          onChange={handleInputChange}
          value={userFormData.postalCode}
        />
      </Form.Item>
      
      <Form.Item
        name="pronouns"
        label="Pronouns"
        rules={[
          {
            required: true,
            message: "Please select one",
          },
        ]}
      >
        <Select
          name="pronouns"
          onChange={handleSelectChange}
          value={userFormData.pronouns}
          placeholder="Would you like to share your pronouns?"
        >
          <Option value="He/Him">He/Him</Option>
          <Option value="She/Her">She/Her</Option>
          <Option value="They/Them">They/Them</Option>
          <Option value="Other">Other</Option>
          <Option value="Prefer-not-to-say">Prefer not to say</Option>
          {userFormData.pronouns === 'Prefer-not-to-say' && (
            <Input/>
          )}
        </Select>
      </Form.Item>

      <Form.Item
        name="bio"
        label="Bio"
        rules={[
          {
            required: false,
            message: "Please tell us a little about yourself!",
          },
        ]}
      >
        <Input.TextArea
          placeholder="Share a bit about yourself!"
          name="bio"
          onChange={handleInputChange}
          value={userFormData.bio}
          showCount
          maxLength={250}
        />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Signup;
