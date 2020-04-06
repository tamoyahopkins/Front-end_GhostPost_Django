// Plan:
//     1. create fetch request and get data printing to screen
//     2. mockup html for page
//     3. figure out how to filter requests so you can show boasts and roast separately
//     4. wire up buttons so they filter conditionally

import React, { Component } from "react";
import NewPost from './createpost';

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

async function testRequest(method) {
    const response = await fetch(`${API_HOST}/ping/`, {
        method: method,
        headers: (
            method === 'POST'
                ? { 'X-CSRFToken': await getCsrfToken() }
                : {}
        ),
        credentials: 'include',
    });
    const data = await response.json();
    // console.log(data);
    return data.result;
}

async function allPosts(method) {
    const response = await fetch(`${API_HOST}/api/post/`, {
        method: method,
        headers: (
            method === 'POST'
                ? { 'X-CSRFToken': await getCsrfToken() }
                : {}
        ),
        credentials: 'include',
    });
    const data = await response.json();
    // console.log('allPosts', data);
    return data;
}

async function mostPopular(method) {
    const response = await fetch(`${API_HOST}/api/post/mostpopular/mostpopular/`, {
        method: method,
        headers: (
            method === 'POST'
                ? { 'X-CSRFToken': await getCsrfToken() }
                : {}
        ),
        credentials: 'include',
    });
    const data = await response.json();
    return data;
}

async function vote(method, vote_type, id) {
    const response = await fetch(`${API_HOST}/api/post/${id}/${vote_type}/`, {
        method: method,
        headers: (
            method === 'POST'
                ? { 'X-CSRFToken': await getCsrfToken() }
                : {}
        ),
        credentials: 'include',
    });
    const data = await response.json();
    console.log(data)
    return data;
}


class GhostPost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            teststate: false,
            show_create: false
        }
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    async componentDidMount() {
        this.setState({
            testGet: await testRequest('GET'),
            testPost: await testRequest('POST'),
            allPosts: await allPosts('GET'),
            mostPopular: await mostPopular('GET')
        });
        console.log('state', this.state);
    };


    handle_show(item){
        const keys = ['all','boasts', 'roasts', 'most_popular']
        let result = {}

        for (let x in keys){
            if (keys[x] === item){
                result[keys[x]] = true
            }
            else result[keys[x]] = false
        }
        this.setState(result, ()=> console.log('updated state.show_items', this.state))

    }

    handle_vote(vote_type, id){
        vote('POST', vote_type, id).then(this.setState({ testvote: !this.state.testvote }))
    }

    get_all = () => {
        let all = this.state.allPosts;

        if (this.state.most_popular){
            let most_popular = this.state.mostPopular;
            all = most_popular
        }

        if (this.state.boasts){
            let boasts = [];
            for (let post in all) {
                if (all[post].post_type === 'B') boasts.push(all[post]);
            }
            all = boasts;
        }

        if (this.state.roasts) {
            let roasts = [];
            for (let post in all) {
                if (all[post].post_type === 'R') roasts.push(all[post]);
            }
            all = roasts;
        }

        if (this.state.all && !this.state.show_create) {
            all = this.state.allPosts
        }


        let result = []
        for(let post in all){
            result.push(<br></br>)
            result.push((
                <div id='post' style={{ display: 'flex', flexDirection: 'column', width: '400px', border: '1px solid black'}}>
                    {all[post].post_type === 'B' ? 'Boast' : 'Roast'}
                    <p disabled>{all[post].text}</p>
                    <div>
                    <button value={all[post].id} onClick={()=> {this.handle_vote('vote_up', all[post].id)}}>Likes: {all[post].up}</button>
                    <button onClick={()=> {this.handle_vote('vote_down', all[post].id) }}>Dislikes: {all[post].down}</button>
                    </div>
                </div>
            ))
        };

        return result;
    };

    render() {
        return (
            <React.Fragment>
            <div>
                <button onClick={()=> {this.handle_show('all')}}>All</button>
                <button onClick={()=> {this.handle_show('boasts')}}>Boasts</button>
                <button onClick={()=> {this.handle_show('roasts') }}>Roasts</button>
                <button onClick={()=> {this.handle_show('most_popular')}}>Most Popular</button>
                <button onClick={()=> {this.setState({show_create: !this.state.show_create})}}>Create Post</button>
            </div>
            {(this.state.show_create)? <NewPost/> : ''}
            <br></br>
            <div id='post-container'>
                {this.get_all()}
            </div>
            </React.Fragment>
        );
    }
}

export default GhostPost;
