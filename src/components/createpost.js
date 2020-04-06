import React, { Component } from "react";

const API_HOST = 'http://localhost:8000';

let _csrfToken = null;

async function getCsrfToken() {
    if (_csrfToken === null) {
        const response = await fetch(`${API_HOST}/csrf/`, {
            credentials: 'include',
        });
        const data = await response.json();
        _csrfToken = data.csrfToken;
    }
    return _csrfToken;
}

async function createPost(method, post_type, text) {
    let new_post = JSON.stringify({'post_type': post_type, 'text': text})
    // console.log('new_post_data', new_post)
    const response = await fetch(`${API_HOST}/api/post/`, {
        method: method,
        headers: (
            method === 'POST'
                ? { 'X-CSRFToken': await getCsrfToken(), "Content-type": "application/json"}
                : {}
        ),
        credentials: 'include',
        body: new_post
    });
    const data = await response.json();
    // console.log('response', response)
    console.log('createPost data', data)
    return data;
}


class NewPost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            post_type: '',
            show_create: true
        };
        this.handleText = this.handleText.bind(this);
        this.handlePostType = this.handlePostType.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleText(event) {
        this.setState({text: event.target.value})
    }

    handlePostType(event) {
        this.setState({post_type: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        await createPost('POST', this.state.post_type, this.state.text)
        this.setState({show_create: !this.state.show_create})
    }

    render(){
            return this.state.show_create ?
            (<div style={{ border: '1px solid black', width: '400px', marginTop: '15px', paddingTop: '10px', paddingBottom: '10px'}}>
                <form onSubmit={this.handleSubmit}>
                    <label for='textbox'>Add boast or roast: </label>
                    <br></br>
                    <textarea type="text" name='textbox' value={this.state.text} onChange={this.handleText} maxLength='280' placeholder='Max 280 characters.'/>
                    <br></br>
                        <select name='select' value={this.state.post_type} onChange={this.handlePostType} required>
                        <option value="">Select</option>
                        <option value="B">Boast</option>
                        <option value="R">Roast</option>
                    </select>
                    <button type='submit'>Submit</button>
                </form>
            </div>
        )
        : !this.state.show_create? (<div>Post added!</div>): null
    }
}

export default NewPost;
