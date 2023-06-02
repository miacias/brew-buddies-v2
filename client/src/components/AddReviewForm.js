import React, { useState, useEffect } from 'react';
import { useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Form, Rate, Input, Button } from 'antd';
import { ADD_REVIEW } from '../utils/mutations';
import Auth from "../utils/auth";


export default function AddReviewForm({ showForm, setShowForm, onReviewAdded }) {
    let { breweryId } = useParams();
    const [form] = Form.useForm();
    const [reviewFormData, setUserFormData] = useState({});

    const [addReview, { error }] = useMutation(ADD_REVIEW);

    useEffect(() => {
        setUserFormData({ ...reviewFormData, brewery: breweryId });
    }, []);

    // sets State to track user input
    const handleInputChange = (event) => {
        let value = event;
        if (typeof value === 'number') {
            setUserFormData({...reviewFormData, rating: value.toString()});
        } else {
            let { value } = event.target;
            setUserFormData({ ...reviewFormData, text: value });
        }
    };

    // adds review to database and empties form
    const handleReviewSubmit = async (values) => {
        setUserFormData({...reviewFormData, values});
        try {
            const { data } = await addReview({
                variables: { ...reviewFormData, rating: parseInt(reviewFormData.rating) }
            });
            if (!data) {
                throw new Error('Unable to add review.');
            }  
            // lifted up to BreweryPage 
            onReviewAdded(); 
        } catch (err) {
          console.error(err);
          Form.resetFields();
        }
        setUserFormData({
            text: '',
            rating: 0
        });
        setShowForm(!showForm);
    };

    // prevents user from adding review if logged out
    if (Auth.loggedIn()) {
        return (
            <Form
                name='add-review'
                form={form}
                onFinish={handleReviewSubmit}
                initialValues={{rating: 0, review: ''}}
                style={{maxWidth: 600}}
            >
                <Form.Item name='rating' label='Rate'>
                    <Rate 
                        name='rating'
                        onChange={handleInputChange}
                        value={reviewFormData.rating}
                    />
                </Form.Item>
                <Form.Item name='text' label='Review Details'>
                    <Input.TextArea
                        placeholder='Tell us your thoughts!'
                        name='text'
                        onChange={handleInputChange}
                        value={reviewFormData.text}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type='primary'
                        htmlType='submit'
                    >
                        Save
                    </Button>
                </Form.Item>
            </Form>
        )
    } else {
        return (<h2>Please log in!</h2>);
    };
}