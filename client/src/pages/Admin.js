import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_ITEM } from '../utils/mutations';
import Auth from "../utils/auth";

function Admin() {
    const [formState, setFormState] = useState({ name: "", description: "", price: "", tags: "" })
    const [errorMessage, setErrorMessage] = useState("")
    const [addItem, { error }] = useMutation(ADD_ITEM)

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        })
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const priceFloat = parseFloat(formState.price)
        if (!formState.name.length || !formState.description.length || !formState.price.length || !formState.tags.length) {
            setErrorMessage('Please make sure all fields are filled out')
            return
        }

        const tagArray = formState.tags.split(', ')

        try {
            const newItem = await addItem({
                variables: { name: formState.name, description: formState.description, price: priceFloat, tags: tagArray }
            })
            if(newItem) {setErrorMessage("Item submitted successfully")}
        } catch (e) {
            console.log(e)
        }

    }

    return (
        <div>
            {Auth.isAdmin() ?
            <div className="container my-1">
                <h2>Add new product</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="flex-row space-between my-2">
                        <label htmlFor="name">Name:</label>
                        <input
                            placeholder="Item name"
                            name="name"
                            type="text"
                            id="name"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex-row space-between my-2">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            placeholder="Description"
                            name="description"
                            type="text"
                            id="description"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex-row space-between my-2">
                        <label htmlFor="name">Price:</label>
                        <input
                            placeholder="00.00"
                            name="price"
                            type="text"
                            id="price"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex-row space-between my-2">
                        <label htmlFor="name">Tags:</label>
                        <input
                            placeholder="List tags, separated by commas"
                            name="tags"
                            type="text"
                            id="tags"
                            onChange={handleChange}
                        />
                    </div>

                    {errorMessage && (
                        <div>
                            <p className="error-text">{errorMessage}</p>
                        </div>
                    )}

                    <div className="flex-row flex-end">
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
            : 
            <h3>You do not have permissions to access this page</h3> }
        </div>



    )
}

export default Admin;